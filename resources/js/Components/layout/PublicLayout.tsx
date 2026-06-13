import React from 'react';
import { Navbar } from './landing/Navbar';
import { Footer } from './landing/Footer';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
