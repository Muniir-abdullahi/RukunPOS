import React, { useEffect, useMemo, useState } from 'react';
import { Deferred, router, useForm, usePage } from '@inertiajs/react';
import { Edit, Eye, FilePlus2, Save, Trash2, X } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { ProductRowTable, type ProductRow, type SelectProduct } from '@/Components/forms/ProductRowTable';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { DataTable } from '@/Components/ui/DataTable';
import { useTableFilter } from '@/hooks/useTableFilter';
import { cn } from '@/lib/utils';

interface CustomerOption {
  id: number;
  name: string;
}

interface QuotationRecord {
  id: number;
  reference?: string;
  customer_id: number | null;
  customer?: string | { name: string } | null;
  date?: string;
  quotation_date?: string;
  status: string;
  grand_total: number | string;
  note?: string | null;
  items?: Array<{
    product_id: number;
    quantity: number | string;
    unit_price: number | string;
    tax_amount: number | string;
    discount_amount: number | string;
    line_total: number | string;
  }>;
}

interface QuotationPageProps {
  quotations?: unknown;
  quotation?: QuotationRecord;
  customers?: CustomerOption[];
  products?: SelectProduct[];
  filters?: Record<string, unknown>;
}

const toNumber = (value: number | string | undefined) => Number(value ?? 0);
const today = () => new Date().toISOString().slice(0, 10);

const quotationRows = (quotation?: QuotationRecord): ProductRow[] =>
  quotation?.items?.map((item) => ({
    product_id: item.product_id,
    quantity: toNumber(item.quantity),
    unit_cost: 0,
    unit_price: toNumber(item.unit_price),
    tax_amount: toNumber(item.tax_amount),
    discount_amount: toNumber(item.discount_amount),
    line_total: toNumber(item.line_total),
  })) ?? [];

function QuotationForm({
  quotation,
  customers,
  products,
  onClose,
}: {
  quotation?: QuotationRecord;
  customers: CustomerOption[];
  products: SelectProduct[];
  onClose: () => void;
}) {
  const isEditing = Boolean(quotation?.id);
  const { data, setData, post, patch, processing, errors } = useForm({
    customer_id: quotation?.customer_id ?? '',
    quotation_date: quotation?.quotation_date ?? quotation?.date ?? today(),
    status: quotation?.status ?? 'pending',
    note: quotation?.note ?? '',
    tax_total: 0,
    discount_total: 0,
    items: quotationRows(quotation),
  });

  const totals = useMemo(() => {
    const subtotal = data.items.reduce((sum, row) => sum + (row.quantity * toNumber(row.unit_price)), 0);
    const lineTax = data.items.reduce((sum, row) => sum + row.tax_amount, 0);
    const lineDiscount = data.items.reduce((sum, row) => sum + row.discount_amount, 0);

    return {
      subtotal,
      tax: lineTax,
      discount: lineDiscount,
      grand: Math.max(subtotal + lineTax - lineDiscount, 0),
    };
  }, [data.items]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const options = { preserveScroll: true, onSuccess: onClose };

    if (isEditing && quotation) {
      patch(`/quotations/${quotation.id}`, options);
      return;
    }

    post('/quotations', options);
  };

  const updateItems = (items: ProductRow[]) => {
    setData((current) => ({
      ...current,
      items,
      tax_total: items.reduce((sum, row) => sum + row.tax_amount, 0),
      discount_total: items.reduce((sum, row) => sum + row.discount_amount, 0),
    }));
  };

  const inputClass = (field?: string) => cn(
    'w-full rounded-md border bg-white px-3 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20',
    field && errors[field] ? 'border-red-300' : 'border-gray-300',
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/55 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={submit} className="relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Quotation' : 'New Quotation'}</h2>
            <p className="mt-1 text-sm text-gray-500">Prepare customer pricing with dynamic product rows.</p>
          </div>
          <button type="button" title="Close form" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <Card>
            <CardContent className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
              <label className="text-sm font-semibold text-gray-700">
                Customer
                <select value={data.customer_id} onChange={(event) => setData('customer_id', event.target.value)} className={inputClass('customer_id')}>
                  <option value="">Walk-in customer</option>
                  {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
                </select>
              </label>
              <label className="text-sm font-semibold text-gray-700">
                Quotation Date
                <input type="date" value={data.quotation_date} onChange={(event) => setData('quotation_date', event.target.value)} className={inputClass('quotation_date')} />
              </label>
              <label className="text-sm font-semibold text-gray-700">
                Status
                <select value={data.status} onChange={(event) => setData('status', event.target.value)} className={inputClass('status')}>
                  <option value="pending">Pending</option>
                  <option value="sent">Sent</option>
                  <option value="accepted">Accepted</option>
                  <option value="declined">Declined</option>
                </select>
              </label>
            </CardContent>
          </Card>

          <ProductRowTable rows={data.items} products={products} mode="quotation" errors={errors} onChange={updateItems} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            <Card>
              <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
              <CardContent>
                <textarea value={data.note} onChange={(event) => setData('note', event.target.value)} rows={5} className={inputClass('note')} placeholder="Terms, validity, delivery expectations, or customer notes" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-semibold tabular-nums">${totals.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tax</span><span className="font-semibold tabular-nums">${totals.tax.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Discount</span><span className="font-semibold text-red-600 tabular-nums">-${totals.discount.toFixed(2)}</span></div>
                <div className="flex justify-between border-t border-gray-200 pt-4 text-lg font-bold"><span>Total</span><span className="text-primary-text tabular-nums">${totals.grand.toFixed(2)}</span></div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex shrink-0 justify-end gap-3 border-t border-gray-200 bg-white px-6 py-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={processing || data.items.length === 0}>
            <Save className="mr-2 h-4 w-4" /> {processing ? 'Saving...' : isEditing ? 'Update Quotation' : 'Create Quotation'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function Page() {
  const { props } = usePage<QuotationPageProps>();
  const [formOpen, setFormOpen] = useState(Boolean(props.quotation));
  const table = useTableFilter({ only: ['quotations'], defaultFilters: props.filters ?? {} });

  useEffect(() => {
    if (props.quotation) setFormOpen(true);
  }, [props.quotation]);

  const closeForm = () => {
    setFormOpen(false);
    if (props.quotation) router.visit('/quotations', { preserveScroll: true });
  };

  const content = (
    <div className="mx-auto flex h-[calc(100vh-64px)] max-w-7xl flex-col overflow-hidden p-6">
      <div className="mb-6 flex shrink-0 items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
          <p className="mt-1 text-sm text-gray-500">Customer pricing proposals with reusable product rows.</p>
        </div>
        <Button onClick={() => setFormOpen(true)}><FilePlus2 className="mr-2 h-4 w-4" /> New Quotation</Button>
      </div>
      <DataTable
        data={props.quotations ?? null}
        loading={table.loading || props.quotations === undefined}
        rowKey="id"
        className="min-h-0 flex-1"
        initialFilters={table.filters}
        filters={[
          { key: 'search', label: 'Search', type: 'text', placeholder: 'Search quotations...' },
          { key: 'status', label: 'Status', type: 'select', options: ['pending', 'sent', 'accepted', 'declined', 'converted'].map((status) => ({ value: status, label: status.charAt(0).toUpperCase() + status.slice(1) })) },
        ]}
        onFilter={(filters) => table.reload(filters)}
        columns={[
          { key: 'reference', label: 'Reference' },
          { key: 'customer', label: 'Customer' },
          { key: 'date', label: 'Date' },
          { key: 'status', label: 'Status' },
          { key: 'grand_total', label: 'Total', className: 'text-right', render: (row) => `$${toNumber(row.grand_total).toFixed(2)}` },
        ]}
        actions={(row: QuotationRecord) => (
          <div className="flex justify-end gap-1">
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="View quotation" onClick={() => router.visit(`/quotations/${row.id}`)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-600" title="Edit quotation" onClick={() => router.visit(`/quotations/${row.id}`)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600" title="Delete quotation" onClick={() => window.confirm('Delete this quotation?') && router.delete(`/quotations/${row.id}`)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      {formOpen && <QuotationForm quotation={props.quotation} customers={props.customers ?? []} products={props.products ?? []} onClose={closeForm} />}
    </div>
  );

  return (
    <AppLayout>
      <Deferred data="quotations" fallback={content}>{content}</Deferred>
    </AppLayout>
  );
}
