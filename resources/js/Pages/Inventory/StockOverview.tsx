import React from 'react';
import { useInventoryStore } from '@/store/inventoryStore';
import { AlertTriangle, CircleDollarSign, PackageOpen, PackageX } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/Button';
import { DataTable, type Column } from '@/Components/ui/DataTable';
import { useTableFilter } from '@/hooks/useTableFilter';

export function StockOverview({ productsProp, filters = {} }: { productsProp?: any; filters?: Record<string, any> }) {
  const { products, categories } = useInventoryStore();
  const table = useTableFilter({ only: ['products'], defaultFilters: filters });
  const serverMode = productsProp !== undefined || Object.keys(filters).length > 0;
  const rows = serverMode ? (productsProp?.data ?? []) : products;
  const currentStatus = table.filters.status ?? '';
  const outOfStock = rows.filter((product: any) => product.stock <= 0);
  const lowStock = rows.filter((product: any) => product.stock > 0 && product.stock <= product.minStock);
  const totalValue = rows.reduce((acc: number, product: any) => acc + (product.stock * product.costPrice), 0);
  const columns: Column<any>[] = [
    {
      key: 'name',
      label: 'Product',
      render: product => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{product.name}</div>
            <div className="text-xs text-gray-500 tabular-nums">SKU: {product.sku}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: product => product.category || categories.find(c => String(c.id) === String(product.categoryId))?.name || 'Unknown',
    },
    {
      key: 'stock',
      label: 'In Stock',
      className: 'text-center',
      render: product => {
        const isOut = product.stock <= 0;
        const isLow = product.stock > 0 && product.stock <= product.minStock;

        return <span className={`font-bold tabular-nums text-base ${isOut ? 'text-red-600' : isLow ? 'text-orange-600' : 'text-green-600'}`}>{product.stock}</span>;
      },
    },
    { key: 'minStock', label: 'Min Alert', className: 'text-center', render: product => <span className="text-gray-500 font-medium tabular-nums">{product.minStock}</span> },
    {
      key: 'status',
      label: 'Status',
      className: 'text-center',
      render: product => {
        const isOut = product.stock <= 0;
        const isLow = product.stock > 0 && product.stock <= product.minStock;

        if (isOut) return <span className="inline-flex px-2 py-1 rounded bg-red-50 text-red-700 text-xs font-bold border border-red-100">Out of Stock</span>;
        if (isLow) return <span className="inline-flex px-2 py-1 rounded bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100">Low Stock</span>;

        return <span className="inline-flex px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-bold border border-green-100">In Stock</span>;
      },
    },
    { key: 'value', label: 'Value (Cost)', className: 'text-right', render: product => `$${(product.stock * product.costPrice).toFixed(2)}` },
  ];

  const setStatus = (status: string) => {
    if (serverMode) {
      table.reload({ status, page: 1 });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor your inventory levels and value</p>
        </div>
        <Link href="/inventory/adjustments">
          <Button className="bg-primary hover:bg-primary-dark text-white font-bold">New Adjustment</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 shrink-0">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center border border-primary/30">
            <PackageOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Loaded Products</p>
            <p className="text-2xl font-black text-gray-900 tabular-nums leading-none">{rows.length}</p>
          </div>
        </div>
        <button type="button" className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4 text-left hover:border-orange-300 transition-colors" onClick={() => setStatus('low')}>
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center border border-orange-100">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Low Stock Loaded</p>
            <p className="text-2xl font-black text-orange-600 tabular-nums leading-none">{lowStock.length}</p>
          </div>
        </button>
        <button type="button" className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4 text-left hover:border-red-300 transition-colors" onClick={() => setStatus('out')}>
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
            <PackageX className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Out Loaded</p>
            <p className="text-2xl font-black text-red-600 tabular-nums leading-none">{outOfStock.length}</p>
          </div>
        </button>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
            <CircleDollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Loaded Value</p>
            <p className="text-2xl font-black text-gray-900 tabular-nums leading-none">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      <div className="p-4 border border-b-0 border-gray-200 rounded-t-xl bg-gray-50/50 flex gap-2 shrink-0">
        <button type="button" onClick={() => setStatus('')} className={`px-4 py-2 text-sm font-semibold rounded-lg ${!currentStatus ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'}`}>All Items</button>
        <button type="button" onClick={() => setStatus('low')} className={`px-4 py-2 text-sm font-semibold rounded-lg ${currentStatus === 'low' ? 'bg-white shadow-sm border border-gray-200 text-orange-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'}`}>Low Stock</button>
        <button type="button" onClick={() => setStatus('out')} className={`px-4 py-2 text-sm font-semibold rounded-lg ${currentStatus === 'out' ? 'bg-white shadow-sm border border-gray-200 text-red-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'}`}>Out of Stock</button>
      </div>

      <DataTable
        data={serverMode ? (productsProp ?? null) : products}
        columns={columns}
        rowKey="id"
        loading={serverMode && (table.loading || productsProp === null || productsProp === undefined)}
        initialFilters={table.filters}
        filters={[{ key: 'search', label: 'Search', type: 'text', placeholder: 'Search products, SKU...' }]}
        onFilter={nextFilters => serverMode && table.reload(nextFilters)}
        emptyMessage="No products found for this filter."
        className="flex-1 min-h-0 rounded-t-none"
      />
    </div>
  );
}
