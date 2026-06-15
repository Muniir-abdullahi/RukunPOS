import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { Button } from '@/Components/ui/Button';

export function Hero() {
  return (
    <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary-50/50 to-white"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-100/50 blur-3xl opacity-50"></div>
      <div className="absolute top-40 -left-40 w-72 h-72 rounded-full bg-primary-200/30 blur-3xl opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-sm font-medium text-primary-600 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary-500 mr-2"></span>
            RukunPOS v1.0 is now live
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 max-w-4xl mx-auto mb-6 leading-tight">
            Simple POS for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">modern retail businesses</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            The all-in-one platform to manage your point of sale, inventory, sales, purchases, expenses, accounting, and reports—without the complexity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-lg shadow-primary-500/20">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base bg-white">
                View Dashboard <LayoutDashboard className="ml-2 w-5 h-5 text-gray-500" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Mock dashboard preview */}
        <div className="mt-16 lg:mt-24 mx-auto max-w-5xl rounded-xl border border-gray-200/50 bg-white/50 p-2 shadow-2xl backdrop-blur-sm sm:p-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <div className="h-8 bg-gray-100 flex items-center px-4 border-b border-gray-200 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            {/* Simple wireframe of a dashboard */}
            <div className="flex h-[300px] md:h-[500px]">
              <div className="w-48 border-r border-gray-200 bg-white hidden md:block p-4 space-y-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded bg-gray-200"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
              <div className="flex-1 p-4 md:p-8 overflow-hidden bg-gray-50">
                <div className="flex justify-between mb-8">
                  <div className="h-6 w-32 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-24 flex flex-col justify-between">
                      <div className="h-3 w-16 bg-gray-100 rounded"></div>
                      <div className="h-6 w-24 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl border border-gray-100 h-48 shadow-sm p-4">
                   <div className="h-4 w-40 bg-gray-100 rounded mb-6"></div>
                   <div className="flex items-end justify-between h-24 gap-2 border-b border-gray-100 pb-2">
                      {[10, 30, 20, 50, 40, 70, 60].map(h => (
                        <div key={h} className="w-full bg-primary-100 rounded-t" style={{height: `${h}%`}}></div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
