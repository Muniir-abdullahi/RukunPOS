import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { ProductList } from './ProductList';

function Page() {
  return <ProductList />;
}

Page.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Page;
