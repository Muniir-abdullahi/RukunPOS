import DatabaseTablePage from '../Modules/DatabaseTablePage';

export default function Page() {
  return <DatabaseTablePage config={{
    title: 'Sales',
    description: 'Completed POS sales',
    prop: 'sales',
    basePath: '/sales',
    columns: [
      { key: 'reference', label: 'Reference' },
      { key: 'customer', label: 'Customer' },
      { key: 'date', label: 'Date' },
      { key: 'items_count', label: 'Items', className: 'text-center' },
      { key: 'payment_status', label: 'Payment' },
      { key: 'grand_total', label: 'Total', className: 'text-right', render: row => Number(row.grand_total ?? 0).toFixed(2) },
      { key: 'cashier', label: 'Cashier' },
    ],
    canDelete: true,
  }} />;
}
