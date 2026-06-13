import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const location = useLocation();

  const handleMenuClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(true);
    } else {
      setIsDesktopCollapsed(!isDesktopCollapsed);
    }
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform lg:relative transition-all duration-300 ease-in-out bg-white
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar 
          onClose={() => setIsMobileOpen(false)} 
          collapsed={isDesktopCollapsed} 
          onExpand={() => setIsDesktopCollapsed(false)}
        />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={handleMenuClick} />
        
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
