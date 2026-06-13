import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { BarcodePrint } from './BarcodePrint';

function Page() {
  return <BarcodePrint />;
}

Page.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Page;
