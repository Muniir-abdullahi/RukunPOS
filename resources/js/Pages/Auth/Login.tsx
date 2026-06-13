import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';

function Page() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Login</h1>
        <p className="text-sm text-gray-500 mt-1">Authentication scaffolding is ready for Breeze once Composer finishes installing dev packages.</p>
        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-lg" type="email" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-lg" type="password" />
          </div>
          <button className="w-full h-10 rounded-lg bg-primary-600 text-white font-semibold" type="button">Login</button>
        </form>
      </div>
    </div>
  );
}

Page.layout = (page: React.ReactNode) => <PublicLayout>{page}</PublicLayout>;
export default Page;
