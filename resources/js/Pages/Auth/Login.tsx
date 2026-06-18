import React from 'react';
import { useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { ArrowRight, LockKeyhole, Mail, Package, ShieldCheck } from 'lucide-react';

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
    <main className="min-h-[calc(100dvh-64px)] bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md lg:grid-cols-[0.95fr_1fr]">
        <section className="relative hidden min-h-[560px] flex-col justify-between bg-brand-navy p-10 text-white lg:flex">
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold font-display">
                Ruku<span className="text-primary">n</span><span className="ml-1 text-gray-300">POS</span>
              </span>
            </div>

            <div className="mt-20 max-w-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-300">Retail workspace</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-white">Run checkout, stock, and finance from one secure place.</h1>
              <p className="mt-5 max-w-sm text-sm leading-6 text-gray-300">Sign in to continue to your POS, inventory, purchasing, accounting, and reporting tools.</p>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-white/10 bg-white/5 p-5">
              <p className="text-2xl font-semibold text-white">24/7</p>
              <p className="mt-1 text-sm text-gray-300">Store access</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-5">
              <p className="text-2xl font-semibold text-white">Live</p>
              <p className="mt-1 text-sm text-gray-300">Sales tracking</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900 font-display">
                  Ruku<span className="text-primary">n</span><span className="ml-1 text-gray-500">POS</span>
                </span>
              </div>
            </div>

            <div className="mb-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-light px-3 py-1 text-xs font-semibold text-primary-text">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secure staff access
              </div>
              <h1 className="text-3xl font-semibold text-gray-900">Welcome back</h1>
              <p className="mt-2 text-sm leading-6 text-gray-500">Enter your account details to open the RukunPOS dashboard.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 pl-10 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    type="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    autoComplete="email"
                    placeholder="email@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Password</label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 pl-10 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    type="password"
                    value={data.password}
                    onChange={e => setData('password', e.target.value)}
                    autoComplete="current-password"
                    placeholder="Enter password"
                  />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                Remember this device
              </label>

              <button className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={processing}>
                {processing ? 'Signing in...' : 'Sign in'}
                {!processing && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

Page.layout = (page: React.ReactNode) => <PublicLayout showFooter={false}>{page}</PublicLayout>;
export default Page;
