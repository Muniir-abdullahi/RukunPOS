import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { StockAdjustments } from './StockAdjustments';

function Page() {
  return <StockAdjustments />;
}

Page.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Page;
