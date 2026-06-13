import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './landing/Navbar';
import { Footer } from './landing/Footer';

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
