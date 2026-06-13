import React, { useState } from 'react';
import { useInventoryStore } from '@/store/inventoryStore';
import { Button } from '@/components/ui/Button';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaxonomyProps {
  type: 'Category' | 'Brand' | 'Unit';
}

export function TaxonomyModule({ type }: TaxonomyProps) {
  const store = useInventoryStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Dynamic bindings
  const data = type === 'Category' ? store.categories : type === 'Brand' ? store.brands : store.units;
  const addFn = type === 'Category' ? store.addCategory : type === 'Brand' ? store.addBrand : store.addUnit;
  const updateFn = type === 'Category' ? store.updateCategory : type === 'Brand' ? store.updateBrand : store.updateUnit;
  const deleteFn = type === 'Category' ? store.deleteCategory : type === 'Brand' ? store.deleteBrand : store.deleteUnit;

  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    shortName: '', // only for unit
    status: 'Active'
  });

  const filteredData = data.filter((item: any) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData(item);
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', shortName: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateFn(editingId, formData);
    } else {
      const newItem = {
        ...formData,
        id: `${type.toLowerCase()}_${Date.now()}`
      };
      addFn(newItem as any);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{type === 'Category' ? 'Categories' : type === 'Brand' ? 'Brands' : 'Units'}</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product {type.toLowerCase()}s</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add {type}
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col flex-1 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder={`Search ${type.toLowerCase()}s...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white sticky top-0 z-10 shadow-sm shadow-gray-100">
              <tr className="text-gray-500">
                <th className="font-semibold p-4">Name</th>
                {type === 'Unit' && <th className="font-semibold p-4">Short Name</th>}
                {type !== 'Unit' && <th className="font-semibold p-4">Description</th>}
                <th className="font-semibold p-4 text-center">Status</th>
                <th className="font-semibold p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={type === 'Unit' ? 4 : 4} className="p-12 text-center text-gray-400 font-medium">
                    No {type.toLowerCase()}s found.
                  </td>
                </tr>
              ) : (
                filteredData.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50 group">
                    <td className="p-4 font-bold text-gray-900">{item.name}</td>
                    {type === 'Unit' && <td className="p-4 text-gray-600 font-mono">{item.shortName}</td>}
                    {type !== 'Unit' && <td className="p-4 text-gray-600 truncate max-w-[300px]">{item.description}</td>}
                    <td className="p-4 text-center">
                      <span className={cn(
                        "inline-flex px-2 py-1 text-xs font-bold rounded border",
                        item.status === 'Active' ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="sm" onClick={() => handleOpenModal(item)} className="w-8 h-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50">
                           <Edit2 className="w-4 h-4" />
                         </Button>
                         <Button variant="ghost" size="sm" onClick={() => { if(confirm('Delete?')) deleteFn(item.id) }} className="w-8 h-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50">
                           <Trash2 className="w-4 h-4" />
                         </Button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <form onSubmit={handleSave}>
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit' : 'Add'} {type}</h2>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" required autoFocus
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {type === 'Unit' ? (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Short Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" required
                      value={formData.shortName} 
                      onChange={e => setFormData({ ...formData, shortName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. kg, pcs, L"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <textarea 
                      rows={2}
                      value={formData.description} 
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                    ></textarea>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Save {type}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
