import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Settings } from './Settings';

function Page() {
  return <Settings />;
}

Page.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Page;
