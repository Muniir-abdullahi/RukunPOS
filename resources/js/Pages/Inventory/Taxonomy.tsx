import React from 'react';
import { Deferred, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { TaxonomyModule } from './Taxonomies';

function Page() {
  const { props } = usePage<{ type: 'Category' | 'Brand' | 'Unit' | 'TaxRate'; records?: any; filters?: Record<string, any> }>();

  return (
    <Deferred
      data="records"
      fallback={<TaxonomyModule type={props.type} records={null} filters={props.filters} />}
    >
      <TaxonomyModule type={props.type} records={props.records} filters={props.filters} />
    </Deferred>
  );
}

Page.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Page;
