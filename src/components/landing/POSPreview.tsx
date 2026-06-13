import React from 'react';
import { Search, ShoppingCart, User, Percent, CreditCard, Printer, ArrowRight } from 'lucide-react';

export function POSPreview() {
  const steps = [
    { icon: <Search className="w-5 h-5"/>, label: "Search & Scan" },
    { icon: <ShoppingCart className="w-5 h-5"/>, label: "Add to Cart" },
    { icon: <User className="w-5 h-5"/>, label: "Select Customer" },
    { icon: <Percent className="w-5 h-5"/>, label: "Apply Tax/Discount" },
    { icon: <CreditCard className="w-5 h-5"/>, label: "Accept Payment" },
    { icon: <Printer className="w-5 h-5"/>, label: "Print Receipt" }
  ];

  return (
    <section id="pos" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-primary-100 rounded-[2rem] transform -rotate-3 scale-105 opacity-50 blur-lg"></div>
            
            {/* Abstract POS UI Mock */}
            <div className="relative bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-primary-600"></div>
                  <div className="h-4 w-24 bg-gray-300 rounded"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-gray-200 rounded"></div>
                  <div className="h-6 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>
              
              <div className="flex h-[400px]">
                {/* Product Grid area */}
                <div className="w-2/3 p-4 border-r border-gray-100 bg-gray-50/50 flex flex-col">
                  {/* Search bar */}
                  <div className="h-10 w-full bg-white border border-gray-200 rounded-md mb-4 flex items-center px-3 gap-2">
                    <Search className="w-4 h-4 text-gray-300" />
                    <div className="h-3 w-32 bg-gray-200 rounded"></div>
                  </div>
                  
                  {/* Grid */}
                  <div className="grid grid-cols-3 gap-3 flex-1">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="bg-white border border-gray-200 rounded-lg p-2 flex flex-col justify-end h-24 shadow-sm relative">
                        <div className="absolute top-2 right-2 text-xs font-bold text-gray-400">${i}0</div>
                        <div className="h-3 w-16 bg-gray-200 rounded mb-1"></div>
                        <div className="h-2 w-10 bg-gray-100 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Cart Area */}
                <div className="w-1/3 bg-white flex flex-col">
                   <div className="p-3 border-b border-gray-100 flex items-center gap-2">
                     <User className="w-4 h-4 text-gray-400" />
                     <div className="h-3 w-24 bg-primary-100 rounded"></div>
                   </div>
                   
                   <div className="flex-1 p-3 flex flex-col gap-3">
                     {[1,2].map(i => (
                       <div key={i} className="flex justify-between items-start">
                         <div>
                           <div className="h-3 w-20 bg-gray-800 rounded mb-1"></div>
                           <div className="h-2 w-8 bg-gray-400 rounded"></div>
                         </div>
                         <div className="h-3 w-10 bg-gray-800 rounded"></div>
                       </div>
                     ))}
                   </div>
                   
                   <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
                     <div className="flex justify-between">
                       <div className="h-3 w-12 bg-gray-400 rounded"></div>
                       <div className="h-3 w-10 bg-gray-800 rounded"></div>
                     </div>
                     <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                       <div className="h-4 w-12 bg-gray-600 rounded"></div>
                       <div className="h-5 w-16 bg-primary-600 rounded"></div>
                     </div>
                     <div className="h-10 w-full bg-green-500 rounded-md mt-4 flex items-center justify-center">
                       <div className="h-3 w-12 bg-white rounded"></div>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Frictionless Checkout Checkout</h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Speed is crucial at the counter. We’ve designed a Point of Sale workflow that gets customers served and on their way in seconds, while logging everything accurately in the background.
            </p>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div className="flex-1 font-medium text-gray-900">
                    {step.label}
                  </div>
                  {index < steps.length - 1 && <ArrowRight className="w-4 h-4 text-gray-300 hidden sm:block" />}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
