import React from 'react';

export function TargetAudience() {
  const audiences = [
    "Supermarkets",
    "Pharmacies",
    "Boutiques & Apparel",
    "Electronics Shops",
    "Restaurants & Cafes",
    "Wholesalers"
  ];

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-gray-50 rounded-3xl py-16 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Who is it for?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
          Designed specifically for small and medium enterprises (SMEs) that need reliable tooling without enterprise complexity.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {audiences.map((aud, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 text-center shadow-sm">
              <span className="font-medium text-gray-900">{aud}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
