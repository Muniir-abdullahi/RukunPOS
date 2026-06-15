import React from 'react';
import { Link } from '@inertiajs/react';
import { Package } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 lg:gap-12 mb-12">
          <div className="col-span-1 md:col-span-1 lg:col-span-1 border-r-0 md:border-r border-transparent">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900 font-display">
                Ruku<span className="text-primary">n</span><span className="ml-1 text-gray-500">POS</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              A simple POS, inventory, sales, and reporting system built for modern small and medium retail businesses.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-base text-gray-500 hover:text-primary-600 transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-base text-gray-500 hover:text-primary-600 transition-colors">Pricing</a></li>
              <li><a href="#faq" className="text-base text-gray-500 hover:text-primary-600 transition-colors">FAQ</a></li>
              <li><Link href="/system-design" className="text-base text-gray-500 hover:text-primary-600 transition-colors">System Design</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#pos" className="text-base text-gray-500 hover:text-primary-600 transition-colors">Point of Sale</a></li>
              <li><a href="#reports" className="text-base text-gray-500 hover:text-primary-600 transition-colors">Reporting</a></li>
              <li><Link href="/dashboard" className="text-base text-gray-500 hover:text-primary-600 transition-colors">Inventory</Link></li>
              <li><Link href="/dashboard" className="text-base text-gray-500 hover:text-primary-600 transition-colors">Accounting</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Contact</h3>
            <ul className="space-y-3 pb-4">
              <li className="text-base text-gray-500">support@rukun.app</li>
              <li className="text-base text-gray-500">+1 (555) 123-4567</li>
              <li className="text-base text-gray-500 flex flex-col">
                <span>123 Retail Avenue</span>
                <span>Commerce City, CA 90210</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-200 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} RukunPOS. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
            <a href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
