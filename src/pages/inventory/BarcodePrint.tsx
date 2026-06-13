import React, { useState } from 'react';
import { useInventoryStore } from '@/store/inventoryStore';
import { Button } from '@/components/ui/Button';
import { useLocation } from 'react-router-dom';
import { Package, Printer, X, Plus, Minus } from 'lucide-react';

interface PrintItem {
  productId: string;
  quantity: number;
}

export function BarcodePrint() {
  const { products } = useInventoryStore();
  const location = useLocation();
  const directProductId = new URLSearchParams(location.search).get('id');

  const [printItems, setPrintItems] = useState<PrintItem[]>(
    directProductId ? [{ productId: directProductId, quantity: 12 }] : []
  );

  const handlePrint = () => {
    window.print();
  };

  const addItem = (productId: string) => {
    if (!printItems.find(i => i.productId === productId)) {
      setPrintItems([...printItems, { productId, quantity: 12 }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setPrintItems(items => items.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeItem = (productId: string) => {
    setPrintItems(items => items.filter(i => i.productId !== productId));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 h-[calc(100vh-64px)] overflow-hidden">
      {/* Left panel - Configuration */}
      <div className="w-full lg:w-1/3 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden shrink-0 print:hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="font-bold text-gray-900">Print Configuration</h2>
            <p className="text-xs text-gray-500">Add products to print barcodes</p>
          </div>
        </div>
        
        <div className="p-4 border-b border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Add Product</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
            defaultValue=""
            onChange={(e) => { addItem(e.target.value); e.target.value = ""; }}
          >
            <option value="" disabled>Select product...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {printItems.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-medium">Select products to print.</p>
            </div>
          ) : (
            printItems.map(item => {
              const p = products.find(prod => prod.id === item.productId);
              if (!p) return null;
              return (
                <div key={item.productId} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl relative group">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{p.name}</h4>
                    <p className="text-xs text-gray-500">{p.sku}</p>
                  </div>
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <button onClick={() => updateQuantity(item.productId, -1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"><Minus className="w-3 h-3" /></button>
                    <span className="w-8 text-center text-sm font-bold tabular-nums text-gray-900">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"><Plus className="w-3 h-3" /></button>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 shadow-sm">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl flex items-center gap-2 justify-center"
            disabled={printItems.length === 0}
            onClick={handlePrint}
          >
            <Printer className="w-5 h-5" /> Print {printItems.reduce((acc, i) => acc + i.quantity, 0)} Barcodes
          </Button>
        </div>
      </div>

      {/* Right panel - Preview */}
      <div className="flex-1 bg-gray-200 rounded-xl overflow-hidden flex flex-col border border-gray-300 relative print:bg-white print:border-none print:rounded-none">
        <div className="p-3 bg-gray-800 text-gray-200 text-sm font-semibold flex justify-between items-center print:hidden shrink-0">
          <span>A4 Paper Preview</span>
          <span>100%</span>
        </div>
        <div className="flex-1 overflow-auto custom-scrollbar p-8 print:p-0">
          <div className="bg-white mx-auto shadow-lg print:shadow-none w-[210mm] min-h-[297mm] p-[10mm] print:p-0 grid grid-cols-4 gap-[5mm] content-start shrink-0 barcode-print-area">
            {printItems.flatMap(item => {
              const p = products.find(prod => prod.id === item.productId);
              if (!p) return [];
              return Array(item.quantity).fill(p);
            }).map((product, idx) => (
              <div key={idx} className="border border-dashed border-gray-300 p-2 text-center flex flex-col items-center justify-center break-inside-avoid print:border-solid h-[35mm]">
                <div className="text-[10px] font-bold text-gray-800 uppercase tracking-widest mb-1 truncate w-full px-1">{product.name}</div>
                {/* Fake Barcode visualization */}
                <div className="h-10 w-full px-2 flex justify-between gap-[1px]">
                  {Array.from({length: 40}).map((_, i) => (
                    <div key={i} className="bg-black h-full" style={{ width: Math.random() > 0.5 ? '2px' : '1px' }}></div>
                  ))}
                </div>
                <div className="text-[9px] font-mono text-gray-600 mt-1">{product.sku} - ${product.sellingPrice.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .barcode-print-area, .barcode-print-area * {
            visibility: visible;
          }
          .barcode-print-area {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            padding: 0;
            width: 100%;
          }
        }
      `}} />
    </div>
  );
}
