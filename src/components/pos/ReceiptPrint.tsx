import React, { forwardRef } from 'react';
import { SaleTransaction } from '@/store/posStore';

interface ReceiptProps {
  sale: SaleTransaction;
}

export const ReceiptPrint = forwardRef<HTMLDivElement, ReceiptProps>(({ sale }, ref) => {
  return (
    <div ref={ref} className="bg-white p-6 w-[300px] text-black font-mono text-sm mx-auto shadow-md border border-gray-200">
      <div className="text-center mb-4 border-b border-dashed border-gray-400 pb-4">
        <h2 className="text-xl font-bold uppercase tracking-widest mb-1">SaleLite POS</h2>
        <p className="text-xs text-gray-600">123 Market Street, City</p>
        <p className="text-xs text-gray-600">Tel: +1 234 567 890</p>
      </div>

      <div className="mb-4 text-xs">
        <p><span className="font-semibold">Invoice:</span> {sale.id}</p>
        <p><span className="font-semibold">Date:</span> {new Date(sale.date).toLocaleString()}</p>
        <p><span className="font-semibold">Cashier:</span> {sale.cashier}</p>
        <p><span className="font-semibold">Customer:</span> {sale.customer?.name || 'Walk-in Customer'}</p>
      </div>

      <div className="border-t border-b border-dashed border-gray-400 py-2 mb-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left font-semibold">
              <th className="pb-1">Item</th>
              <th className="pb-1 text-center">Qty</th>
              <th className="pb-1 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, i) => (
              <tr key={i}>
                <td className="py-1 pr-2 truncate max-w-[120px]">{item.product.name}</td>
                <td className="py-1 text-center">{item.qty}</td>
                <td className="py-1 text-right">${(item.product.price * item.qty).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs space-y-1 border-b border-dashed border-gray-400 pb-4 mb-4">
        <div className="flex justify-between"><span>Subtotal:</span> <span>${sale.subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Tax:</span> <span>${sale.tax.toFixed(2)}</span></div>
        {sale.discount > 0 && (
          <div className="flex justify-between text-red-600"><span>Discount:</span> <span>-${sale.discount.toFixed(2)}</span></div>
        )}
        <div className="flex justify-between font-bold text-base mt-2"><span>Total:</span> <span>${sale.total.toFixed(2)}</span></div>
      </div>

      <div className="text-xs space-y-1 mb-6">
        <div className="flex justify-between"><span>Payment ({sale.paymentMethod.name}):</span> <span>${sale.amountReceived.toFixed(2)}</span></div>
        <div className="flex justify-between font-semibold"><span>Change:</span> <span>${sale.change.toFixed(2)}</span></div>
      </div>

      <div className="text-center text-xs">
        <p className="font-bold">Thank you for your business!</p>
        <p className="mt-1">Please come again.</p>
        <p className="mt-4 text-[10px] text-gray-500">Powered by SaleLite</p>
      </div>
    </div>
  );
});
