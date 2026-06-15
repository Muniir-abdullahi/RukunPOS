import React from 'react';
import { ChevronDown } from 'lucide-react';

export function FAQ() {
  const faqs = [
    {
      q: "Is RukunPOS suitable for small shops?",
      a: "Yes, it is purposefully designed for small and medium retail businesses seeking a simple, low-overhead system without unneeded enterprise complexity."
    },
    {
      q: "Can I manage products and stock?",
      a: "Absolutely. RukunPOS includes full inventory tracking, allowing you to manage categories, brands, variants, stock quantities, and low-stock alerts."
    },
    {
      q: "Can I track sales and purchases?",
      a: "Yes. You can manage incoming purchases from suppliers to restock inventory, and all POS sales are automatically tracked against your inventory and revenue."
    },
    {
      q: "Does it support expenses and reports?",
      a: "RukunPOS allows you to log operational expenses. It combines sales, purchases, and expenses to generate comprehensive Profit/Loss and performance reports."
    },
    {
      q: "Is this frontend-only demo?",
      a: "Yes, the current application is a frontend architecture layout and system design mock (MVP) demonstrating the user interface components and UX workflows."
    }
  ];

  // For simplicity, building an uncontrolled open/close UI using standard HTML details/summary
  return (
    <section id="faq" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">Everything you need to know about the product.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-gray-50 border border-gray-200 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer font-medium text-gray-900 hover:bg-gray-100 transition-colors">
                {faq.q}
                <ChevronDown className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-6 text-gray-600 border-t border-gray-100/50 pt-4 bg-white">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
