import React from 'react';
import { Deferred, Link, router, usePage } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import { Button } from '@/Components/ui/Button';
import { DataTable, type Column, type FilterConfig } from '@/Components/ui/DataTable';
import { useTableFilter } from '@/hooks/useTableFilter';

export interface DatabaseTableConfig {
  title: string;
  description?: string;
  prop: string;
  only?: string[];
  columns: Column<any>[];
  filters?: FilterConfig[];
  basePath?: string;
  createPath?: string;
  createLabel?: string;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  emptyMessage?: string;
}

function DatabaseTablePage({ config }: { config: DatabaseTableConfig }) {
  const { props } = usePage<Record<string, any>>();
  const table = useTableFilter({ only: config.only ?? [config.prop], defaultFilters: props.filters ?? {} });
  const records = props[config.prop];
  const basePath = config.basePath ?? window.location.pathname;

  const content = (
    <div className="p-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
          {config.description && <p className="text-sm text-gray-500 mt-1">{config.description}</p>}
        </div>
        {config.canCreate && (
          <Link href={config.createPath ?? `${basePath}/create`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <Plus className="w-4 h-4" /> {config.createLabel ?? 'Add'}
            </Button>
          </Link>
        )}
      </div>

      <DataTable
        data={records ?? null}
        columns={config.columns}
        rowKey="id"
        loading={table.loading || records === null || records === undefined}
        initialFilters={table.filters}
        filters={config.filters ?? [{ key: 'search', label: 'Search', type: 'text', placeholder: `Search ${config.title.toLowerCase()}...` }]}
        onFilter={nextFilters => table.reload(nextFilters)}
        emptyMessage={config.emptyMessage ?? 'No records found.'}
        className="flex-1 min-h-0"
        actions={(config.basePath || config.canEdit || config.canDelete) ? row => (
          <div className="flex justify-end gap-2">
            {config.basePath && (
              <Link href={`${config.basePath}/${row.id}`}>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-500 hover:text-blue-600">
                  <Eye className="w-4 h-4" />
                </Button>
              </Link>
            )}
            {config.canEdit && (
              <Link href={`${basePath}/${row.id}/edit`}>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-500 hover:text-green-600">
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
            )}
            {config.canDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => window.confirm('Delete this record?') && router.delete(`${basePath}/${row.id}`)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ) : undefined}
      />
    </div>
  );

  return <AppLayout>
    <Deferred data={config.prop} fallback={content}>
      {content}
    </Deferred>
  </AppLayout>;
}

DatabaseTablePage.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

export default DatabaseTablePage;
