import React, { useState } from 'react';
import { useInventoryStore } from '@/store/inventoryStore';
import { PackageX, AlertTriangle, PackageOpen, CircleDollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function StockOverview() {
  const { products, categories } = useInventoryStore();
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');

  const outOfStock = products.filter(p => p.stock <= 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= p.minStock);
  const totalValue = products.reduce((acc, p) => acc + (p.stock * p.costPrice), 0);
  
  let displayedProducts = products;
  if (filter === 'low') displayedProducts = lowStock;
  if (filter === 'out') displayedProducts = outOfStock;

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor your inventory levels and value</p>
        </div>
        <Link to="/inventory/adjustments">
           <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">New Adjustment</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 shrink-0">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
            <PackageOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Products</p>
            <p className="text-2xl font-black text-gray-900 tabular-nums leading-none">{products.length}</p>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4 cursor-pointer hover:border-orange-300 transition-colors" onClick={() => setFilter('low')}>
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center border border-orange-100">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Low Stock</p>
            <p className="text-2xl font-black text-orange-600 tabular-nums leading-none">{lowStock.length}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4 cursor-pointer hover:border-red-300 transition-colors" onClick={() => setFilter('out')}>
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
            <PackageX className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Out of Stock</p>
            <p className="text-2xl font-black text-red-600 tabular-nums leading-none">{outOfStock.length}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
            <CircleDollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Stock Value</p>
            <p className="text-2xl font-black text-gray-900 tabular-nums leading-none">${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col flex-1 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex gap-2 shrink-0">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-semibold rounded-lg ${filter === 'all' ? 'bg-white shadow-sm border border-gray-200 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'}`}>All Items</button>
          <button onClick={() => setFilter('low')} className={`px-4 py-2 text-sm font-semibold rounded-lg ${filter === 'low' ? 'bg-white shadow-sm border border-gray-200 text-orange-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'}`}>Low Stock ({lowStock.length})</button>
          <button onClick={() => setFilter('out')} className={`px-4 py-2 text-sm font-semibold rounded-lg ${filter === 'out' ? 'bg-white shadow-sm border border-gray-200 text-red-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'}`}>Out of Stock ({outOfStock.length})</button>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar relative">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white sticky top-0 z-10 shadow-sm shadow-gray-100">
              <tr className="text-gray-500">
                <th className="font-semibold p-4">Product</th>
                <th className="font-semibold p-4">Category</th>
                <th className="font-semibold p-4 text-center">In Stock</th>
                <th className="font-semibold p-4 text-center">Min Alert</th>
                <th className="font-semibold p-4 text-center">Status</th>
                <th className="font-semibold p-4 text-right">Value (Cost)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedProducts.map(product => {
                const isOut = product.stock <= 0;
                const isLow = product.stock > 0 && product.stock <= product.minStock;
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{product.name}</div>
                        <div className="text-xs text-gray-500 tabular-nums">SKU: {product.sku}</div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700">
                      {categories.find(c => c.id === product.categoryId)?.name || 'Unknown'}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`font-bold tabular-nums text-base ${isOut ? 'text-red-600' : isLow ? 'text-orange-600' : 'text-green-600'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4 text-center text-gray-500 font-medium tabular-nums">
                      {product.minStock}
                    </td>
                    <td className="p-4 text-center">
                      {isOut ? (
                        <span className="inline-flex px-2 py-1 rounded bg-red-50 text-red-700 text-xs font-bold border border-red-100">Out of Stock</span>
                      ) : isLow ? (
                        <span className="inline-flex px-2 py-1 rounded bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100">Low Stock</span>
                      ) : (
                        <span className="inline-flex px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-bold border border-green-100">In Stock</span>
                      )}
                    </td>
                    <td className="p-4 text-right font-medium text-gray-900 tabular-nums">
                      ${(product.stock * product.costPrice).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {displayedProducts.length === 0 && (
             <div className="flex flex-col items-center justify-center p-12 text-gray-400">
               <PackageOpen className="w-12 h-12 mb-3 text-gray-200" />
               <p className="text-sm font-medium">No products found for this filter.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
