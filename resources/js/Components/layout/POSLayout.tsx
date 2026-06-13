import React from 'react';

export function POSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen bg-gray-50 overflow-hidden text-gray-900">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 h-full w-full relative">
          {children}
        </main>
      </div>
    </div>
  );
}
