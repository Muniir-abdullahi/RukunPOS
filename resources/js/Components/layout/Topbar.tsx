import React from 'react';
import { Search, Bell, Menu, User } from 'lucide-react';
import { Button } from '@/Components/ui/Button';

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0">
      <div className="flex items-center flex-1">
        <button
          onClick={onMenuClick}
          className="mr-4 p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Global Search Placeholder */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products, customers, orders..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="default" size="sm" className="hidden sm:flex">
          Quick Sale
        </Button>
        <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 relative">
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
          <Bell className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
            <User className="w-5 h-5 text-gray-500" />
          </div>
          <div className="hidden sm:block text-sm">
            <p className="font-medium text-gray-700 leading-none">Admin User</p>
            <p className="text-gray-500 text-xs mt-1">Owner</p>
          </div>
        </div>
      </div>
    </header>
  );
}
