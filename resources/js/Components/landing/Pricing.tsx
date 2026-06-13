import React from 'react';
import { Link } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import { Button } from '@/Components/ui/Button';

export function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '$19',
      period: '/month',
      description: 'Perfect for small shops just getting started.',
      features: [
        { included: true, text: 'Single POS Terminal' },
        { included: true, text: 'Up to 500 Products' },
        { included: true, text: '1 User Account' },
        { included: true, text: 'Basic Sales Reports' },
        { included: false, text: 'Expense Management' },
        { included: false, text: 'Custom User Roles' },
      ],
      button: 'Start Free Trial',
      variant: 'outline' as const,
      popular: false,
    },
    {
      name: 'Professional',
      price: '$49',
      period: '/month',
      description: 'Everything you need to grow your retail business.',
      features: [
        { included: true, text: 'Up to 3 POS Terminals' },
        { included: true, text: 'Unlimited Products' },
        { included: true, text: 'Up to 5 User Accounts' },
        { included: true, text: 'Advanced Reporting' },
        { included: true, text: 'Expense Management' },
        { included: false, text: 'Custom User Roles' },
      ],
      button: 'Get Started',
      variant: 'default' as const,
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'Advanced features for high-volume stores.',
      features: [
        { included: true, text: 'Unlimited POS Terminals' },
        { included: true, text: 'Unlimited Products' },
        { included: true, text: 'Unlimited User Accounts' },
        { included: true, text: 'Custom Reports' },
        { included: true, text: 'Expense & Accounting' },
        { included: true, text: 'Custom User Roles' },
      ],
      button: 'Contact Sales',
      variant: 'outline' as const,
      popular: false,
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Simple, transparent pricing</h2>
          <p className="text-lg text-gray-600">Choose the plan that fits your business needs. No hidden fees, cancel anytime.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`bg-white rounded-2xl border ${plan.popular ? 'border-primary-500 shadow-xl relative scale-105 z-10' : 'border-gray-200 shadow-sm'} p-8 flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-sm h-10">{plan.description}</p>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 font-medium">{plan.period}</span>
              </div>
              
              <ul className="mb-8 flex-1 space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Link href="/dashboard" className="w-full">
                <Button 
                  variant={plan.variant} 
                  className={`w-full ${plan.popular ? 'h-12 text-base' : 'h-12'}`}
                >
                  {plan.button}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
