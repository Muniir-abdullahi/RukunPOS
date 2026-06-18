import React, { useMemo } from 'react';
import { router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { ProductRowTable, type ProductRow, type SelectProduct } from '@/Components/forms/ProductRowTable';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { cn } from '@/lib/utils';

interface Option {
  id: number;
  name: string;
}

interface AccountOption extends Option {
  type: string;
  current_balance: number | string;
}

interface PurchaseRecord {
  id: number;
  supplier_id: number | null;
  warehouse_id?: number;
  date?: string;
  purchase_date?: string;
  status: string;
  shipping_total?: number | string;
  note?: string | null;
  items?: Array<{
    product_id: number;
    quantity: number | string;
    unit_cost: number | string;
    tax_amount: number | string;
    discount_amount: number | string;
    line_total: number | string;
  }>;
}

interface PurchasePageProps {
  purchase?: PurchaseRecord;
  suppliers?: Option[];
  warehouses?: Option[];
  products?: SelectProduct[];
  accounts?: AccountOption[];
}

const toNumber = (value: number | string | undefined) => Number(value ?? 0);
const today = () => new Date().toISOString().slice(0, 10);

const normalizeRows = (purchase?: PurchaseRecord): ProductRow[] =>
  purchase?.items?.map((item) => ({
    product_id: item.product_id,
    quantity: toNumber(item.quantity),
    unit_cost: toNumber(item.unit_cost),
    unit_price: 0,
    tax_amount: toNumber(item.tax_amount),
    discount_amount: toNumber(item.discount_amount),
    line_total: toNumber(item.line_total),
  })) ?? [];

export default function Page() {
  const { props } = usePage<PurchasePageProps>();
  const purchase = props.purchase;
  const isEditing = Boolean(purchase?.id);
  const suppliers = props.suppliers ?? [];
  const warehouses = props.warehouses ?? [];
  const products = props.products ?? [];
  const accounts = props.accounts ?? [];

  const { data, setData, post, patch, processing, errors } = useForm({
    supplier_id: purchase?.supplier_id ?? '',
    warehouse_id: purchase?.warehouse_id ?? '',
    purchase_date: purchase?.purchase_date ?? purchase?.date ?? today(),
    status: purchase?.status ?? 'pending',
    shipping_total: toNumber(purchase?.shipping_total),
    note: purchase?.note ?? '',
    items: normalizeRows(purchase),
    payment: {
      account_id: '',
      payment_method: 'cash',
      amount: 0,
      reference: '',
      note: '',
    },
  });

  const totals = useMemo(() => {
    const subtotal = data.items.reduce((sum, row) => sum + (row.quantity * toNumber(row.unit_cost)), 0);
    const tax = data.items.reduce((sum, row) => sum + row.tax_amount, 0);
    const discount = data.items.reduce((sum, row) => sum + row.discount_amount, 0);
    const grand = Math.max(subtotal + tax + toNumber(data.shipping_total) - discount, 0);

    return { subtotal, tax, discount, grand };
  }, [data.items, data.shipping_total]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const options = { preserveScroll: true };
    if (isEditing && purchase) {
      patch(`/purchases/${purchase.id}`, options);
      return;
    }

    post('/purchases', options);
  };

  const inputClass = (field?: string) => cn(
    'w-full rounded-md border bg-white px-3 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20',
    field && errors[field] ? 'border-red-300' : 'border-gray-300',
  );

  return (
    <AppLayout>
      <form onSubmit={submit} className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" className="h-10 w-10 p-0" title="Back to purchases" onClick={() => router.visit('/purchases')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Purchase' : 'New Purchase'}</h1>
              <p className="mt-1 text-sm text-gray-500">Supplier invoice, product costs, stock receipt, and payment details.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => router.visit('/purchases')}>Cancel</Button>
            <Button type="submit" disabled={processing || data.items.length === 0}>
              <Save className="mr-2 h-4 w-4" /> {processing ? 'Saving...' : isEditing ? 'Update Purchase' : 'Create Purchase'}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>Purchase Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="text-sm font-semibold text-gray-700">
              Supplier
              <select value={data.supplier_id} onChange={(event) => setData('supplier_id', event.target.value)} className={inputClass('supplier_id')}>
                <option value="">No supplier</option>
                {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
              </select>
              {errors.supplier_id && <span className="mt-1 block text-xs text-red-600">{errors.supplier_id}</span>}
            </label>
            <label className="text-sm font-semibold text-gray-700">
              Warehouse <span className="text-red-500">*</span>
              <select value={data.warehouse_id} onChange={(event) => setData('warehouse_id', event.target.value)} className={inputClass('warehouse_id')}>
                <option value="">Select warehouse</option>
                {warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}
              </select>
              {errors.warehouse_id && <span className="mt-1 block text-xs text-red-600">{errors.warehouse_id}</span>}
            </label>
            <label className="text-sm font-semibold text-gray-700">
              Purchase Date
              <input type="date" value={data.purchase_date} onChange={(event) => setData('purchase_date', event.target.value)} className={inputClass('purchase_date')} />
              {errors.purchase_date && <span className="mt-1 block text-xs text-red-600">{errors.purchase_date}</span>}
            </label>
            <label className="text-sm font-semibold text-gray-700">
              Status
              <select value={data.status} onChange={(event) => setData('status', event.target.value)} className={inputClass('status')}>
                <option value="pending">Pending</option>
                <option value="ordered">Ordered</option>
                <option value="received">Received</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
          </CardContent>
        </Card>

        <ProductRowTable rows={data.items} products={products} mode="purchase" errors={errors} onChange={(items) => setData('items', items)} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {data.status === 'received' && !isEditing && (
              <Card>
                <CardHeader><CardTitle>Payment</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Account
                    <select value={data.payment.account_id} onChange={(event) => setData('payment', { ...data.payment, account_id: event.target.value })} className={inputClass('payment.account_id')}>
                      <option value="">No payment account</option>
                      {accounts.map((account) => <option key={account.id} value={account.id}>{account.name} (${toNumber(account.current_balance).toFixed(2)})</option>)}
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-gray-700">
                    Payment Method
                    <select value={data.payment.payment_method} onChange={(event) => setData('payment', { ...data.payment, payment_method: event.target.value })} className={inputClass()}>
                      <option value="cash">Cash</option>
                      <option value="bank">Bank</option>
                      <option value="mobile_money">Mobile Money</option>
                      <option value="card">Card</option>
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-gray-700">
                    Amount
                    <input type="number" min="0" step="0.01" value={data.payment.amount} onChange={(event) => setData('payment', { ...data.payment, amount: toNumber(event.target.value) })} className={inputClass('payment.amount')} />
                    {errors['payment.amount'] && <span className="mt-1 block text-xs text-red-600">{errors['payment.amount']}</span>}
                  </label>
                  <label className="text-sm font-semibold text-gray-700">
                    Payment Reference
                    <input value={data.payment.reference} onChange={(event) => setData('payment', { ...data.payment, reference: event.target.value })} className={inputClass()} />
                  </label>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
              <CardContent>
                <textarea value={data.note} onChange={(event) => setData('note', event.target.value)} rows={4} className={inputClass('note')} placeholder="Supplier terms, delivery notes, or internal remarks" />
              </CardContent>
            </Card>
          </div>

          <Card className="h-fit">
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-semibold tabular-nums">${totals.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tax</span><span className="font-semibold tabular-nums">${totals.tax.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Discount</span><span className="font-semibold text-red-600 tabular-nums">-${totals.discount.toFixed(2)}</span></div>
              <label className="block border-t border-gray-100 pt-3 font-semibold text-gray-700">
                Shipping
                <input type="number" min="0" step="0.01" value={data.shipping_total} onChange={(event) => setData('shipping_total', toNumber(event.target.value))} className={inputClass('shipping_total')} />
              </label>
              <div className="flex justify-between border-t border-gray-200 pt-4 text-lg font-bold"><span>Grand Total</span><span className="text-primary-text tabular-nums">${totals.grand.toFixed(2)}</span></div>
              {data.status === 'received' && !isEditing && (
                <Button type="button" variant="outline" className="w-full" onClick={() => setData('payment', { ...data.payment, amount: totals.grand })}>
                  Pay full amount
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </AppLayout>
  );
}
