import React from 'react';
import { Deferred, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ProductList } from './ProductList';

function Page() {
  const { props } = usePage<{ products?: any; filters?: Record<string, any>; categories?: any[]; brands?: any[]; units?: any[] }>();
  const productList = (
    <ProductList
      productsProp={props.products}
      filters={props.filters}
      categoriesProp={props.categories}
      brandsProp={props.brands}
      unitsProp={props.units}
    />
  );

  return (
    <Deferred
      data="products"
      fallback={<ProductList productsProp={null} filters={props.filters} categoriesProp={props.categories} brandsProp={props.brands} unitsProp={props.units} />}
    >
      {productList}
    </Deferred>
  );
}

Page.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Page;
