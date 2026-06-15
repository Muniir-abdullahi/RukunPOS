import React, { useState } from 'react';
import { Deferred, router, usePage } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { DataTable } from '@/Components/ui/DataTable';
import { cn } from '@/lib/utils';

const primary = '#1D9E75';
const chartColors = ['#1D9E75', '#2563EB', '#D97706', '#DC2626', '#0F172A'];

const money = (value: unknown) => `$${Number(value ?? 0).toFixed(2)}`;

function currentMonthRange(filters: Record<string, any>) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);

  return {
    date_from: filters.date_from ?? start,
    date_to: filters.date_to ?? end,
    warehouse_id: filters.warehouse_id ?? '',
  };
}

function SummaryCard({ title, value, tone = 'default' }: { title: string; value: string | number; tone?: 'default' | 'green' | 'red' | 'teal' }) {
  return (
    <Card className={cn(tone === 'green' && 'border-green-200', tone === 'red' && 'border-red-200', tone === 'teal' && 'border-primary/30')}>
      <CardContent className="p-5">
        <p className="text-sm font-semibold text-gray-500">{title}</p>
        <p className={cn('mt-2 text-2xl font-bold text-gray-900', tone === 'green' && 'text-green-700', tone === 'red' && 'text-red-700', tone === 'teal' && 'text-primary-text')}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function FilterBar({ filters, setFilters, apply, warehouses }: { filters: Record<string, any>; setFilters: (filters: Record<string, any>) => void; apply: () => void; warehouses?: { id: number; name: string }[] }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-gray-500">From</label>
          <input type="date" value={filters.date_from} onChange={(event) => setFilters({ ...filters, date_from: event.target.value })} className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold uppercase text-gray-500">To</label>
          <input type="date" value={filters.date_to} onChange={(event) => setFilters({ ...filters, date_to: event.target.value })} className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </div>
        {warehouses && (
          <div>
            <label className="mb-1 block text-xs font-bold uppercase text-gray-500">Warehouse</label>
            <select value={filters.warehouse_id} onChange={(event) => setFilters({ ...filters, warehouse_id: event.target.value })} className="rounded-md border border-gray-300 px-3 py-2 text-sm">
              <option value="">All warehouses</option>
              {warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}
            </select>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" type="button">Export CSV</Button>
        <Button type="button" className="bg-primary text-white hover:bg-primary-dark" onClick={apply}>Apply</Button>
      </div>
    </div>
  );
}

function EmptyState({ filters }: { filters: Record<string, any> }) {
  return <div className="rounded-lg border border-dashed border-gray-200 bg-white p-8 text-center text-sm font-medium text-gray-500">No data for selected period ({filters.date_from} to {filters.date_to}).</div>;
}

function SalesReport({ report, filters }: { report: any; filters: Record<string, any> }) {
  const rows = report?.rows ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard title="Total Sales" value={report?.total_sales ?? 0} />
        <SummaryCard title="Total Revenue" value={money(report?.total_revenue)} tone="green" />
        <SummaryCard title="Total Discount" value={money(report?.total_discount)} />
        <SummaryCard title="Net Revenue" value={money(report?.net_revenue)} tone="teal" />
      </div>
      {rows.length === 0 ? <EmptyState filters={filters} /> : (
        <>
          <Card>
            <CardHeader><CardTitle>Revenue Per Day</CardTitle></CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rows}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `$${Number(value).toFixed(0)}`} />
                  <Tooltip formatter={(value) => money(value)} />
                  <Line type="monotone" dataKey="revenue" stroke={primary} strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <DataTable data={rows} columns={[
            { key: 'date', label: 'Date' },
            { key: 'sales_count', label: 'Sales Count' },
            { key: 'revenue', label: 'Revenue', cell: (row) => money(row.revenue) },
            { key: 'discount', label: 'Discount', cell: (row) => money(row.discount) },
            { key: 'tax', label: 'Tax', cell: (row) => money(row.tax) },
            { key: 'net', label: 'Net', cell: (row) => money(Number(row.revenue ?? 0) - Number(row.discount ?? 0)) },
          ]} />
        </>
      )}
    </div>
  );
}

function PurchasesReport({ report, filters }: { report: any; filters: Record<string, any> }) {
  const rows = report?.rows ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SummaryCard title="Total Purchases" value={report?.total_purchases ?? 0} />
        <SummaryCard title="Total Amount" value={money(report?.total_amount)} />
        <SummaryCard title="Total Paid" value={money(report?.paid_total)} tone="green" />
        <SummaryCard title="Total Due" value={money(report?.due_total)} tone="red" />
      </div>
      {rows.length === 0 ? <EmptyState filters={filters} /> : (
        <DataTable data={rows} columns={[
          { key: 'date', label: 'Date' },
          { key: 'reference', label: 'Reference' },
          { key: 'supplier', label: 'Supplier' },
          { key: 'amount', label: 'Amount', cell: (row) => money(row.amount) },
          { key: 'status', label: 'Status' },
          { key: 'payment_status', label: 'Payment Status' },
        ]} />
      )}
    </div>
  );
}

function ProfitLossReport({ report }: { report: any }) {
  const netProfit = Number(report?.net_profit ?? 0);
  const breakdown = [
    ['Revenue', report?.revenue, 'text-green-700'],
    ['Cost of Goods Sold', -Number(report?.cost_of_goods ?? 0), 'text-red-700'],
    ['Gross Profit', report?.gross_profit, 'text-gray-900'],
    ['Operating Expenses', -Number(report?.expenses ?? 0), 'text-red-700'],
    ['Net Profit', netProfit, netProfit >= 0 ? 'text-primary-text' : 'text-red-700'],
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard title="Revenue" value={money(report?.revenue)} tone="green" />
        <SummaryCard title="Expenses" value={money(report?.expenses)} tone="red" />
        <SummaryCard title="Net Profit" value={money(netProfit)} tone={netProfit >= 0 ? 'teal' : 'red'} />
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Breakdown</CardTitle>
          <span className={cn('rounded-full px-3 py-1 text-xs font-bold', netProfit >= 0 ? 'bg-primary-light text-primary-text' : 'bg-red-100 text-red-700')}>
            Margin {Number(report?.margin_percent ?? 0).toFixed(2)}%
          </span>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              {breakdown.map(([label, value, color]) => (
                <tr key={String(label)}>
                  <td className={cn('py-3 font-semibold', label === 'Net Profit' && 'text-base')}>{label}</td>
                  <td className={cn('py-3 text-right font-bold', color as string, label === 'Net Profit' && 'text-base')}>{money(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function StockReport({ report }: { report: any }) {
  const rows = report?.products ?? [];

  return rows.length === 0 ? <EmptyState filters={{ date_from: 'all', date_to: 'all' }} /> : (
    <DataTable data={rows} columns={[
      { key: 'product', label: 'Product', cell: (row) => row.product?.name ?? '-' },
      { key: 'sku', label: 'SKU', cell: (row) => row.product?.sku ?? '-' },
      { key: 'category', label: 'Category', cell: (row) => row.product?.category?.name ?? '-' },
      { key: 'quantity', label: 'In Stock', cell: (row) => Number(row.quantity).toFixed(3) },
      { key: 'min', label: 'Min Stock', cell: (row) => Number(row.product?.alert_quantity ?? 0).toFixed(3) },
      { key: 'status', label: 'Status', cell: (row) => {
        const stock = Number(row.quantity ?? 0);
        const min = Number(row.product?.alert_quantity ?? 0);
        const label = stock <= 0 ? 'Out of Stock' : stock <= min / 2 ? 'Critical' : stock <= min ? 'Low Stock' : 'In Stock';
        const cls = label === 'Out of Stock' ? 'bg-red-100 text-red-700' : label === 'Critical' ? 'bg-orange-100 text-orange-700' : label === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700';

        return <span className={cn('rounded-full px-2 py-1 text-xs font-bold', cls)}>{label}</span>;
      } },
    ]} />
  );
}

function ExpensesReport({ report, filters }: { report: any; filters: Record<string, any> }) {
  const rows = report?.rows ?? [];
  const byCategory = report?.by_category ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard title="Total Expenses" value={money(report?.total_expenses)} tone="red" />
        {byCategory.slice(0, 2).map((category: any) => <SummaryCard key={category.category} title={category.category ?? 'Uncategorized'} value={money(category.total)} />)}
      </div>
      {rows.length === 0 ? <EmptyState filters={filters} /> : (
        <>
          <Card>
            <CardHeader><CardTitle>Expenses By Category</CardTitle></CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byCategory} dataKey="total" nameKey="category" outerRadius={110} label>
                    {byCategory.map((_: any, index: number) => <Cell key={index} fill={chartColors[index % chartColors.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value) => money(value)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <DataTable data={rows} columns={[
            { key: 'expense_date', label: 'Date', cell: (row) => row.expense_date },
            { key: 'reference', label: 'Reference' },
            { key: 'category', label: 'Category', cell: (row) => row.category?.name ?? '-' },
            { key: 'account', label: 'Account', cell: (row) => row.account?.name ?? '-' },
            { key: 'amount', label: 'Amount', cell: (row) => money(row.amount) },
          ]} />
        </>
      )}
    </div>
  );
}

function ReportContent({ prop, report, filters }: { prop: string; report: any; filters: Record<string, any> }) {
  if (prop === 'salesReport') return <SalesReport report={report} filters={filters} />;
  if (prop === 'purchasesReport') return <PurchasesReport report={report} filters={filters} />;
  if (prop === 'profitLossReport') return <ProfitLossReport report={report} />;
  if (prop === 'stockReport') return <StockReport report={report} />;
  if (prop === 'expensesReport') return <ExpensesReport report={report} filters={filters} />;

  return <pre className="rounded-lg border border-gray-200 bg-white p-5 text-sm">{JSON.stringify(report ?? {}, null, 2)}</pre>;
}

export default function ReportPage({ title, prop }: { title: string; prop: string }) {
  const { props } = usePage<Record<string, any>>();
  const report = props[prop];
  const [filters, setFilters] = useState(currentMonthRange(props.filters ?? {}));

  const apply = () => {
    router.visit(window.location.pathname, {
      method: 'get',
      data: filters,
      preserveState: true,
      preserveScroll: true,
      only: [prop, 'filters'],
    });
  };

  const content = (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">Database-backed report output</p>
      </div>
      <FilterBar filters={filters} setFilters={setFilters} apply={apply} warehouses={prop === 'stockReport' ? report?.warehouses : undefined} />
      <ReportContent prop={prop} report={report} filters={filters} />
    </div>
  );

  return (
    <AppLayout>
      <Deferred data={prop} fallback={content}>
        {content}
      </Deferred>
    </AppLayout>
  );
}

ReportPage.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
