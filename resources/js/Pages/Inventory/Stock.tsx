import React from 'react';
import { Deferred, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { StockOverview } from './StockOverview';

function Page() {
  const { props } = usePage<{ products?: any; filters?: Record<string, any> }>();

  return (
    <Deferred
      data="products"
      fallback={<StockOverview productsProp={null} filters={props.filters} />}
    >
      <StockOverview productsProp={props.products} filters={props.filters} />
    </Deferred>
  );
}

Page.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Page;
