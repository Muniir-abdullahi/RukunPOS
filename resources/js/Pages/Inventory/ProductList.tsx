import React from 'react';
import { Link, router } from '@inertiajs/react';
import { useInventoryStore } from '@/store/inventoryStore';
import { Button } from '@/Components/ui/Button';
import { DataTable, type Column } from '@/Components/ui/DataTable';
import { useTableFilter } from '@/hooks/useTableFilter';
import { Edit2, Eye, LayoutGrid, Package, Plus, Tag, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProductList({
  productsProp,
  filters = {},
  categoriesProp,
  brandsProp,
  unitsProp,
}: {
  productsProp?: any;
  filters?: Record<string, any>;
  categoriesProp?: any[];
  brandsProp?: any[];
  unitsProp?: any[];
}) {
  const { products, categories, brands, units, deleteProduct } = useInventoryStore();
  const table = useTableFilter({ only: ['products'], defaultFilters: filters });
  const serverMode = productsProp !== undefined || Object.keys(filters).length > 0;
  const categoryRows = categoriesProp ?? categories;
  const brandRows = brandsProp ?? brands;
  const unitRows = unitsProp ?? units;
  const getCategoryName = (product: any) => product.category || categoryRows.find(c => String(c.id) === String(product.categoryId))?.name || 'Unknown';
  const getBrandName = (product: any) => product.brand || brandRows.find(b => String(b.id) === String(product.brandId))?.name || 'Unknown';
  const getUnitName = (product: any) => product.unit || unitRows.find(u => String(u.id) === String(product.unitId))?.shortName || unitRows.find(u => String(u.id) === String(product.unitId))?.short_name || '';
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
      render: product => (
        <div>
          <div className="flex items-center gap-1">
            <LayoutGrid className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-700">{getCategoryName(product)}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
            <Tag className="w-3.5 h-3.5" />
            {getBrandName(product)}
          </div>
        </div>
      ),
    },
    { key: 'costPrice', label: 'Cost', className: 'text-right', render: product => `$${Number(product.costPrice ?? 0).toFixed(2)}` },
    { key: 'sellingPrice', label: 'Price', className: 'text-right font-bold text-gray-900', render: product => `$${Number(product.sellingPrice ?? 0).toFixed(2)}` },
    {
      key: 'stock',
      label: 'Stock',
      className: 'text-center',
      render: product => (
        <div className="flex flex-col items-center">
          <span className={cn(
            'font-bold tabular-nums',
            product.stock <= 0 ? 'text-red-600' : product.stock <= product.minStock ? 'text-orange-600' : 'text-green-600',
          )}>
            {product.stock} {getUnitName(product)}
          </span>
          {product.stock <= product.minStock && product.stock > 0 && (
            <span className="text-[10px] text-orange-600 flex items-center gap-0.5 mt-0.5"><AlertCircle className="w-3 h-3" /> Low</span>
          )}
          {product.stock <= 0 && (
            <span className="text-[10px] text-red-600 flex items-center gap-0.5 mt-0.5"><AlertCircle className="w-3 h-3" /> Out</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      className: 'text-center',
      render: product => (
        <span className={cn(
          'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border',
          product.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200',
        )}>
          {product.status === 'Active' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : null}
          {product.status}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product catalog</p>
        </div>
        <div className="flex gap-2">
          <Link href="/products/barcode">
            <Button variant="outline" className="flex items-center gap-2">
              <Package className="w-4 h-4" /> Print Barcodes
            </Button>
          </Link>
          <Link href="/products/new">
            <Button className="bg-primary hover:bg-primary-dark text-white flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      <DataTable
        data={serverMode ? (productsProp ?? null) : products}
        columns={columns}
        rowKey="id"
        loading={serverMode && (table.loading || productsProp === null || productsProp === undefined)}
        initialFilters={table.filters}
        filters={[
          { key: 'search', label: 'Search', type: 'text', placeholder: 'Search products, SKU...' },
          {
            key: 'category_id',
            label: 'Category',
            type: 'select',
            placeholder: 'All Categories',
            options: categoryRows.map(category => ({ value: String(category.id), label: category.name })),
          },
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            placeholder: 'All Statuses',
            options: [
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ],
          },
        ]}
        onFilter={nextFilters => serverMode && table.reload(nextFilters)}
        emptyMessage="No products found."
        className="flex-1 min-h-0"
        actions={product => (
          <div className="flex justify-end gap-2">
            <Link href={`/products/${product.id}`}>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-500 hover:text-primary">
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
            <Link href={`/products/${product.id}/edit`}>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-500 hover:text-primary">
                <Edit2 className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50" onClick={() => {
              if (confirm('Delete product?')) serverMode ? router.delete(`/products/${product.id}`) : deleteProduct(product.id);
            }}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      />
    </div>
  );
}
