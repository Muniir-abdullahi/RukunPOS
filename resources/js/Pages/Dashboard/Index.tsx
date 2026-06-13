import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Dashboard } from './Dashboard';

function Page() {
  return <Dashboard />;
}

Page.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Page;
