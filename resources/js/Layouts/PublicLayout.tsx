import React from 'react';
import { PublicLayout as BasePublicLayout } from '@/Components/layout/PublicLayout';

export default function PublicLayout({ children, showFooter = true }: { children: React.ReactNode; showFooter?: boolean }) {
  return <BasePublicLayout showFooter={showFooter}>{children}</BasePublicLayout>;
}
