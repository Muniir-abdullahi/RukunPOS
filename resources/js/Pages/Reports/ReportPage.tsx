import React from 'react';
import { Deferred, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function ReportPage({ title, prop }: { title: string; prop: string }) {
  const { props } = usePage<Record<string, any>>();
  const report = props[prop];

  const content = (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">Database-backed report output</p>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <pre className="p-5 text-sm text-gray-700 overflow-auto max-h-[72vh]">{JSON.stringify(report ?? {}, null, 2)}</pre>
      </div>
    </div>
  );

  return <AppLayout>
    <Deferred data={prop} fallback={content}>
      {content}
    </Deferred>
  </AppLayout>;
}

ReportPage.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
