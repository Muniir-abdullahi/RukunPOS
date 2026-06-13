import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { StockOverview } from './StockOverview';

function Page() {
  return <StockOverview />;
}

Page.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Page;
