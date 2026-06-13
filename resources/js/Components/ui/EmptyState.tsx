import React from 'react';
import { cn } from '@/lib/utils';
import { FileQuestion } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  onAction,
  icon,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center bg-white border border-gray-200 border-dashed rounded-lg", className)}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
        {icon || <FileQuestion className="h-6 w-6 text-gray-400" />}
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
