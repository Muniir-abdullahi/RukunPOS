import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './Badge';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  
  let variant: 'default' | 'success' | 'warning' | 'danger' = 'default';
  
  if (['completed', 'received', 'active', 'paid', 'accepted'].includes(normalized)) {
    variant = 'success';
  } else if (['pending', 'ordered', 'sent'].includes(normalized)) {
    variant = 'warning';
  } else if (['cancelled', 'returned', 'inactive', 'declined'].includes(normalized)) {
    variant = 'danger';
  }
  
  // Capitalize first letter
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Badge variant={variant} className={className}>
      {displayStatus}
    </Badge>
  );
}
