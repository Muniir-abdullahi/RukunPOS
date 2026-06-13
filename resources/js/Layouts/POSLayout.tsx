import React from 'react';
import { POSLayout as BasePOSLayout } from '@/Components/layout/POSLayout';

export default function POSLayout({ children }: { children: React.ReactNode }) {
  return <BasePOSLayout>{children}</BasePOSLayout>;
}

