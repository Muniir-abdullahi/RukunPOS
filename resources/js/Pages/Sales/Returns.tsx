import React, { useMemo, useState } from 'react';
import { Deferred, router, useForm, usePage } from '@inertiajs/react';
import { RotateCcw, Save, Trash2, X } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { ProductRowTable, type ProductRow, type SelectProduct } from '@/Components/forms/ProductRowTable';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { DataTable } from '@/Components/ui/DataTable';
import { useTableFilter } from '@/hooks/useTableFilter';
import { cn } from '@/lib/utils';

interface Option {
  id: number;
  name: string;
}

interface AccountOption extends Option {
  current_balance?: number | string;
}

interface SaleOption {
  id: number;
  reference: string;
  customer_id?: number | null;
  warehouse_id?: number;
  items?: Array<{
    id: number;
    product_id: number;
    product?: SelectProduct;
    product_name_snapshot?: string;
    sku_snapshot?: string;
    quantity: number | string;
    unit_price: number | string;
  }>;
}

interface ReturnRow {
  id: number;
  reference: string;
  customer?: string;
  date?: string;
  refund_method?: string;
  grand_total: number | string;
}

interface ReturnPageProps {
  returns?: unknown;
  filters?: Record<string, unknown>;
  sales?: SaleOption[];
  customers?: Option[];
  warehouses?: Option[];
  accounts?: AccountOption[];
  products?: SelectProduct[];
}

const toNumber = (value: number | string | undefined) => Number(value ?? 0);
const today = () => new Date().toISOString().slice(0, 10);

function SaleReturnForm({
  sales,
  customers,
  warehouses,
  accounts,
  products,
  onClose,
}: {
  sales: SaleOption[];
  customers: Option[];
  warehouses: Option[];
  accounts: AccountOption[];
  products: SelectProduct[];
  onClose: () => void;
}) {
  const { data, setData, post, processing, errors } = useForm({
    sale_id: '',
    customer_id: '',
    warehouse_id: '',
    return_date: today(),
    refund_method: 'cash',
    account_id: '',
    note: '',
    items: [] as ProductRow[],
  });

  const grandTotal = useMemo(() => data.items.reduce((sum, row) => sum + (row.quantity * toNumber(row.unit_price)), 0), [data.items]);

  const chooseSale = (saleId: string) => {
    const sale = sales.find((item) => item.id === Number(saleId));
    if (!sale) {
      setData('sale_id', saleId);
      return;
    }

    const rows: ProductRow[] = sale.items?.map((item) => ({
      sale_item_id: item.id,
      product_id: item.product_id,
      quantity: toNumber(item.quantity),
      max_quantity: toNumber(item.quantity),
      unit_cost: 0,
      unit_price: toNumber(item.unit_price),
      tax_amount: 0,
      discount_amount: 0,
      line_total: toNumber(item.quantity) * toNumber(item.unit_price),
    })) ?? [];

    setData((current) => ({
      ...current,
      sale_id: sale.id,
      customer_id: sale.customer_id ?? '',
      warehouse_id: sale.warehouse_id ?? '',
      items: rows,
    }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    post('/sales/returns', { preserveScroll: true, onSuccess: onClose });
  };

  const inputClass = (field?: string) => cn(
    'w-full rounded-md border bg-white px-3 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20',
    field && errors[field] ? 'border-red-300' : 'border-gray-300',
  );

  const idField = (
    key: 'customer_id' | 'warehouse_id',
    label: string,
    options: Option[],
    required = false,
  ) => (
    <label className="text-sm font-semibold text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
      {options.length > 0 ? (
        <select value={data[key]} onChange={(event) => setData(key, event.target.value)} className={inputClass(key)}>
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
        </select>
      ) : (
        <input type="number" min="1" value={data[key]} onChange={(event) => setData(key, event.target.value)} placeholder={`${label} ID`} className={inputClass(key)} />
      )}
      {errors[key] && <span className="mt-1 block text-xs text-red-600">{errors[key]}</span>}
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/55 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={submit} className="relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">New Sale Return</h2>
            <p className="mt-1 text-sm text-gray-500">Return sold items, restore stock, and record the refund.</p>
          </div>
          <button type="button" title="Close form" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <Card>
            <CardContent className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-4">
              <label className="text-sm font-semibold text-gray-700">
                Original Sale
                {sales.length > 0 ? (
                  <select value={data.sale_id} onChange={(event) => chooseSale(event.target.value)} className={inputClass('sale_id')}>
                    <option value="">Select sale</option>
                    {sales.map((sale) => <option key={sale.id} value={sale.id}>{sale.reference}</option>)}
                  </select>
                ) : (
                  <input type="number" min="1" value={data.sale_id} onChange={(event) => setData('sale_id', event.target.value)} placeholder="Sale ID" className={inputClass('sale_id')} />
                )}
              </label>
              {idField('customer_id', 'Customer', customers)}
              {idField('warehouse_id', 'Warehouse', warehouses, true)}
              <label className="text-sm font-semibold text-gray-700">
                Return Date
                <input type="date" value={data.return_date} onChange={(event) => setData('return_date', event.target.value)} className={inputClass('return_date')} />
              </label>
            </CardContent>
          </Card>

          <ProductRowTable rows={data.items} products={products} mode="sale" errors={errors} onChange={(items) => setData('items', items)} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            <Card>
              <CardHeader><CardTitle>Refund Details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="text-sm font-semibold text-gray-700">
                  Refund Method
                  <select value={data.refund_method} onChange={(event) => setData('refund_method', event.target.value)} className={inputClass('refund_method')}>
                    <option value="cash">Cash</option>
                    <option value="bank">Bank</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="store_credit">Store Credit</option>
                  </select>
                </label>
                <label className="text-sm font-semibold text-gray-700">
                  Refund Account
                  {accounts.length > 0 ? (
                    <select value={data.account_id} onChange={(event) => setData('account_id', event.target.value)} className={inputClass('account_id')}>
                      <option value="">No account adjustment</option>
                      {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
                    </select>
                  ) : (
                    <input type="number" min="1" value={data.account_id} onChange={(event) => setData('account_id', event.target.value)} placeholder="Account ID" className={inputClass('account_id')} />
                  )}
                </label>
                <label className="text-sm font-semibold text-gray-700 md:col-span-2">
                  Note
                  <textarea value={data.note} onChange={(event) => setData('note', event.target.value)} rows={4} className={inputClass('note')} placeholder="Return reason and refund notes" />
                </label>
              </CardContent>
            </Card>
            <Card className="h-fit">
              <CardHeader><CardTitle>Refund Summary</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total Refund</span>
                  <span className="text-primary-text tabular-nums">${grandTotal.toFixed(2)}</span>
                </div>
                <p className="mt-3 text-xs leading-5 text-gray-500">Returned quantities are added back to the selected warehouse when the return is created.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex shrink-0 justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={processing || data.items.length === 0 || !data.warehouse_id}>
            <Save className="mr-2 h-4 w-4" /> {processing ? 'Saving...' : 'Create Return'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function Page() {
  const { props } = usePage<ReturnPageProps>();
  const [formOpen, setFormOpen] = useState(false);
  const table = useTableFilter({ only: ['returns'], defaultFilters: props.filters ?? {} });

  const content = (
    <div className="mx-auto flex h-[calc(100vh-64px)] max-w-7xl flex-col overflow-hidden p-6">
      <div className="mb-6 flex shrink-0 items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sale Returns</h1>
          <p className="mt-1 text-sm text-gray-500">Refund sold items and restore inventory.</p>
        </div>
        <Button onClick={() => setFormOpen(true)}><RotateCcw className="mr-2 h-4 w-4" /> New Return</Button>
      </div>
      <DataTable
        data={props.returns ?? null}
        loading={table.loading || props.returns === undefined}
        rowKey="id"
        className="min-h-0 flex-1"
        initialFilters={table.filters}
        filters={[{ key: 'search', label: 'Search', type: 'text', placeholder: 'Search returns...' }]}
        onFilter={(filters) => table.reload(filters)}
        columns={[
          { key: 'reference', label: 'Reference' },
          { key: 'customer', label: 'Customer' },
          { key: 'date', label: 'Date' },
          { key: 'refund_method', label: 'Refund' },
          { key: 'grand_total', label: 'Total', className: 'text-right', render: (row) => `$${toNumber(row.grand_total).toFixed(2)}` },
        ]}
        actions={(row: ReturnRow) => (
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600" title="Delete return" onClick={() => window.confirm('Delete this return?') && router.delete(`/sales/returns/${row.id}`)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      />

      {formOpen && (
        <SaleReturnForm
          sales={props.sales ?? []}
          customers={props.customers ?? []}
          warehouses={props.warehouses ?? []}
          accounts={props.accounts ?? []}
          products={props.products ?? []}
          onClose={() => setFormOpen(false)}
        />
      )}
    </div>
  );

  return (
    <AppLayout>
      <Deferred data="returns" fallback={content}>{content}</Deferred>
    </AppLayout>
  );
}
