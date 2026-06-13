import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { TaxonomyModule } from './Taxonomies';

function Page() {
  const { props } = usePage<{ type: 'Category' | 'Brand' | 'Unit' }>();
  return <TaxonomyModule type={props.type} />;
}

Page.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Page;
