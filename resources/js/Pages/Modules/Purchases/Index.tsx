import DatabaseTablePage from '../DatabaseTablePage';

export default function Page() {
  return <DatabaseTablePage config={{
    title: 'Purchases',
    description: 'Purchase orders and supplier invoices',
    prop: 'purchases',
    basePath: '/purchases',
    columns: [
      { key: 'reference', label: 'Reference' },
      { key: 'supplier', label: 'Supplier' },
      { key: 'date', label: 'Date' },
      { key: 'status', label: 'Status' },
      { key: 'payment_status', label: 'Payment' },
      { key: 'grand_total', label: 'Total', className: 'text-right', render: row => Number(row.grand_total ?? 0).toFixed(2) },
      { key: 'due_total', label: 'Due', className: 'text-right', render: row => Number(row.due_total ?? 0).toFixed(2) },
    ],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    createLabel: 'New Purchase',
  }} />;
}
