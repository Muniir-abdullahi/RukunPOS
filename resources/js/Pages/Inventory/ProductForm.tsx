import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { useInventoryStore, Product } from '@/store/inventoryStore';
import { Button } from '@/Components/ui/Button';
import { ArrowLeft, Save, UploadCloud, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProductForm() {
  const { props } = usePage<{ id?: string; product?: Product; categories?: any[]; brands?: any[]; units?: any[] }>();
  const id = props.id ?? props.product?.id;
  const isEditing = Boolean(id);
  
  const { products, categories, brands, units, addProduct, updateProduct } = useInventoryStore();
  const categoryRows = props.categories ?? categories;
  const brandRows = props.brands ?? brands;
  const unitRows = props.units ?? units;
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    barcode: '',
    categoryId: categoryRows[0]?.id || '',
    brandId: brandRows[0]?.id || '',
    unitId: unitRows[0]?.id || '',
    costPrice: 0,
    sellingPrice: 0,
    stock: 0,
    minStock: 5,
    description: '',
    status: 'Active',
    image: 'https://placehold.co/150x150/eff6ff/1e40af?text=New+Product'
  });

  useEffect(() => {
    if (props.product) {
      setFormData(props.product);
      return;
    }

    if (isEditing && id) {
      const p = products.find(prod => prod.id === id);
      if (p) setFormData(p);
    }
  }, [id, isEditing, products]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;
    
    if (type === 'number') {
      parsedValue = parseFloat(value) || 0;
    }
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && id) {
      props.product ? router.patch(`/products/${id}`, formData) : updateProduct(id, formData as Product);
    } else {
      const newProduct: Product = {
        ...(formData as Product),
        id: `p${Date.now()}`
      };
      props.categories ? router.post('/products', formData) : addProduct(newProduct);
    }
    if (!props.categories && !props.product) router.visit('/products');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto h-[calc(100vh-64px)] overflow-y-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/products">
          <Button variant="ghost" className="w-10 h-10 p-0 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-sm text-gray-500">{isEditing ? 'Update product information' : 'Create a new product for your catalog'}</p>
        </div>
        <div className="ml-auto flex gap-3">
          <Link href="/products">
            <Button variant="outline" className="h-10">Cancel</Button>
          </Link>
          <Button onClick={handleSave} className="h-10 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <Save className="w-4 h-4" /> {isEditing ? 'Update Product' : 'Save Product'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">General Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="name" required value={formData.name} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="e.g. Sony Bravia 55&quot; 4K"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">SKU <span className="text-red-500">*</span></label>
                  <input 
                    type="text" name="sku" required value={formData.sku} onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="e.g. SNY-TV-55"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Barcode Option</label>
                  <div className="relative">
                    <input 
                      type="text" name="barcode" value={formData.barcode} onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="e.g. 8493021948"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea 
                  name="description" rows={3} value={formData.description} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none" 
                  placeholder="Detailed product description..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Pricing & Inventory</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cost Price ($) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="number" step="0.01" min="0" name="costPrice" required value={formData.costPrice} onChange={handleChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Selling Price ($) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    type="number" step="0.01" min="0" name="sellingPrice" required value={formData.sellingPrice} onChange={handleChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Opening Stock</label>
                <input 
                  type="number" min="0" name="stock" value={formData.stock} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                  disabled={isEditing} // usually avoid changing raw stock via edit
                />
                {isEditing && <p className="text-[10px] text-gray-500 mt-1">Use Stock Adjustment to modify current stock.</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Low Stock Alert</label>
                <input 
                  type="number" min="0" name="minStock" value={formData.minStock} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Organization & Image */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Product Image</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
              <div className="w-24 h-24 mb-4 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                 {formData.image ? (
                   <img src={formData.image} alt="Preview" className="w-full h-full object-cover mix-blend-multiply" />
                 ) : (
                   <UploadCloud className="w-8 h-8 text-gray-400" />
                 )}
              </div>
              <div className="text-sm font-semibold text-blue-600 mb-1 cursor-pointer hover:underline">Click to upload</div>
              <p className="text-xs text-gray-500 mb-4">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              
              <div className="w-full relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                </div>
                <input 
                  type="text" name="image" value={formData.image} onChange={handleChange}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Or enter image URL..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Organization</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                <select 
                  name="categoryId" required value={formData.categoryId} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="" disabled>Select category</option>
                  {categoryRows.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Brand</label>
                <select 
                  name="brandId" value={formData.brandId} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="" disabled>Select brand</option>
                  {brandRows.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Unit</label>
                <select 
                  name="unitId" value={formData.unitId} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {unitRows.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.shortName || u.short_name})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select 
                  name="status" value={formData.status} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
