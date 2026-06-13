import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { ProductForm } from './ProductForm';

function Page() {
  return <ProductForm />;
}

Page.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Page;
