import React from 'react';
import { PublicLayout as BasePublicLayout } from '@/Components/layout/PublicLayout';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <BasePublicLayout>{children}</BasePublicLayout>;
}

