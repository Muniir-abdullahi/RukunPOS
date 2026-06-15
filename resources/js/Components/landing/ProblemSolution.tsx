import React from 'react';
import { FileQuestion, AlertCircle, TrendingDown, Inbox, CheckCircle2 } from 'lucide-react';

export function ProblemSolution() {
  const problems = [
    {
      icon: <AlertCircle className="w-6 h-6 text-red-500" />,
      title: "Manual sales tracking",
      desc: "Losing track of daily cash flow, relying on notebooks or messy spreadsheets."
    },
    {
      icon: <Inbox className="w-6 h-6 text-red-500" />,
      title: "Poor stock visibility",
      desc: "Never knowing exactly what's in stock, leading to stockouts or over-ordering."
    },
    {
      icon: <FileQuestion className="w-6 h-6 text-red-500" />,
      title: "Scattered records",
      desc: "Purchase orders and supplier invoices lost in email threads and filing cabinets."
    },
    {
      icon: <TrendingDown className="w-6 h-6 text-red-500" />,
      title: "Unclear profit/loss",
      desc: "Guessing at profitability because revenue and expenses aren't centralized."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Retail is hard enough. <br className="hidden md:block"/> Let's fix the operational chaos.</h2>
          <p className="text-lg text-gray-600">Running a store without a centralized system leads to costly mistakes and wasted hours. RukunPOS fixes exactly that.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Problem Side */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm mr-3">Before</span> The Old Way
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {problems.map((p, i) => (
                <div key={i} className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="mb-3">{p.icon}</div>
                  <h4 className="font-medium text-gray-900 mb-1">{p.title}</h4>
                  <p className="text-sm text-gray-500">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Solution Side */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary-50 rounded-3xl -mx-4 -my-8 sm:mx-0 sm:my-0"></div>
            <div className="relative p-6 sm:p-10 space-y-8">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                 <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm mr-3">After</span> With RukunPOS
              </h3>
              
              <div className="space-y-6">
                {[
                  { title: "Everything in one place", desc: "Sales, purchases, expenses, and inventory managed in a single, unified dashboard." },
                  { title: "Real-time stock tracking", desc: "Instantly know what to reorder. Inventory adjusts automatically with every POS sale." },
                  { title: "Clear profitability insights", desc: "Automated Profit & Loss reports so you know the health of your business at a glance." },
                  { title: "Zero learning curve", desc: "Clean, modern SaaS interface built so anyone can start using it on day one." }
                ].map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle2 className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{s.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
