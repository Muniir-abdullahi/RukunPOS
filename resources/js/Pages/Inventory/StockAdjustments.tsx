import React, { useState } from 'react';
import { useInventoryStore, StockAdjustment } from '@/store/inventoryStore';
import { Button } from '@/Components/ui/Button';
import { Plus } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import { DataTable, type Column } from '@/Components/ui/DataTable';
import { useTableFilter } from '@/hooks/useTableFilter';

export function StockAdjustments({
  adjustmentsProp,
  filters = {},
  productsProp,
  warehousesProp = [],
}: {
  adjustmentsProp?: any;
  filters?: Record<string, any>;
  productsProp?: any[];
  warehousesProp?: any[];
}) {
  const { adjustments, products, addAdjustment } = useInventoryStore();
  const table = useTableFilter({ only: ['adjustments'], defaultFilters: filters });
  const serverMode = adjustmentsProp !== undefined || Object.keys(filters).length > 0;
  const { url } = usePage();
  const initialProductId = new URLSearchParams(url.split('?')[1] || '').get('productId') || '';
  const productRows = productsProp ?? products;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<StockAdjustment> & { warehouseId?: string }>({
    productId: initialProductId,
    warehouseId: warehousesProp[0]?.id ? String(warehousesProp[0].id) : '',
    type: 'Increase',
    quantity: 1,
    reason: 'Restocking',
    notes: '',
  });
  const columns: Column<any>[] = [
    { key: 'date', label: 'Date', render: adjustment => adjustment.date ? new Date(adjustment.date).toLocaleString() : '-' },
    { key: 'reference', label: 'Reference', render: adjustment => <span className="font-medium text-gray-900">{adjustment.reference}</span> },
    { key: 'warehouse', label: 'Warehouse' },
    { key: 'products', label: 'Products', render: adjustment => <span className="block max-w-[260px] truncate">{adjustment.products || 'Unknown'}</span> },
    { key: 'items_count', label: 'Items', className: 'text-center' },
    { key: 'quantity', label: 'Quantity', className: 'text-right font-bold tabular-nums' },
    { key: 'note', label: 'Notes', render: adjustment => <span className="block max-w-[220px] truncate text-xs text-gray-500">{adjustment.note}</span> },
  ];

  const resetForm = () => setFormData({
    productId: '',
    warehouseId: warehousesProp[0]?.id ? String(warehousesProp[0].id) : '',
    type: 'Increase',
    quantity: 1,
    reason: 'Restocking',
    notes: '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || formData.quantity! <= 0) return;

    if (serverMode) {
      router.post('/inventory/adjustments', {
        warehouse_id: formData.warehouseId,
        date: new Date().toISOString().slice(0, 10),
        note: formData.notes,
        items: [{
          product_id: formData.productId,
          type: formData.type,
          quantity: formData.quantity,
          reason: formData.reason,
          notes: formData.notes,
        }],
      }, {
        preserveScroll: true,
        onSuccess: () => {
          setIsModalOpen(false);
          resetForm();
        },
      });
      return;
    }

    addAdjustment({
      ...(formData as StockAdjustment),
      id: `adj${Date.now()}`,
      date: new Date().toISOString(),
    });
    setIsModalOpen(false);
    resetForm();
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

      <DataTable
        data={serverMode ? (adjustmentsProp ?? null) : adjustments}
        columns={columns}
        rowKey="id"
        loading={serverMode && (table.loading || adjustmentsProp === null || adjustmentsProp === undefined)}
        initialFilters={table.filters}
        filters={[{ key: 'search', label: 'Search', type: 'text', placeholder: 'Search reference, product, warehouse...' }]}
        onFilter={nextFilters => serverMode && table.reload(nextFilters)}
        emptyMessage="No adjustments found."
        className="flex-1 min-h-0"
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <form onSubmit={handleSave}>
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">New Adjustment</h2>
                <p className="text-sm text-gray-500">Modify stock level manually</p>
              </div>
              <div className="p-6 space-y-4">
                {serverMode && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Warehouse</label>
                    <select
                      required
                      value={formData.warehouseId}
                      onChange={e => setFormData({ ...formData, warehouseId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="" disabled>Select warehouse...</option>
                      {warehousesProp.map(warehouse => <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Product</label>
                  <select
                    required
                    autoFocus
                    value={formData.productId}
                    onChange={e => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="" disabled>Select product...</option>
                    {productRows.map(product => (
                      <option key={product.id} value={product.id}>{product.name}{product.stock !== undefined ? ` (Current: ${product.stock})` : ''}</option>
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
                      type="number"
                      min="1"
                      required
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
                  />
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
