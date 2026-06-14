import React from 'react';
import { Button } from '@/Components/ui/Button';
import { ArrowRightIcon, RefreshCcw } from 'lucide-react';
import { DataTable } from '@/Components/ui/DataTable';

export function MoneyTransfer() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Money Transfer</h1>
        <p className="text-sm text-gray-500 mt-1">Transfer funds between internal business accounts</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="flex-1 w-full bg-gray-50 rounded-xl p-5 border border-gray-100">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">From Account</label>
            <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none">
              <option>Cash (Balance: $5,000.00)</option>
              <option>Bank Account (Balance: $15,400.50)</option>
            </select>
          </div>
          
          <div className="hidden md:flex w-12 h-12 rounded-full bg-blue-50 items-center justify-center shrink-0 border border-blue-100">
            <ArrowRightIcon className="w-5 h-5 text-blue-600" />
          </div>
          
          <div className="flex-1 w-full bg-blue-50/30 rounded-xl p-5 border border-blue-100/50">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">To Account</label>
            <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none">
              <option>Bank Account (Balance: $15,400.50)</option>
              <option>Cash (Balance: $5,000.00)</option>
            </select>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Amount to Transfer</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input type="number" placeholder="0.00" className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
            <input type="date" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reference Note</label>
            <textarea placeholder="e.g. Deposit to bank for week 1" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none min-h-[100px]" />
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
          <Button className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 shadow-sm">
            <RefreshCcw className="w-5 h-5" /> Execute Transfer
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AccountStatement() {
  const rows = [
    { id: 1, date: '2026-05-10', reference: '-', description: 'Opening Balance', debit: '-', credit: '-', balance: '$12,000.00' },
    { id: 2, date: '2026-05-12', reference: 'SL-002', description: 'Payment received for SL-002', debit: '-', credit: '$3,400.50', balance: '$15,400.50' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Account Statement</h1>
        <p className="text-sm text-gray-500 mt-1">View transaction ledger for specific accounts</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 flex flex-col md:flex-row gap-4">
         <div className="flex-1">
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Account</label>
           <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none h-10 bg-gray-50">
             <option>Bank Account (AC-002)</option>
             <option>Cash (AC-001)</option>
           </select>
         </div>
         <div className="flex-1">
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">From Date</label>
           <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none h-10 bg-gray-50" />
         </div>
         <div className="flex-1">
           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">To Date</label>
           <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none h-10 bg-gray-50" />
         </div>
         <div className="flex items-end">
           <Button className="h-10 px-8 rounded-lg bg-gray-900 text-white font-medium w-full md:w-auto">View Ledger</Button>
         </div>
      </div>

      <DataTable
        data={rows}
        rowKey="id"
        columns={[
          { key: 'date', label: 'Date' },
          { key: 'reference', label: 'Reference' },
          { key: 'description', label: 'Description', render: row => <span className="font-medium text-gray-900">{row.description}</span> },
          { key: 'debit', label: 'Debit', className: 'text-right' },
          { key: 'credit', label: 'Credit', className: 'text-right', render: row => <span className="text-green-600 font-medium">{row.credit}</span> },
          { key: 'balance', label: 'Balance', className: 'text-right', render: row => <span className="font-bold text-gray-900">{row.balance}</span> },
        ]}
      />
    </div>
  );
}
