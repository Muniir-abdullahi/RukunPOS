import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ProductReport, ProfitLossReport, PurchaseReport, SalesReport } from './Reports';

function Page() {
  const { props } = usePage<{ report: string }>();
  if (props.report === 'purchases') return <PurchaseReport />;
  if (props.report === 'products') return <ProductReport />;
  if (props.report === 'profit-loss') return <ProfitLossReport />;
  return <SalesReport />;
}

Page.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Page;
