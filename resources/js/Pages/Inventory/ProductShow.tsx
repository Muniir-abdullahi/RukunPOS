import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { ProductDetail } from './ProductDetail';

function Page() {
  return <ProductDetail />;
}

Page.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Page;
