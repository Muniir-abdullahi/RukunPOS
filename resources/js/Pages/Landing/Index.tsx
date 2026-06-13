import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { LandingPage } from './LandingPage';

function Page() {
  return <LandingPage />;
}

Page.layout = (page: React.ReactNode) => <PublicLayout>{page}</PublicLayout>;
export default Page;
