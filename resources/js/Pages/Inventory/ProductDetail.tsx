import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useInventoryStore } from '@/store/inventoryStore';
import { Button } from '@/Components/ui/Button';
import { DataTable } from '@/Components/ui/DataTable';
import { 
  ArrowLeft, Edit2, Package, History, TrendingUp, ShoppingCart 
} from 'lucide-react';

export function ProductDetail() {
  const { props } = usePage<{ id?: string; product?: any }>();
  const { products, categories, brands, units, adjustments } = useInventoryStore();
  
  const product = props.product ?? products.find(p => p.id === props.id);
  const id = props.id ?? product?.id;
  if (!product) return <div className="p-8 text-center text-gray-500">Product not found.</div>;

  const categoryPath = product.category || categories.find(c => String(c.id) === String(product.categoryId))?.name || 'Unknown';
  const brandName = product.brand || brands.find(b => String(b.id) === String(product.brandId))?.name || 'Unknown';
  const unitName = product.unit || units.find(u => String(u.id) === String(product.unitId))?.shortName || '';

  const productAdjustments = adjustments.filter(a => a.productId === product.id);

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-64px)] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="ghost" className="w-10 h-10 p-0 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/products/barcode?id=${product.id}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Package className="w-4 h-4" /> Print Barcode
            </Button>
          </Link>
          <Link href={`/products/${id}/edit`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <Edit2 className="w-4 h-4" /> Edit Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col - Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-xl bg-gray-50 border border-gray-100 shrink-0 p-2 overflow-hidden flex items-center justify-center">
              <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
               <div>
                 <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Category</p>
                 <p className="font-medium text-gray-900">{categoryPath}</p>
               </div>
               <div>
                 <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Brand</p>
                 <p className="font-medium text-gray-900">{brandName}</p>
               </div>
               <div>
                 <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Barcode</p>
                 <p className="font-medium text-gray-900 tabular-nums">{product.barcode || 'N/A'}</p>
               </div>
               <div>
                 <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Unit</p>
                 <p className="font-medium text-gray-900">{units.find(u => u.id === product.unitId)?.name || unitName}</p>
               </div>
               <div className="col-span-2">
                 <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Description</p>
                 <p className="text-sm text-gray-700 leading-relaxed">{product.description || 'No description provided.'}</p>
               </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
               <h3 className="font-bold text-gray-900 flex items-center gap-2">
                 <History className="w-4 h-4 text-gray-500" /> Recent Stock Movements
               </h3>
            </div>
            <DataTable
              data={productAdjustments}
              rowKey="id"
              emptyMessage="No adjustments found."
              className="rounded-none border-0 shadow-none"
              columns={[
                { key: 'date', label: 'Date', render: adj => new Date(adj.date).toLocaleDateString() },
                {
                  key: 'type',
                  label: 'Type',
                  render: adj => (
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${adj.type === 'Increase' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {adj.type}
                    </span>
                  ),
                },
                { key: 'quantity', label: 'Quantity', className: 'text-right', render: adj => `${adj.type === 'Increase' ? '+' : '-'}${adj.quantity}` },
                { key: 'reason', label: 'Reason' },
                { key: 'notes', label: 'Notes', render: adj => <span className="block text-xs truncate max-w-[200px]">{adj.notes}</span> },
              ]}
            />
          </div>
        </div>

        {/* Right Col - Pricing & Stock */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
               <TrendingUp className="w-4 h-4 text-gray-500" /> Pricing Details
             </h3>
             <div className="space-y-3">
               <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Cost Price</span>
                  <span className="text-base font-bold text-gray-900 tabular-nums">${product.costPrice.toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                  <span className="text-sm font-semibold text-blue-800">Selling Price</span>
                  <span className="text-lg font-black text-blue-700 tabular-nums">${product.sellingPrice.toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center px-2 pt-2">
                  <span className="text-xs font-medium text-gray-500">Gross Margin</span>
                  <span className="text-sm font-bold text-green-600">
                    {product.sellingPrice > 0 ? (((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100).toFixed(1) : 0}%
                  </span>
               </div>
             </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
             {product.stock <= product.minStock && product.stock > 0 && (
               <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
             )}
             {product.stock === 0 && (
               <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
             )}
             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
               <Package className="w-4 h-4 text-gray-500" /> Stock Status
             </h3>
             <div className="text-center py-4">
               <div className="text-5xl font-black text-gray-900 tabular-nums tracking-tight mb-2">
                 {product.stock}
               </div>
               <p className="text-sm text-gray-500 font-medium">Items in stock</p>
             </div>
             
             <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500">Low Stock Alert</span>
                 <span className="font-bold text-gray-900">{product.minStock}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500">Total Value (Cost)</span>
                 <span className="font-bold text-gray-900">${(product.stock * product.costPrice).toFixed(2)}</span>
               </div>
             </div>

             <div className="mt-6">
                <Link href={`/inventory/adjustments?productId=${product.id}`}>
                  <Button variant="outline" className="w-full font-semibold border-gray-300">
                     Adjust Stock
                  </Button>
                </Link>
             </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-center">
            <ShoppingCart className="w-8 h-8 mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500 font-medium">Sales History is not available in the current MVP version.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
