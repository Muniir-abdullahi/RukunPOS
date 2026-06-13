import React from 'react';
import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export function GenericPlaceholder({ moduleName, planned }: { moduleName: string; planned: string[] }) {
  return (
    <PlaceholderPage 
      title={`${moduleName} Management`} 
      description={`Manage ${moduleName.toLowerCase()} and related records.`}
      plannedBlocks={planned}
    />
  );
}
