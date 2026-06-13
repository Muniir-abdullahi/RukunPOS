import React from 'react';

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

// Simple MVP DataTable
export function DataTable<T>({ data, columns }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, i) => (
              <th 
                key={i}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {col.cell 
                    ? col.cell(row) 
                    : (col.accessorKey ? String(row[col.accessorKey]) : null)}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-sm text-gray-500 italic">
                No items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
