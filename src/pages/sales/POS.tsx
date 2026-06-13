import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Plus, Minus, Trash2, User, Percent, 
  CreditCard, Printer, Pause, FileClock, 
  Maximize, X, Smartphone, Banknote, HelpCircle, ShoppingCart, ArrowLeft,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { posCategories, posProducts, posCustomers } from '@/data/posMockData';
import { usePosStore, PaymentMethod, Customer, SaleTransaction } from '@/store/posStore';
import { ReceiptPrint } from '@/components/pos/ReceiptPrint';

export function POS() {
  const { 
    cart, activeCategory, searchQuery, 
    addToCart, removeFromCart, updateQuantity, clearCart,
    setActiveCategory, setSearchQuery,
    taxRate, discountRate, setDiscount,
    holdSale, heldSales, resumeSale,
    recentSales, completeSale
  } = usePosStore();

  const [selectedCustomerId, setSelectedCustomerId] = useState('walk-in');
  const [selectedCustomer, setSelectedCustomerState] = useState<Customer>({ id: 'walk-in', name: 'Walk-in Customer', phone: '' });

  // Modals
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [isRecentOpen, setRecentOpen] = useState(false);
  const [isHeldSalesOpen, setHeldSalesOpen] = useState(false);
  const [isReceiptOpen, setReceiptOpen] = useState(false);
  const [completedSale, setCompletedSale] = useState<SaleTransaction | null>(null);

  // Payment State
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>({ id: 'cash', name: 'Cash', type: 'cash' });
  const [amountReceivedInput, setAmountReceivedInput] = useState('');
  
  // Custom discount
  const [isDiscountModalOpen, setDiscountModalOpen] = useState(false);
  const [customDiscount, setCustomDiscount] = useState('0');

  // Filter products
  const filteredProducts = useMemo(() => {
    return posProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = activeCategory === 'all' || p.categoryId === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, activeCategory]);

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
  const tax = subtotal * taxRate;
  const discount = subtotal * discountRate;
  const total = subtotal + tax - discount;

  const paymentMethods: PaymentMethod[] = [
    { id: 'cash', name: 'Cash', type: 'cash' },
    { id: 'card', name: 'Card', type: 'card' },
    { id: 'evc', name: 'EVC Plus', type: 'mobile_money' },
    { id: 'split', name: 'Split Payment', type: 'split' },
  ];

  // Sync customer selection
  useEffect(() => {
    const c = posCustomers.find(cu => cu.id === selectedCustomerId) || { id: 'walk-in', name: 'Walk-in Customer', phone: '' };
    setSelectedCustomerState(c);
  }, [selectedCustomerId]);

  const handleCompleteSale = () => {
    if (!selectedPayment) return;
    const amountRcvd = parseFloat(amountReceivedInput) || total;
    if (amountRcvd < total && selectedPayment.type !== 'split') {
       alert("Received amount cannot be less than total.");
       return;
    }
    
    usePosStore.getState().setCustomer(selectedCustomer);

    const sale = completeSale(selectedPayment, Math.max(total, amountRcvd));
    setCompletedSale(sale);
    setCheckoutOpen(false);
    setAmountReceivedInput('');
    setReceiptOpen(true);
  };

  const handleHoldSale = () => {
    usePosStore.getState().setCustomer(selectedCustomer);
    holdSale();
  };

  const printReceiptAction = () => {
    const printContent = document.querySelector('.ReceiptPrint-container');
    if (!printContent) return;
    
    // Create an iframe to print
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow?.document;
    if (!doc) return;

    // Get styles from current document to ensure tailwind works
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(s => s.outerHTML)
      .join('\\n');

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Receipt</title>
          ${styles}
          <style>
            body { 
              background: white; 
              margin: 0; 
              padding: 0; 
              font-family: monospace;
            }
            .ReceiptPrint-container { 
              box-shadow: none !important; 
              border: none !important; 
              margin: 0 auto; 
              padding: 20px;
              width: 300px;
            }
            @page { margin: 0; }
          </style>
        </head>
        <body>
          <div class="ReceiptPrint-container">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    doc.close();
    
    // Clean up iframe after print dialog closes (approximate)
    setTimeout(() => {
      if (document.body.contains(printFrame)) {
        document.body.removeChild(printFrame);
      }
    }, 10000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f4f6f8] relative">
      
      {/* POS Header */}
      <header className="bg-white border-b border-gray-200 h-14 px-4 flex items-center justify-between shrink-0 z-20 relative shadow-sm">
        <div className="flex items-center gap-3 w-full max-w-2xl">
          <Link to="/dashboard" className="hidden sm:block">
            <button className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          
          <div className="flex items-center">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center mr-2 shadow-sm">
              <ShoppingCart className="w-3.5 h-3.5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight hidden lg:block mr-2">SaleLite</h1>
            <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-4">
              Main Store
            </span>
          </div>
          
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Scan barcode or search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-100/80 border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-gray-900 placeholder:text-gray-500"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center mr-2 text-xs font-medium text-gray-500">
             <span className="mr-2">Cashier: Admin</span>
             <span>•</span>
             <span className="ml-2">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
            
          <div className="relative hidden md:block w-40">
            <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <select 
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-gray-100/80 border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none font-medium text-gray-700 cursor-pointer transition-all"
            >
              {posCustomers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-gray-200 hidden md:block mx-0.5"></div>

          <Button variant="ghost" size="sm" onClick={() => setRecentOpen(true)} className="hidden sm:flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-medium rounded-lg h-8 px-2">
            <FileClock className="w-4 h-4" /> <span className="hidden xl:inline">Recent</span>
            {recentSales.length > 0 && <span className="ml-1 bg-blue-100 text-blue-700 py-0.5 px-1.5 rounded text-[10px] tabular-nums">{recentSales.length}</span>}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setHeldSalesOpen(true)} className="hidden md:flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-medium rounded-lg h-8 px-2">
            <Pause className="w-4 h-4" /> <span className="hidden xl:inline">Held</span>
            {heldSales.length > 0 && <span className="ml-1 bg-orange-100 text-orange-700 py-0.5 px-1.5 rounded text-[10px] tabular-nums">{heldSales.length}</span>}
          </Button>
          <button className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-50 hidden md:flex transition-colors">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout Split */}
      <div className="flex-1 flex flex-col-reverse lg:flex-row overflow-hidden relative">
        
        {/* LEFT AREA: CART & CHECKOUT (320-360px) */}
        <div className="w-full lg:w-[320px] xl:w-[360px] bg-white flex flex-col border-r border-gray-200 z-10 shrink-0 h-[45vh] lg:h-auto shadow-[4px_0_24px_rgba(0,0,0,0.02)] min-h-0">
          
          {/* Mobile Customer Selection */}
          <div className="p-3 border-b border-gray-100 bg-white shrink-0 sm:hidden">
             {/* Mobile customer dropdown (same as desktop) */}
             <div className="relative">
               <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <select 
                 value={selectedCustomerId}
                 onChange={(e) => setSelectedCustomerId(e.target.value)}
                 className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none font-medium text-gray-700"
               >
                 {posCustomers.map(c => (
                   <option key={c.id} value={c.id}>{c.name}</option>
                 ))}
               </select>
             </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto w-full p-2 space-y-1.5 bg-gray-50/50 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-80">
                <ShoppingCart className="w-10 h-10 text-gray-300 mb-2" />
                <p className="text-sm font-semibold text-gray-600">Cart is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="relative group flex items-start gap-2 bg-white p-2 rounded-lg border border-gray-100 shadow-sm hover:border-blue-200/60 transition-all animate-in slide-in-from-top-2">
                  
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100/60 p-1">
                    <img src={item.product.image} className="w-full h-full object-contain mix-blend-multiply" alt={item.product.name} />
                  </div>

                  <div className="flex-1 min-w-0 pr-5">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-semibold text-gray-900 leading-tight pr-2">{item.product.name}</h4>
                      <span className="text-xs font-bold text-gray-900 tabular-nums shrink-0">${(item.product.price * item.qty).toFixed(2)}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5 mb-1.5">
                      ${item.product.price.toFixed(2)} <span className="text-gray-300 mx-0.5">•</span> {item.product.sku}
                    </p>
                    
                    <div className="flex items-center">
                      <div className="flex items-center bg-gray-50 rounded bg-white border border-gray-200 shadow-sm">
                        <button onClick={() => updateQuantity(item.product.id, -1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"><Minus className="w-3 h-3" /></button>
                        <span className="w-6 text-center text-xs font-bold text-gray-900">{item.qty}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => removeFromCart(item.product.id)} className="absolute top-1 right-1 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Totals & Payment */}
          <div className="p-3 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] shrink-0 z-20">
            <div className="space-y-1 mb-3 px-1">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-gray-900 tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[13px] group cursor-pointer" onClick={() => setDiscountModalOpen(true)}>
                <span className="text-gray-500 border-b border-dashed border-gray-300 group-hover:border-blue-400 group-hover:text-blue-600 transition-colors flex items-center gap-1"><Percent className="w-3 h-3"/> Discount {(discountRate > 0) ? `(${(discountRate*100).toFixed(0)}%)` : ''}</span>
                <span className="font-semibold text-gray-900 tabular-nums text-red-600">-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-gray-500">Tax (10%)</span>
                <span className="font-semibold text-gray-900 tabular-nums">${tax.toFixed(2)}</span>
              </div>
              
              <div className="pt-2 mt-2 border-t border-gray-100 flex justify-between items-end">
                <div className="text-xs text-gray-500 font-medium">{cart.reduce((s,i)=>s+i.qty,0)} items</div>
                <div className="text-3xl font-black text-gray-900 tracking-tight tabular-nums leading-none">
                  ${total.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 mt-1">
              <div className="grid grid-cols-4 gap-1.5 mb-1">
                {paymentMethods.map(pm => (
                  <Button 
                    key={pm.id}
                    variant="secondary" 
                    className="h-9 px-1 text-[11px] font-semibold bg-gray-100 text-gray-700 border border-gray-200 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors" 
                    disabled={cart.length === 0} 
                    onClick={() => { setSelectedPayment(pm); setCheckoutOpen(true); }}
                  >
                    {pm.type === 'cash' && <Banknote className="w-3 h-3 mr-1" />}
                    {pm.type === 'card' && <CreditCard className="w-3 h-3 mr-1" />}
                    {pm.type === 'mobile_money' && <Smartphone className="w-3 h-3 mr-1" />}
                    {pm.name}
                  </Button>
                ))}
              </div>

              <Button 
                className={cn(
                  "w-full h-12 text-lg font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2",
                  cart.length === 0 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-0" 
                    : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md border-0"
                )}
                disabled={cart.length === 0}
                onClick={() => { setSelectedPayment(paymentMethods[0]); setCheckoutOpen(true); }}
              >
                Complete Sale • ${(total).toFixed(2)}
              </Button>
              
              <div className="grid grid-cols-2 gap-2 mt-0.5 hidden sm:grid">
                 <Button variant="outline" onClick={handleHoldSale} className="h-9 text-xs font-semibold rounded-lg text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors" disabled={cart.length === 0}>
                   <Pause className="w-3.5 h-3.5 mr-1" /> Hold
                 </Button>
                 <Button variant="ghost" className="h-9 text-xs font-semibold rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors" onClick={() => clearCart()} disabled={cart.length === 0}>
                   <Trash2 className="w-3.5 h-3.5 mr-1" /> Cancel
                 </Button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT AREA: PRODUCTS (65%) */}
        <div className="flex-1 flex flex-col bg-gray-50/50 overflow-hidden relative min-h-0">
          
          {/* Categories */}
          <div className="px-3 py-2 bg-white border-b border-gray-100 shrink-0 shadow-sm z-10">
            <div className="flex gap-1.5 overflow-x-auto custom-scrollbar pb-1">
              {posCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all border whitespace-nowrap",
                    activeCategory === cat.id 
                      ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm" 
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 shadow-sm"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className={cn(
                    "bg-white rounded-xl overflow-hidden shadow-sm border transition-all group text-left flex flex-col relative",
                    product.stock === 0 
                      ? "opacity-60 cursor-not-allowed border-gray-100" 
                      : "border-gray-200/60 hover:border-blue-300 hover:shadow-md cursor-pointer active:scale-[0.98]"
                  )}
                >
                  <div className="aspect-square bg-white relative overflow-hidden flex items-center justify-center border-b border-gray-50/50 p-2">
                    <img src={product.image} alt={product.name} className="object-contain w-full h-full mix-blend-multiply transition-transform duration-300 group-hover:scale-110" />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-[1px]">
                         <span className="bg-red-50 text-red-600 text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded border border-red-100 shadow-sm">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 flex-1 flex flex-col bg-white">
                    <div className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5 truncate">{product.sku}</div>
                    <h3 className="text-xs font-semibold text-gray-800 leading-snug mb-2 line-clamp-2">{product.name}</h3>
                    <div className="mt-auto flex justify-between items-end">
                      <div className="text-sm font-bold text-gray-900 tabular-nums">${product.price.toFixed(2)}</div>
                      <div className="text-[10px] text-gray-500 font-medium bg-gray-50 px-1 py-0.5 rounded border border-gray-100">{product.stock} left</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-16">
                <Search className="w-10 h-10 mb-3 text-gray-300" />
                <p className="text-base font-bold text-gray-900">No products found</p>
                <p className="text-xs mt-1">Try adjusting your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setCheckoutOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-full animate-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Payment</h2>
              <button onClick={() => setCheckoutOpen(false)} className="text-gray-400 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto">
              <div className="bg-blue-50/50 rounded-2xl p-6 flex flex-col items-center justify-center mb-6 border border-blue-100">
                <p className="text-sm text-blue-600 font-bold tracking-wide uppercase mb-1">Total Due</p>
                <p className="text-5xl font-extrabold text-blue-700 tabular-nums tracking-tight">${total.toFixed(2)}</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {paymentMethods.map(method => (
                  <button 
                    key={method.id} 
                    onClick={() => setSelectedPayment(method)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500",
                      selectedPayment?.id === method.id 
                        ? "border-blue-500 bg-blue-50 text-blue-700" 
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 text-gray-600"
                    )}
                  >
                     {method.type === 'cash' && <Banknote className={cn("w-6 h-6 mb-2", selectedPayment?.id === method.id ? "text-blue-600" : "text-gray-500")} />}
                     {method.type === 'card' && <CreditCard className={cn("w-6 h-6 mb-2", selectedPayment?.id === method.id ? "text-blue-600" : "text-gray-500")} />}
                     {method.type === 'mobile_money' && <Smartphone className={cn("w-6 h-6 mb-2", selectedPayment?.id === method.id ? "text-blue-600" : "text-gray-500")} />}
                     {method.type === 'split' && <HelpCircle className={cn("w-6 h-6 mb-2", selectedPayment?.id === method.id ? "text-blue-600" : "text-gray-500")} />}
                     <span className="text-sm font-semibold">{method.name}</span>
                  </button>
                ))}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount Received ($)</label>
                  <input 
                    type="number" 
                    value={amountReceivedInput}
                    onChange={(e) => setAmountReceivedInput(e.target.value)}
                    placeholder={total.toFixed(2)}
                    className="w-full border border-gray-200 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-lg px-4 py-3 bg-white font-medium transition-all" 
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Change Due:</span>
                  <span className="text-xl font-bold text-gray-900 tabular-nums">
                    ${Math.max(0, (parseFloat(amountReceivedInput) || total) - total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3">
               <label className="flex items-center gap-2 cursor-pointer mr-auto mb-3 sm:mb-0">
                 <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4.5 h-4.5 transition-all" />
                 <span className="text-sm text-gray-700 font-semibold">Print Receipt</span>
               </label>
               <Button variant="outline" className="w-full sm:w-auto h-12 rounded-xl text-gray-600 border-gray-200 hover:bg-gray-100 font-semibold" onClick={() => setCheckoutOpen(false)}>Cancel</Button>
               <Button className="w-full sm:w-auto h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-8 shadow-sm" onClick={handleCompleteSale}>Complete Sale</Button>
            </div>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {isReceiptOpen && completedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200 bg-gray-900/80 backdrop-blur-sm">
          <div className="relative flex flex-col items-center w-full max-w-sm max-h-[100dvh] overflow-y-auto py-8 no-scrollbar">
            
            <div className="w-full flex justify-center mb-4 shrink-0 animate-in slide-in-from-top-4">
               <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-3 rounded-xl flex items-center gap-3 shadow-lg">
                 <CheckCircle2 className="w-5 h-5 shrink-0" />
                 <span className="font-bold text-sm text-green-800">Sale Completed</span>
               </div>
            </div>

            <div className="bg-white rounded-md shadow-2xl overflow-hidden print:shadow-none mb-6 shrink-0 ReceiptPrint-container max-w-[300px] w-full mx-auto relative">
               <ReceiptPrint sale={completedSale} />
            </div>

            <div className="flex gap-3 w-full max-w-[300px] shrink-0">
               <Button variant="outline" className="flex-1 bg-white hover:bg-gray-50 text-gray-900 border-none shadow-sm h-12 rounded-xl font-bold" onClick={() => setReceiptOpen(false)}>New Sale</Button>
               <Button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white h-12 rounded-xl font-bold shadow-lg" onClick={printReceiptAction}>
                 <Printer className="w-4 h-4 mr-2" /> Print
               </Button>
            </div>
          </div>
        </div>
      )}

      {/* DISCOUNT MODAL */}
      {isDiscountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setDiscountModalOpen(false)}></div>
           <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Apply Discount</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Percentage (%)</label>
                <input 
                  type="number" 
                  value={customDiscount}
                  onChange={(e) => setCustomDiscount(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg shadow-sm focus:border-blue-500 focus:ring-2 py-2 px-3 text-gray-900" 
                />
              </div>
              <div className="flex gap-3">
                 <Button variant="outline" className="flex-1" onClick={() => setDiscountModalOpen(false)}>Cancel</Button>
                 <Button className="flex-1 bg-blue-600" onClick={() => {
                   setDiscount((parseFloat(customDiscount) || 0) / 100);
                   setDiscountModalOpen(false);
                 }}>Apply</Button>
              </div>
           </div>
        </div>
      )}

      {/* HELD SALES DRAWER */}
      {isHeldSalesOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
           <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setHeldSalesOpen(false)}></div>
           <div className="relative w-full max-w-md bg-[#f8f9fa] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
             <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center bg-white z-10 shrink-0">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-100">
                    <Pause className="w-4 h-4 text-orange-600"/>
                  </div>
                  Held Sales
                </h2>
                <button onClick={() => setHeldSalesOpen(false)} className="text-gray-400 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                {heldSales.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                    <Pause className="w-12 h-12 text-gray-300 mb-3" />
                    <p>No held sales.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {heldSales.map(sale => (
                      <div key={sale.id} className="p-5 border border-orange-100 rounded-2xl hover:border-orange-200 transition-all bg-white shadow-sm hover:shadow-md">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md uppercase tracking-wider">{sale.id}</span>
                            <h4 className="font-semibold text-gray-900 mt-2">{sale.customer?.name || 'Walk-in'}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">{sale.items.length} items</p>
                          </div>
                          <span className="font-bold text-gray-900 text-lg tabular-nums">${sale.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-xs font-medium text-gray-400">{new Date(sale.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          <Button variant="default" size="sm" className="h-8 text-xs font-semibold rounded-lg bg-gray-900 text-white hover:bg-black" onClick={() => {
                             resumeSale(sale.id);
                             setHeldSalesOpen(false);
                          }}>Resume Sale</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
           </div>
        </div>
      )}

      {/* RECENT SALES DRAWER */}
      {isRecentOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
           <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setRecentOpen(false)}></div>
           <div className="relative w-full max-w-md bg-[#f8f9fa] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
             <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center bg-white z-10 shrink-0">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <FileClock className="w-4 h-4 text-gray-600"/>
                  </div>
                  Recent Sales
                </h2>
                <button onClick={() => setRecentOpen(false)} className="text-gray-400 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5" />
                </button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                {recentSales.length === 0 ? (
                   <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                    <FileClock className="w-12 h-12 text-gray-300 mb-3" />
                    <p>No sales today yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentSales.map(sale => (
                      <div key={sale.id} className="p-5 border border-gray-100 rounded-2xl hover:border-gray-200 transition-all bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md uppercase tracking-wider">{sale.id}</span>
                            <h4 className="font-semibold text-gray-900 mt-2">{sale.customer?.name || 'Walk-in'}</h4>
                          </div>
                          <span className="font-bold text-green-600 text-lg tabular-nums">${sale.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-xs font-medium text-gray-400">{new Date(sale.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold rounded-lg text-gray-600 border-gray-200 hover:bg-gray-50" onClick={() => {
                               setCompletedSale(sale);
                               setReceiptOpen(true);
                               setRecentOpen(false);
                            }}>View Receipt</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
           </div>
        </div>
      )}

      {/* Embedded CSS for custom scrollbar within this component */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #94a3b8;
        }
        
        @media print {
           body * {
             visibility: hidden;
           }
           .print\\:shadow-none {
             box-shadow: none !important;
           }
           .bg-gray-900\\/80 {
             background: white !important;
             align-items: flex-start;
             padding: 0;
           }
           .ReceiptPrint-container, .ReceiptPrint-container * {
             visibility: visible;
           }
           .ReceiptPrint-container {
             position: absolute;
             left: 0;
             top: 0;
             margin: 0;
             box-shadow: none;
             border: none;
           }
           button {
             display: none !important;
           }
           .bg-green-50 {
             display: none !important;
           }
        }
      `}} />
    </div>
  );
}
