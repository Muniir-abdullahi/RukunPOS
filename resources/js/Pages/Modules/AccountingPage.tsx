import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { AccountStatement, MoneyTransfer } from './Accounting';

function Page() {
  const { props } = usePage<{ view: string }>();
  return props.view === 'statement' ? <AccountStatement /> : <MoneyTransfer />;
}

Page.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Page;
