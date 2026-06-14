import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
  header?: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface PaginatedData<T> {
  data: T[];
  meta: PaginationMeta;
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'daterange';
  options?: { label: string; value: string }[];
  placeholder?: string;
}

export interface DataTableProps<T> {
  data: PaginatedData<T> | T[] | any | null;
  columns: Column<T>[];
  filters?: FilterConfig[];
  onFilter?: (filters: Record<string, any>) => void;
  initialFilters?: Record<string, any>;
  loading?: boolean;
  skeletonRows?: number;
  rowKey?: keyof T;
  actions?: (row: T) => React.ReactNode;
  selectable?: boolean;
  onSelectionChange?: (ids: any[]) => void;
  emptyMessage?: string;
  perPageOptions?: number[];
  className?: string;
}

const SkeletonRow = ({ columns }: { columns: number }) => (
  <tr className="border-b border-gray-100">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
      </td>
    ))}
  </tr>
);

function normalizeData<T>(data: DataTableProps<T>['data']): PaginatedData<T> | null {
  if (!data) return null;

  if (Array.isArray(data)) {
    return {
      data,
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: data.length || 25,
        total: data.length,
        from: data.length ? 1 : 0,
        to: data.length,
      },
      links: { first: null, last: null, prev: null, next: null },
    };
  }

  if (data.meta) return data as PaginatedData<T>;

  return {
    data: data.data ?? [],
    meta: {
      current_page: data.current_page ?? 1,
      last_page: data.last_page ?? 1,
      per_page: data.per_page ?? 25,
      total: data.total ?? data.data?.length ?? 0,
      from: data.from ?? (data.data?.length ? 1 : 0),
      to: data.to ?? data.data?.length ?? 0,
    },
    links: {
      first: data.first_page_url ?? null,
      last: data.last_page_url ?? null,
      prev: data.prev_page_url ?? null,
      next: data.next_page_url ?? null,
    },
  };
}

function pageNumbers(current: number, last: number): number[] {
  const start = Math.max(1, current - 2);
  const end = Math.min(last, current + 2);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function DataTable<T>({
  data,
  columns,
  filters = [],
  onFilter = () => {},
  initialFilters = {},
  loading = false,
  skeletonRows = 10,
  rowKey,
  actions,
  selectable = false,
  onSelectionChange,
  emptyMessage = 'No records found.',
  perPageOptions = [10, 25, 50, 100],
  className,
}: DataTableProps<T>) {
  const [filterState, setFilterState] = useState<Record<string, any>>(initialFilters);
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tableData = useMemo(() => normalizeData<T>(data), [data]);
  const isLoading = loading || tableData === null;
  const visibleColumns = columns.length;
  const totalColumns = visibleColumns + (selectable ? 1 : 0) + (actions ? 1 : 0);

  useEffect(() => {
    onSelectionChange?.(selectedIds);
  }, [onSelectionChange, selectedIds]);

  useEffect(() => {
    setFilterState(initialFilters);
  }, [initialFilters]);

  const updateFilter = (key: string, value: any, debounce = false) => {
    const next = { ...filterState, [key]: value, page: key === 'page' ? value : 1 };
    setFilterState(next);

    if (debounce) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onFilter(next), 400);
      return;
    }

    onFilter(next);
  };

  const clearFilters = () => {
    const cleared = filters.reduce((values, filter) => ({ ...values, [filter.key]: '' }), { page: 1 } as Record<string, any>);
    setFilterState(cleared);
    onFilter(cleared);
  };

  const getRowId = (row: T, index: number) => rowKey ? (row as any)[rowKey] : index;
  const rows = tableData?.data ?? [];
  const meta = tableData?.meta;
  const allVisibleSelected = rows.length > 0 && rows.every((row, index) => selectedIds.includes(getRowId(row, index)));

  return (
    <div className={cn("bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col", className)}>
      {filters.length > 0 && (
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-center bg-gray-50/30">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {filters.map(filter => (
              <div key={filter.key} className="w-full sm:w-56">
                {filter.type === 'select' ? (
                  <select
                    value={filterState[filter.key] ?? ''}
                    onChange={event => updateFilter(filter.key, event.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  >
                    <option value="">{filter.placeholder || filter.label}</option>
                    {filter.options?.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                ) : (
                  <input
                    type={filter.type === 'date' ? 'date' : 'text'}
                    value={filterState[filter.key] ?? ''}
                    onChange={event => updateFilter(filter.key, event.target.value, filter.type === 'text')}
                    placeholder={filter.placeholder || filter.label}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  />
                )}
              </div>
            ))}
          </div>
          <Button variant="outline" className="flex items-center gap-2 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 w-full sm:w-auto" onClick={clearFilters}>
            <X className="w-4 h-4" /> Clear filters
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100 uppercase">
              {selectable && (
                <th className="px-4 py-3 text-[11px] font-bold text-gray-500 tracking-wider w-10">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={event => setSelectedIds(event.target.checked ? rows.map(getRowId) : [])}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th
                  key={`${String(column.key)}-${index}`}
                  style={{ width: column.width }}
                  className={cn("px-4 py-3 text-[11px] font-bold text-gray-500 tracking-wider whitespace-nowrap", column.className)}
                  onClick={() => column.sortable && updateFilter('sort', String(column.key))}
                >
                  {column.label || column.header}
                  {column.sortable && <span className="ml-1 text-gray-300 normal-case">sort</span>}
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-[11px] font-bold text-gray-500 tracking-wider text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, index) => <SkeletonRow key={index} columns={totalColumns} />)
            ) : rows.length > 0 ? (
              rows.map((row, rowIndex) => {
                const id = getRowId(row, rowIndex);
                return (
                  <tr key={id} className="hover:bg-gray-50/50 transition-colors group">
                    {selectable && (
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(id)}
                          onChange={event => setSelectedIds(current => event.target.checked ? [...current, id] : current.filter(value => value !== id))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    {columns.map((column, colIndex) => (
                      <td key={`${String(column.key)}-${colIndex}`} className={cn("px-4 py-3.5 text-sm text-gray-700 whitespace-nowrap", column.className)}>
                        {column.render
                          ? column.render(row, rowIndex)
                          : column.cell
                            ? column.cell(row)
                            : <span className="font-medium">{String((row as any)[column.accessorKey || column.key] ?? '')}</span>}
                      </td>
                    ))}
                    {actions && <td className="px-4 py-3.5 text-right">{actions(row)}</td>}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={totalColumns} className="px-4 py-12 text-center text-gray-500">
                  <p className="text-sm font-medium text-gray-900">{emptyMessage}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {meta && (
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50/30 text-sm">
          <span className="text-gray-500">Showing {meta.from || 0} to {meta.to || 0} of {meta.total} results</span>
          <div className="flex items-center gap-2">
            <select
              value={meta.per_page}
              onChange={event => updateFilter('per_page', Number(event.target.value))}
              className="h-8 rounded-lg border border-gray-200 bg-white px-2 text-xs font-medium text-gray-600"
            >
              {perPageOptions.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="px-2 h-8 rounded-lg text-gray-500" disabled={meta.current_page <= 1} onClick={() => updateFilter('page', 1)}><ChevronsLeft className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm" className="px-2 h-8 rounded-lg text-gray-500" disabled={meta.current_page <= 1} onClick={() => updateFilter('page', meta.current_page - 1)}><ChevronLeft className="w-4 h-4" /></Button>
              {pageNumbers(meta.current_page, meta.last_page).map(page => (
                <Button
                  key={page}
                  variant={page === meta.current_page ? 'default' : 'outline'}
                  size="sm"
                  className={cn("px-3 h-8 rounded-lg border-gray-200", page === meta.current_page && "bg-teal-600 hover:bg-teal-700 text-white")}
                  onClick={() => updateFilter('page', page)}
                >
                  {page}
                </Button>
              ))}
              <Button variant="ghost" size="sm" className="px-2 h-8 rounded-lg text-gray-500" disabled={meta.current_page >= meta.last_page} onClick={() => updateFilter('page', meta.current_page + 1)}><ChevronRight className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm" className="px-2 h-8 rounded-lg text-gray-500" disabled={meta.current_page >= meta.last_page} onClick={() => updateFilter('page', meta.last_page)}><ChevronsRight className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
