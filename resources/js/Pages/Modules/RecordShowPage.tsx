import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/Button';

export default function RecordShowPage({ prop, title, backHref }: { prop: string; title: string; backHref: string }) {
  const { props } = usePage<Record<string, any>>();
  const record = props[prop] ?? {};

  return <AppLayout>
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <Link href={backHref}>
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <pre className="p-5 text-sm text-gray-700 overflow-auto max-h-[70vh]">{JSON.stringify(record, null, 2)}</pre>
      </div>
    </div>
  </AppLayout>;
}

RecordShowPage.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
