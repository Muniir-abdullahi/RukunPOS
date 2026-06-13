import React from 'react';
import { Button } from '@/components/ui/Button';
import { Check, Settings as SettingsIcon, Building, Globe, Mail, ShieldAlert } from 'lucide-react';

export function Settings() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto h-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure global application preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {[
            { id: 'general', label: 'General', icon: SettingsIcon, active: true },
            { id: 'company', label: 'Company Info', icon: Building },
            { id: 'localization', label: 'Localization', icon: Globe },
            { id: 'email', label: 'Email Setup', icon: Mail },
            { id: 'security', label: 'Security', icon: ShieldAlert },
          ].map(tab => (
             <button key={tab.id} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${tab.active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
               <tab.icon className="w-5 h-5" />
               {tab.label}
             </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">General Configuration</h2>
          
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">System Name</label>
              <input type="text" defaultValue="SaleLite POS" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Currency Symbol</label>
                <input type="text" defaultValue="$" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Currency Position</label>
                <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium appearance-none">
                  <option>Left</option>
                  <option>Right</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date Format</label>
                <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium appearance-none">
                  <option>YYYY-MM-DD</option>
                  <option>DD-MM-YYYY</option>
                  <option>MM/DD/YYYY</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Time Zone</label>
                <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium appearance-none">
                  <option>UTC+00:00</option>
                  <option>UTC-05:00</option>
                  <option>UTC+08:00</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Features</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Enable stock management</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Allow negative inventory</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Strict mode validation</span>
                </label>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8 font-bold flex items-center gap-2">
                <Check className="w-4 h-4" /> Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
