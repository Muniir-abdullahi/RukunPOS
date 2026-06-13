import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { SystemDesign } from './SystemDesign';

function Page() {
  return <SystemDesign />;
}

Page.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Page;
