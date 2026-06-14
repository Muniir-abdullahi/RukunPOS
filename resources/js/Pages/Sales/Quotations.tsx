import DatabaseTablePage from '../Modules/DatabaseTablePage';

export default function Page() {
  return <DatabaseTablePage config={{
    title: 'Quotations',
    description: 'Customer quotations',
    prop: 'quotations',
    basePath: '/quotations',
    columns: [
      { key: 'reference', label: 'Reference' },
      { key: 'customer', label: 'Customer' },
      { key: 'date', label: 'Date' },
      { key: 'status', label: 'Status' },
      { key: 'grand_total', label: 'Total', className: 'text-right', render: row => Number(row.grand_total ?? 0).toFixed(2) },
    ],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    createLabel: 'New Quotation',
  }} />;
}
