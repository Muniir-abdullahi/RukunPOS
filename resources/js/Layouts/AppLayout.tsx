import React from 'react';
import { AdminLayout } from '@/Components/layout/AdminLayout';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

