import React from 'react';
import { useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { LockKeyhole, Mail, Package, ShieldCheck } from 'lucide-react';

function Page() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <div className="min-h-[72vh] bg-gradient-to-b from-primary-50/60 via-white to-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-200/60 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden bg-gray-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">RukunPOS</span>
            </div>
            <div className="mt-16 max-w-sm">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-300">Retail workspace</p>
              <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight">Manage sales, stock, and reports from one secure dashboard.</h1>
              <p className="mt-5 text-sm leading-6 text-gray-300">Sign in to continue to your POS, inventory, purchasing, accounting, and reporting tools.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-black">24/7</p>
              <p className="mt-1 text-gray-300">Store access</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-2xl font-black">Live</p>
              <p className="mt-1 text-gray-300">Sales tracking</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-900">RukunPOS</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure staff access
              </div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900">Welcome back</h1>
              <p className="mt-2 text-sm leading-6 text-gray-500">Enter your account details to open the RukunPOS dashboard.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pl-10 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20" type="email" value={data.email} onChange={e => setData('email', e.target.value)} autoComplete="email" placeholder="admin@rukunpos.app" />
              </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pl-10 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20" type="password" value={data.password} onChange={e => setData('password', e.target.value)} autoComplete="current-password" placeholder="Enter password" />
              </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                Remember this device
              </label>

              <button className="h-11 w-full rounded-lg bg-primary-600 text-sm font-bold text-white shadow-sm shadow-primary-500/20 transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={processing}>{processing ? 'Signing in...' : 'Sign in'}</button>
            </form>

            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs text-gray-500">
              <p className="font-semibold text-gray-700">Demo access</p>
              <p className="mt-1">Email: admin@rukunpos.app</p>
              <p>Password: password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Page.layout = (page: React.ReactNode) => <PublicLayout showFooter={false}>{page}</PublicLayout>;
export default Page;
