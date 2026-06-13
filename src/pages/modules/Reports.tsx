import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Filter, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const mockData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

function GenericReport({ title, description, hideChart }: { title: string, description: string, hideChart?: boolean }) {
  return (
    <div className="flex flex-col h-full bg-gray-50/50 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 bg-white rounded-xl shadow-sm border-gray-200">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm">
            <FileText className="w-4 h-4" /> Export Excel
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6">
         <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ">Date Range</label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
               <Calendar className="w-4 h-4 text-gray-400 mr-2" />
               <input type="date" className="bg-transparent text-sm w-full outline-none font-medium" />
               <span className="mx-2 text-gray-400">to</span>
               <input type="date" className="bg-transparent text-sm w-full outline-none font-medium" />
            </div>
         </div>
         <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ">Filter by</label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
               <Filter className="w-4 h-4 text-gray-400 mr-2" />
               <select className="bg-transparent text-sm w-full outline-none font-medium appearance-none">
                 <option>All Categories</option>
                 <option>Finished Goods</option>
                 <option>Raw Materials</option>
               </select>
            </div>
         </div>
         <div className="w-full md:w-auto flex items-end">
            <Button className="w-full md:w-auto h-10 px-8 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-medium">Generate</Button>
         </div>
      </div>

      {!hideChart && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 h-80">
          <h3 className="text-sm font-bold text-gray-900 mb-6">Overview Chart</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
              <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-900">Detailed Data Table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-100">
                {['ID', 'Date', 'Description', 'Amount'].map((h) => (
                  <th key={h} className="px-5 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1,2,3,4,5].map((row) => (
                <tr key={row} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm text-gray-900">#{row}042</td>
                  <td className="px-5 py-3 text-sm text-gray-600">2026-05-{row+10}</td>
                  <td className="px-5 py-3 text-sm text-gray-900 font-medium">{title} Record {row}</td>
                  <td className="px-5 py-3 text-sm text-gray-900 font-bold tabular-nums">${(row * 142.50).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export const SalesReport = () => <GenericReport title="Sales Report" description="Overview of sales performance over time." />
export const PurchaseReport = () => <GenericReport title="Purchase Report" description="Overview of purchasing expenses and records." />
export const ProductReport = () => <GenericReport title="Product Report" description="Analysis of product movement and profitability." hideChart />
export const StockReport = () => <GenericReport title="Stock Report" description="Current inventory levels and stock valuations." hideChart />
export const ProfitLossReport = () => <GenericReport title="Profit / Loss Report" description="Comprehensive analysis of business profitability." />
