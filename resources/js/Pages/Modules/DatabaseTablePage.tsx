import React, { useEffect, useMemo, useState } from 'react';
import { Deferred, Link, router, useForm, usePage } from '@inertiajs/react';
import { Edit, Eye, Plus, Save, Trash2, X } from 'lucide-react';
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
  editingProp?: string;
  formFields?: DatabaseFormField[];
  formDefaults?: Record<string, any>;
}

export interface DatabaseFormField {
  key: string;
  label: string;
  type?: 'text' | 'email' | 'number' | 'date' | 'select' | 'textarea';
  required?: boolean;
  options?: { label: string; value: string | number }[];
  optionsProp?: string;
  optionLabel?: string;
  optionValue?: string;
  placeholder?: string;
}

function DatabaseTablePage({ config }: { config: DatabaseTableConfig }) {
  const { props } = usePage<Record<string, any>>();
  const table = useTableFilter({ only: config.only ?? [config.prop], defaultFilters: props.filters ?? {} });
  const records = props[config.prop];
  const basePath = config.basePath ?? window.location.pathname;
  const hasForm = Boolean(config.formFields?.length);
  const [localEditingRecord, setLocalEditingRecord] = useState<Record<string, any> | null>(null);
  const editingRecord = localEditingRecord ?? (config.editingProp ? props[config.editingProp] : null);
  const [isFormOpen, setIsFormOpen] = useState(Boolean(editingRecord));
  const isEditing = Boolean(editingRecord?.id);
  const defaultData = useMemo(() => {
    const defaults = config.formFields?.reduce((values, field) => ({ ...values, [field.key]: '' }), {} as Record<string, any>) ?? {};

    return { ...defaults, ...(config.formDefaults ?? {}) };
  }, [config.formDefaults, config.formFields]);
  const { data, setData, post, patch, processing, errors, reset, clearErrors } = useForm<Record<string, any>>(defaultData);

  useEffect(() => {
    if (!editingRecord) return;

    setIsFormOpen(true);
    setData({ ...defaultData, ...editingRecord });
  }, [defaultData, editingRecord, setData]);

  const cancelForm = () => {
    setIsFormOpen(false);
    setLocalEditingRecord(null);
    reset();
    clearErrors();

    if (isEditing) {
      router.visit(basePath, { preserveScroll: true });
    }
  };

  const submitForm = (event: React.FormEvent) => {
    event.preventDefault();

    const options = {
      preserveScroll: true,
      onSuccess: () => {
        setIsFormOpen(false);
        setLocalEditingRecord(null);
        reset();
      },
    };

    if (isEditing) {
      patch(`${basePath}/${editingRecord.id}`, options);
      return;
    }

    post(basePath, options);
  };

  const fieldOptions = (field: DatabaseFormField) => {
    if (field.options) return field.options;

    const optionRows = field.optionsProp ? props[field.optionsProp] : [];
    const rows = Array.isArray(optionRows?.data) ? optionRows.data : Array.isArray(optionRows) ? optionRows : [];

    return rows.map((row: Record<string, any>) => ({
      label: row[field.optionLabel ?? 'name'],
      value: row[field.optionValue ?? 'id'],
    }));
  };

  const content = (
    <div className="p-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
          {config.description && <p className="text-sm text-gray-500 mt-1">{config.description}</p>}
        </div>
        {config.canCreate && (
          hasForm ? (
            <Button className="bg-primary hover:bg-primary-dark text-white flex items-center gap-2" onClick={() => {
              clearErrors();
              reset();
              setData(defaultData);
              setIsFormOpen(true);
            }}>
              <Plus className="w-4 h-4" /> {config.createLabel ?? 'Add'}
            </Button>
          ) : (
          <Link href={config.createPath ?? `${basePath}/create`}>
            <Button className="bg-primary hover:bg-primary-dark text-white flex items-center gap-2">
              <Plus className="w-4 h-4" /> {config.createLabel ?? 'Add'}
            </Button>
          </Link>
          )
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
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-500 hover:text-primary">
                  <Eye className="w-4 h-4" />
                </Button>
              </Link>
            )}
            {config.canEdit && (
              hasForm ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 text-gray-500 hover:text-green-600"
                  onClick={() => {
                    clearErrors();
                    setLocalEditingRecord(row);
                    setData({ ...defaultData, ...row });
                    setIsFormOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              ) : (
                <Link href={`${basePath}/${row.id}/edit`}>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-500 hover:text-green-600">
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
              )
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

      {hasForm && isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={cancelForm} />
          <form onSubmit={submitForm} className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-lg bg-white shadow-xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{isEditing ? `Edit ${config.title}` : config.createLabel ?? `Add ${config.title}`}</h2>
                <p className="text-sm text-gray-500">Complete the required fields and save.</p>
              </div>
              <button type="button" onClick={cancelForm} className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {config.formFields?.map((field) => {
                  const error = errors[field.key];
                  const baseClass = `w-full rounded-md border px-3 py-2.5 text-sm font-medium transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 ${error ? 'border-red-300' : 'border-gray-300'}`;

                  return (
                    <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : undefined}>
                      <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                        {field.label}{field.required && <span className="text-red-500"> *</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          value={data[field.key] ?? ''}
                          onChange={event => setData(field.key, event.target.value)}
                          className={baseClass}
                        >
                          <option value="">{field.placeholder ?? `Select ${field.label}`}</option>
                          {fieldOptions(field).map(option => (
                            <option key={String(option.value)} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          value={data[field.key] ?? ''}
                          onChange={event => setData(field.key, event.target.value)}
                          placeholder={field.placeholder}
                          rows={4}
                          className={baseClass}
                        />
                      ) : (
                        <input
                          type={field.type ?? 'text'}
                          value={data[field.key] ?? ''}
                          onChange={event => setData(field.key, event.target.value)}
                          placeholder={field.placeholder}
                          className={baseClass}
                        />
                      )}
                      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
              <Button type="button" variant="outline" onClick={cancelForm}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary-dark text-white" disabled={processing}>
                <Save className="mr-2 h-4 w-4" /> {processing ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </div>
      )}
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
