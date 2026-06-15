import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/Components/ui/Card';
import { PieChart, LineChart, BarChart } from 'lucide-react';

export function ReportsPreview() {
  const reports = [
    {
      title: "Sales Report",
      icon: <LineChart className="w-5 h-5 text-primary" />,
      desc: "Track daily, monthly, and yearly revenue with beautiful charts and detailed transaction logs."
    },
    {
      title: "Purchase Report",
      icon: <BarChart className="w-5 h-5 text-purple-500" />,
      desc: "Monitor your procurement costs, identify top suppliers, and track payment statuses."
    },
    {
      title: "Stock Report",
      icon: <PieChart className="w-5 h-5 text-teal-500" />,
      desc: "View current inventory valuation, get low-stock alerts, and track fast or slow moving items."
    },
    {
      title: "Profit / Loss Report",
      icon: <BarChart className="w-5 h-5 text-green-500" />,
      desc: "Get an automated calculation of your net profit by offsetting sales against item costs and logged expenses."
    }
  ];

  return (
    <section id="reports" className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Data that makes sense</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Stop guessing if you're making money. RukunPOS automatically compiles your transactional data into clear, actionable reporting summaries.
            </p>
            
            <ul className="space-y-4">
              {['Date range filtering', 'Exportable tables', 'Visual chart indicators', 'Cost vs Revenue breakdown'].map((feature, i) => (
                <li key={i} className="flex items-center text-gray-700">
                   <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3"></div>
                   {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {reports.map((report, i) => (
              <Card key={i} className="border-gray-200/60 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-md">
                      {report.icon}
                    </div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-500 leading-relaxed">{report.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
