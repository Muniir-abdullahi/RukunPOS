import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, User } from 'lucide-react';
import { Button } from '@/Components/ui/Button';

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { post } = useForm({});
  const { props } = usePage<{ auth?: { user?: { name?: string } | null } }>();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const userName = props.auth?.user?.name || 'Admin User';
  const handleLogout = () => post('/logout');

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 shrink-0">
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
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="default" size="sm" className="hidden sm:flex">
          Quick Sale
        </Button>
        <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100 relative">
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
          <Bell className="w-5 h-5" />
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen(current => !current)}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-expanded={isProfileOpen}
            aria-haspopup="menu"
          >
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-300">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <div className="hidden sm:block text-sm">
              <p className="font-medium text-gray-900 leading-none">{userName}</p>
              <p className="text-gray-500 text-xs mt-1">Owner</p>
            </div>
            <ChevronDown className="hidden sm:block h-4 w-4 text-gray-400" />
          </button>

          {isProfileOpen && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-20 cursor-default"
                aria-label="Close profile menu"
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">Owner</p>
                </div>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Settings className="h-4 w-4 text-gray-400" />
                  Profile settings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
