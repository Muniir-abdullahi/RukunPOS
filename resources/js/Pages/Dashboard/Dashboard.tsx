import React from 'react';
import { Link } from '@inertiajs/react';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  ArrowRight,
  MonitorPlay,
  Wallet,
  Receipt,
  FileBarChart
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

import { PageHeader } from '@/Components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { StatCard } from '@/Components/ui/StatCard';
import { StatusBadge } from '@/Components/ui/StatusBadge';
import { Button } from '@/Components/ui/Button';
import { DataTable } from '@/Components/ui/DataTable';

// Mock Data
const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const recentSales = [
  { id: 'INV-1001', customer: 'John Doe', amount: 150.00, status: 'completed', date: '2023-11-01 10:23 AM' },
  { id: 'INV-1002', customer: 'Walk-in Customer', amount: 45.50, status: 'completed', date: '2023-11-01 11:05 AM' },
  { id: 'INV-1003', customer: 'Jane Smith', amount: 899.99, status: 'pending', date: '2023-11-01 12:30 PM' },
  { id: 'INV-1004', customer: 'ABC Corp', amount: 250.00, status: 'completed', date: '2023-11-01 02:15 PM' },
  { id: 'INV-1005', customer: 'Walk-in Customer', amount: 12.00, status: 'completed', date: '2023-11-01 03:45 PM' },
];

const lowStockItems = [
  { id: '1', name: 'Wireless Mouse', sku: 'WM-001', stock: 5, minStock: 10, status: 'Low Stock' },
  { id: '2', name: 'Mechanical Keyboard', sku: 'MK-002', stock: 2, minStock: 15, status: 'Critical' },
  { id: '3', name: 'USB-C Cable', sku: 'UC-003', stock: 0, minStock: 20, status: 'Out of Stock' },
];

const topProducts = [
  { id: '1', name: 'Ergonomic Chair', sold: 45, revenue: 8999.55 },
  { id: '2', name: '27" Monitor', sold: 38, revenue: 11399.62 },
  { id: '3', name: 'Wireless Mouse', sold: 120, revenue: 3598.80 },
  { id: '4', name: 'Mechanical Keyboard', sold: 85, revenue: 7649.15 },
];

const recentActivities = [
  { id: '1', type: 'sale', text: 'Sale #INV-1005 completed for $12.00', time: '10 mins ago' },
  { id: '2', type: 'purchase', text: 'Purchase #PO-502 added for $450.00', time: '1 hour ago' },
  { id: '3', type: 'expense', text: 'Expense #EXP-089 recorded (Office Supplies)', time: '3 hours ago' },
  { id: '4', type: 'stock', text: 'Product "USB-C Cable" stock updated', time: '5 hours ago' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Overview of your store performance for today."
      />

      {/* 7. Quick Actions */}
      <div className="flex flex-wrap gap-3 pb-2 border-b border-gray-200">
        <Link href="/pos">
          <Button className="flex items-center gap-2">
            <MonitorPlay className="w-4 h-4" /> Open POS
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" className="flex items-center gap-2">
            <Package className="w-4 h-4" /> Add Product
          </Button>
        </Link>
        <Link href="/purchases/add">
          <Button variant="outline" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Add Purchase
          </Button>
        </Link>
        <Link href="/expenses">
          <Button variant="outline" className="flex items-center gap-2">
            <Wallet className="w-4 h-4" /> Add Expense
          </Button>
        </Link>
        <Link href="/reports/sales">
           <Button variant="ghost" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50">
            <FileBarChart className="w-4 h-4" /> View Reports
          </Button>
        </Link>
      </div>

      {/* 1. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard 
          title="Sales Today" 
          value="15" 
          icon={Receipt}
          className="xl:col-span-1"
        />
        <StatCard 
          title="Total Revenue" 
          value="$2,450" 
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          className="xl:col-span-1"
        />
        <StatCard 
          title="Total Purchases" 
          value="$850" 
          icon={ShoppingCart}
          trend={{ value: 4.2, isPositive: true }}
          className="xl:col-span-1"
        />
        <StatCard 
          title="Total Expenses" 
          value="$120" 
          icon={TrendingDown}
          trend={{ value: 2.1, isPositive: false }}
          className="xl:col-span-1"
        />
        <StatCard 
          title="Net Profit" 
          value="$1,480" 
          icon={TrendingUp}
          trend={{ value: 8.4, isPositive: true }}
          className="xl:col-span-1"
        />
        <StatCard 
          title="Low Stock Alerts" 
          value="12" 
          icon={AlertTriangle}
          className="xl:col-span-1 border-l-4 border-l-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Sales Overview Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sales Overview (Current Week)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    cursor={{fill: '#F3F4F6'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 5. Top Selling Products */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sold} units sold</p>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    ${product.revenue.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* 3. Recent Sales */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Sales</CardTitle>
            <Link href="/sales" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable 
              data={recentSales}
              columns={[
                { header: 'Invoice', accessorKey: 'id' },
                { header: 'Customer', accessorKey: 'customer' },
                { header: 'Amount', cell: (row) => <span className="font-medium">${row.amount.toFixed(2)}</span> },
                { header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
                { header: 'Date', accessorKey: 'date' },
              ]}
            />
          </CardContent>
        </Card>

        {/* 6. Recent Activities */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-200">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="relative flex items-start gap-4">
                  <div className="absolute left-0 w-2 h-2 ml-[1.125rem] mt-2 rounded-full ring-4 ring-white bg-primary-500 z-10 shrink-0"></div>
                  <div className="flex-1 ml-12">
                    <p className="text-sm text-gray-900 leading-tight">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Low Stock Alerts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Low Stock Alerts
          </CardTitle>
          <Link href="/reports/stock" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
            View report <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable 
            data={lowStockItems}
            columns={[
              { header: 'Product Name', accessorKey: 'name' },
              { header: 'SKU', accessorKey: 'sku' },
              { header: 'Current Stock', cell: (row) => (
                <span className={`font-bold ${row.stock === 0 ? 'text-red-600' : 'text-orange-500'}`}>
                  {row.stock}
                </span>
              )},
              { header: 'Min Stock', accessorKey: 'minStock' },
              { header: 'Status', cell: (row) => (
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  row.stock === 0 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {row.status}
                </span>
              )},
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
