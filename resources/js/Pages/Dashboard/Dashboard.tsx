import React from 'react';
import { Deferred, Link, usePage } from '@inertiajs/react';
import {
  AlertTriangle,
  ArrowRight,
  DollarSign,
  FileBarChart,
  MonitorPlay,
  Package,
  Receipt,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { DataTable } from '@/Components/ui/DataTable';
import { PageHeader } from '@/Components/ui/PageHeader';
import { StatCard } from '@/Components/ui/StatCard';
import { StatusBadge } from '@/Components/ui/StatusBadge';
import { Button } from '@/Components/ui/Button';
import { cn } from '@/lib/utils';

interface DashboardData {
  salesToday: number;
  revenueMonth: number;
  purchaseMonth: number;
  expenseMonth: number;
  netProfit: number;
  lowStockCount: number;
  recentSales: RecentSale[];
  topProducts: TopProduct[];
  revenueChart: ChartPoint[];
  lowStockItems: LowStockItem[];
}

interface RecentSale {
  id: number;
  reference: string;
  customer: { name: string } | null;
  grand_total: number | string;
  payment_status: string;
  sale_date: string;
}

interface TopProduct {
  product: { name: string; sku?: string } | null;
  total_qty: number | string;
  revenue: number | string;
}

interface ChartPoint {
  date: string;
  total: number | string;
}

interface LowStockItem {
  id: number;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  status: string;
}

interface DashboardPageProps {
  dashboardData?: DashboardData;
}

const currency = (value: number | string | null | undefined) =>
  `$${Number(value ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-32 rounded-lg border border-gray-200 bg-white p-5">
            <div className="mb-5 h-4 w-24 rounded bg-gray-200" />
            <div className="h-8 w-20 rounded bg-gray-200" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-96 rounded-lg border border-gray-200 bg-white p-6 lg:col-span-2">
          <div className="mb-8 h-5 w-48 rounded bg-gray-200" />
          <div className="h-72 rounded bg-gray-100" />
        </div>
        <div className="h-96 rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-8 h-5 w-44 rounded bg-gray-200" />
          <div className="space-y-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-gray-200" />
                  <div className="h-3 w-20 rounded bg-gray-200" />
                </div>
                <div className="h-4 w-16 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6 h-5 w-40 rounded bg-gray-200" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-5 gap-4">
              <div className="h-4 rounded bg-gray-200" />
              <div className="h-4 rounded bg-gray-200" />
              <div className="h-4 rounded bg-gray-200" />
              <div className="h-4 rounded bg-gray-200" />
              <div className="h-4 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardContent({ dashboardData }: { dashboardData: DashboardData }) {
  const chartData = dashboardData.revenueChart.map((point) => ({
    date: new Date(point.date).toLocaleDateString(undefined, { weekday: 'short' }),
    total: Number(point.total),
  }));

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Sales Today" value={String(dashboardData.salesToday)} icon={Receipt} className="xl:col-span-1" />
        <StatCard title="Total Revenue" value={currency(dashboardData.revenueMonth)} icon={DollarSign} className="xl:col-span-1" />
        <StatCard title="Total Purchases" value={currency(dashboardData.purchaseMonth)} icon={ShoppingCart} className="xl:col-span-1" />
        <StatCard title="Total Expenses" value={currency(dashboardData.expenseMonth)} icon={TrendingDown} className="xl:col-span-1" />
        <StatCard
          title="Net Profit"
          value={currency(dashboardData.netProfit)}
          icon={TrendingUp}
          className={cn('xl:col-span-1', dashboardData.netProfit < 0 && 'border-l-4 border-l-red-500')}
        />
        <StatCard
          title="Low Stock Alerts"
          value={String(dashboardData.lowStockCount)}
          icon={AlertTriangle}
          className={cn('xl:col-span-1', dashboardData.lowStockCount > 0 && 'border-l-4 border-l-red-500')}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sales Overview (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full pt-4">
              {chartData.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-200 text-sm font-medium text-gray-500">
                  No revenue data for the last 7 days.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} tickFormatter={(value) => `$${Number(value).toFixed(0)}`} />
                    <Tooltip
                      cursor={{ fill: '#F3F4F6' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value) => [currency(value as number), 'Revenue']}
                    />
                    <Bar dataKey="total" fill="#1D9E75" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.topProducts.length === 0 ? (
              <p className="text-sm font-medium text-gray-500">No top products yet.</p>
            ) : (
              <div className="space-y-6">
                {dashboardData.topProducts.map((product, index) => (
                  <div key={`${product.product?.sku ?? index}`} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.product?.name ?? 'Unknown product'}</p>
                      <p className="text-xs text-gray-500">{Number(product.total_qty).toFixed(0)} units sold</p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">{currency(product.revenue)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Sales</CardTitle>
            <Link href="/sales" className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              data={dashboardData.recentSales}
              emptyMessage="No recent sales found."
              columns={[
                { key: 'reference', label: 'Invoice', accessorKey: 'reference' },
                { key: 'customer', label: 'Customer', cell: (row) => row.customer?.name ?? 'Walk-in Customer' },
                { key: 'grand_total', label: 'Amount', cell: (row) => <span className="font-medium">{currency(row.grand_total)}</span> },
                { key: 'payment_status', label: 'Status', cell: (row) => <StatusBadge status={row.payment_status} /> },
                { key: 'sale_date', label: 'Date', cell: (row) => new Date(row.sale_date).toLocaleString() },
              ]}
            />
          </CardContent>
        </Card>

        <Card className={cn('xl:col-span-1', dashboardData.lowStockCount > 0 && 'border-red-200')}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className={cn('flex items-center gap-2', dashboardData.lowStockCount > 0 ? 'text-red-600' : 'text-gray-900')}>
              <AlertTriangle className="h-5 w-5" /> Low Stock
            </CardTitle>
            <Link href="/reports/stock" className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700">
              Report <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.lowStockItems.length === 0 ? (
              <p className="text-sm font-medium text-gray-500">All tracked items are in stock.</p>
            ) : (
              dashboardData.lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.sku} | Min {item.minStock}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn('text-sm font-bold', item.stock <= 0 ? 'text-red-600' : 'text-orange-500')}>{item.stock}</p>
                    <p className="text-xs text-gray-500">{item.status}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export function Dashboard() {
  const { props } = usePage<DashboardPageProps>();

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of your store performance for today." />

      <div className="flex flex-wrap gap-3 border-b border-gray-200 pb-2">
        <Link href="/pos">
          <Button className="flex items-center gap-2">
            <MonitorPlay className="h-4 w-4" /> Open POS
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" className="flex items-center gap-2">
            <Package className="h-4 w-4" /> Add Product
          </Button>
        </Link>
        <Link href="/purchases/create">
          <Button variant="outline" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" /> Add Purchase
          </Button>
        </Link>
        <Link href="/expenses">
          <Button variant="outline" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" /> Add Expense
          </Button>
        </Link>
        <Link href="/reports/sales">
          <Button variant="ghost" className="flex items-center gap-2 text-primary-600 hover:bg-primary-50 hover:text-primary-700">
            <FileBarChart className="h-4 w-4" /> View Reports
          </Button>
        </Link>
      </div>

      <Deferred data="dashboardData" fallback={<DashboardSkeleton />}>
        {props.dashboardData ? <DashboardContent dashboardData={props.dashboardData} /> : <DashboardSkeleton />}
      </Deferred>
    </div>
  );
}
