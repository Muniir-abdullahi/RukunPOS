import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/Components/ui/Button';

export function CTA() {
  return (
    <section className="py-24 bg-primary-600 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-900 opacity-20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Ready to simplify your retail business?
        </h2>
        <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
          Start managing your store with RukunPOS today. Get clear visibility into your inventory, sales, and profits.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-white text-primary-600 hover:bg-gray-100 shadow-xl shadow-primary-900/20">
              Start Demo <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
        <p className="mt-6 text-primary-200 text-sm">No credit card required. Frontend MVP preview.</p>
      </div>
    </section>
  );
}
