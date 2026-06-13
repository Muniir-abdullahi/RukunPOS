import React from 'react';
import { MonitorPlay, Package, Users, ShoppingBag, Receipt, Calculator, BarChart3, ScanLine } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <MonitorPlay className="w-6 h-6 text-primary-600" />,
      title: "Fast POS Checkout",
      desc: "Clean point of sale interface designed for rapid checkout, scanning, and discounting."
    },
    {
      icon: <Package className="w-6 h-6 text-primary-600" />,
      title: "Inventory Management",
      desc: "Track product quantities, handle categories, variants, units, and brand details seamlessly."
    },
    {
      icon: <Users className="w-6 h-6 text-primary-600" />,
      title: "Customer & Supplier",
      desc: "Maintain detailed directories of your suppliers and recurring customers for quick access."
    },
    {
      icon: <ShoppingBag className="w-6 h-6 text-primary-600" />,
      title: "Sales & Purchases",
      desc: "Log new inventory purchases, manage sales history, process returns and exchanges."
    },
    {
      icon: <Receipt className="w-6 h-6 text-primary-600" />,
      title: "Expense Management",
      desc: "Categorize and log operational expenses to maintain an accurate bottom line."
    },
    {
      icon: <Calculator className="w-6 h-6 text-primary-600" />,
      title: "Simple Accounting",
      desc: "Track account balances, perform money transfers between accounts, and view ledgers."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-primary-600" />,
      title: "Business Reports",
      desc: "Comprehensive insights including Sales, Purchases, Stock worth, and Profit/Loss statements."
    },
    {
      icon: <ScanLine className="w-6 h-6 text-primary-600" />,
      title: "Barcode Support",
      desc: "Print custom barcodes for products and use standard scanners directly in the POS view."
    }
  ];

  return (
    <section id="features" className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-brand-primary font-semibold text-primary-600 tracking-wide uppercase text-sm mb-3">Core Modules</h2>
          <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Everything you need. Nothing you don't.</h3>
          <p className="text-gray-600">The MVP covers the essential modules needed to successfully run a modern retail storefront.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-5">
                {f.icon}
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
