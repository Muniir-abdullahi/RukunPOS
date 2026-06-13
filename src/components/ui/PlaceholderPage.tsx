import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/Card';

export function PlaceholderPage({ title, description, plannedBlocks }: { title: string, description: string, plannedBlocks: string[] }) {
  return (
    <div className="space-y-6">
      <PageHeader 
        title={title} 
        description={description}
      />
      
      <Card>
        <CardContent className="p-12 text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-2">Coming Next</h2>
          <p className="text-gray-500 mb-6">This section is currently in design and will be implemented in the next phase.</p>
          
          <div className="max-w-md mx-auto text-left">
            <h3 className="font-medium text-sm text-gray-900 mb-3 uppercase tracking-wider">Planned UI Blocks:</h3>
            <ul className="space-y-2">
              {plannedBlocks.map((block, i) => (
                <li key={i} className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 border border-gray-100 rounded">
                  <div className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-3 text-transparent" />
                  {block}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
