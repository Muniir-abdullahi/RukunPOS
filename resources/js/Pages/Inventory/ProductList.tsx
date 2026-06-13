import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { useInventoryStore } from '@/store/inventoryStore';
import { Button } from '@/Components/ui/Button';
import { 
  Search, Plus, Edit2, Trash2, Eye, Filter, MoreVertical, 
  Package, LayoutGrid, Tag, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProductList() {
  const { products, categories, brands, units, deleteProduct } = useInventoryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown';
  const getBrandName = (id: string) => brands.find(b => b.id === id)?.name || 'Unknown';
  const getUnitName = (id: string) => units.find(u => u.id === id)?.shortName || '';

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
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col flex-1 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 shrink-0 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products, SKU..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[150px]"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <Button variant="outline" className="w-10 px-0 flex items-center justify-center shrink-0">
              <Filter className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto custom-scrollbar relative">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white sticky top-0 z-10">
              <tr className="text-gray-500 border-b border-gray-200">
                <th className="font-semibold p-4">Product</th>
                <th className="font-semibold p-4">Category</th>
                <th className="font-semibold p-4 text-right">Cost</th>
                <th className="font-semibold p-4 text-right">Price</th>
                <th className="font-semibold p-4 text-center">Stock</th>
                <th className="font-semibold p-4 text-center">Status</th>
                <th className="font-semibold p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500 tabular-nums">SKU: {product.sku}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <LayoutGrid className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-700">{getCategoryName(product.categoryId)}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <Tag className="w-3.5 h-3.5" />
                      {getBrandName(product.brandId)}
                    </div>
                  </td>
                  <td className="p-4 text-right font-medium text-gray-600 tabular-nums">
                    ${product.costPrice.toFixed(2)}
                  </td>
                  <td className="p-4 text-right font-bold text-gray-900 tabular-nums">
                    ${product.sellingPrice.toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className={cn(
                        "font-bold tabular-nums",
                        product.stock <= 0 ? "text-red-600" : product.stock <= product.minStock ? "text-orange-600" : "text-green-600"
                      )}>
                        {product.stock} {getUnitName(product.unitId)}
                      </span>
                      {product.stock <= product.minStock && product.stock > 0 && (
                        <span className="text-[10px] text-orange-600 flex items-center gap-0.5 mt-0.5"><AlertCircle className="w-3 h-3"/> Low</span>
                      )}
                      {product.stock <= 0 && (
                        <span className="text-[10px] text-red-600 flex items-center gap-0.5 mt-0.5"><AlertCircle className="w-3 h-3"/> Out</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border",
                      product.status === 'Active' ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"
                    )}>
                      {product.status === 'Active' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : null}
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                       <Link href={`/products/${product.id}`}>
                         <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-500 hover:text-blue-600">
                           <Eye className="w-4 h-4" />
                         </Button>
                       </Link>
                       <Link href={`/products/${product.id}/edit`}>
                         <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-500 hover:text-blue-600">
                           <Edit2 className="w-4 h-4" />
                         </Button>
                       </Link>
                       <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50" onClick={() => {
                         if(confirm('Delete product?')) deleteProduct(product.id);
                       }}>
                         <Trash2 className="w-4 h-4" />
                       </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 text-gray-400">
              <Package className="w-12 h-12 mb-4 text-gray-300" />
              <h3 className="text-lg font-bold text-gray-900">No products found</h3>
              <p className="mt-1 text-sm">Try adjusting your filters or add a new product.</p>
              <Link href="/products/new" className="mt-4">
                <Button className="bg-blue-600 text-white hover:bg-blue-700">Add Product</Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-gray-200 bg-white flex justify-between items-center text-sm text-gray-500 shrink-0">
          <div>Showing 1 to {filteredProducts.length} of {filteredProducts.length} results</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
