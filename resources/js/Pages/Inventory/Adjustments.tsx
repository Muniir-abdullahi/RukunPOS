import React from 'react';
import { Deferred, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { StockAdjustments } from './StockAdjustments';

function Page() {
  const { props } = usePage<{ adjustments?: any; filters?: Record<string, any>; products?: any[]; warehouses?: any[] }>();

  return (
    <Deferred
      data="adjustments"
      fallback={<StockAdjustments adjustmentsProp={null} filters={props.filters} productsProp={props.products} warehousesProp={props.warehouses} />}
    >
      <StockAdjustments adjustmentsProp={props.adjustments} filters={props.filters} productsProp={props.products} warehousesProp={props.warehouses} />
    </Deferred>
  );
}

Page.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Page;
