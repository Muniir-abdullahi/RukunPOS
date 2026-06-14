import React from 'react';
import POSLayout from '@/Layouts/POSLayout';
import { POS } from '../Sales/POS';

function Page() {
  return <POS />;
}

Page.layout = (page: React.ReactNode) => <POSLayout>{page}</POSLayout>;

export default Page;
