import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

function Page() {
  const { props } = usePage<{ title?: string }>();
  return <div className="p-8"><h1>{props.title || 'Placeholder'}</h1></div>;
}

Page.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Page;
