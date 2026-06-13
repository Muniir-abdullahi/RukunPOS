import React, { useState } from 'react';
import { useInventoryStore, StockAdjustment } from '@/store/inventoryStore';
import { Button } from '@/Components/ui/Button';
import { Search, Plus, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';

export function StockAdjustments() {
  const { adjustments, products, addAdjustment } = useInventoryStore();
  const { url } = usePage();
  const initialProductId = new URLSearchParams(url.split('?')[1] || '').get('productId') || '';
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<StockAdjustment>>({
    productId: initialProductId,
    type: 'Increase',
    quantity: 1,
    reason: 'Restocking',
    notes: '',
  });

  const [searchQuery, setSearchQuery] = useState('');

  const filteredAdjustments = adjustments.filter(a => {
    const p = products.find(prod => prod.id === a.productId);
    if (!p) return false;
    return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           a.reason.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || formData.quantity! <= 0) return;
    
    addAdjustment({
      ...(formData as StockAdjustment),
      id: `adj${Date.now()}`,
      date: new Date().toISOString(),
    });
    
    setIsModalOpen(false);
    setFormData({
      productId: '',
      type: 'Increase',
      quantity: 1,
      reason: 'Restocking',
      notes: '',
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Adjustments</h1>
          <p className="text-sm text-gray-500 mt-1">Record manual inventory increases or decreases</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Adjustment
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col flex-1 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 shrink-0 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search product or reason..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button variant="outline" className="w-10 px-0 flex items-center justify-center shrink-0">
            <Filter className="w-4 h-4 text-gray-500" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white sticky top-0 z-10 shadow-sm shadow-gray-100">
              <tr className="text-gray-500">
                <th className="font-semibold p-4">Date</th>
                <th className="font-semibold p-4">Product</th>
                <th className="font-semibold p-4 text-center">Type</th>
                <th className="font-semibold p-4 text-right">Quantity</th>
                <th className="font-semibold p-4">Reason</th>
                <th className="font-semibold p-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAdjustments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400">
                    <p className="font-medium text-gray-600">No adjustments found.</p>
                  </td>
                </tr>
              ) : (
                filteredAdjustments.map(adj => {
                  const product = products.find(p => p.id === adj.productId);
                  return (
                    <tr key={adj.id} className="hover:bg-gray-50">
                      <td className="p-4 text-gray-600">{new Date(adj.date).toLocaleString()}</td>
                      <td className="p-4 font-medium text-gray-900">{product?.name || 'Unknown'}</td>
                      <td className="p-4 text-center">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-xs font-bold border",
                          adj.type === 'Increase' ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
                        )}>
                          {adj.type}
                        </span>
                      </td>
                      <td className="p-4 text-right font-black tabular-nums text-gray-900">
                        {adj.type === 'Increase' ? '+' : '-'}{adj.quantity}
                      </td>
                      <td className="p-4 text-gray-800">{adj.reason}</td>
                      <td className="p-4 text-gray-500 text-xs truncate max-w-[200px]">{adj.notes}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <form onSubmit={handleSave}>
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">New Adjustment</h2>
                <p className="text-sm text-gray-500">Modify stock level manually</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product</label>
                  <select 
                    required autoFocus
                    value={formData.productId} 
                    onChange={e => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="" disabled>Select product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (Current: {p.stock})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                    <select 
                      value={formData.type} 
                      onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="Increase">Increase (+)</option>
                      <option value="Decrease">Decrease (-)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity</label>
                    <input 
                      type="number" min="1" required
                      value={formData.quantity} 
                      onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Reason</label>
                  <select 
                    value={formData.reason} 
                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="Restocking">Restocking</option>
                    <option value="Damaged">Damaged/Defective</option>
                    <option value="Lost">Lost or Stolen</option>
                    <option value="Expired">Expired</option>
                    <option value="Found">Found Inventory</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea 
                    rows={2}
                    value={formData.notes} 
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                  ></textarea>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Save Adjustment</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
