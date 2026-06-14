import DatabaseTablePage from '../Modules/DatabaseTablePage';

export default function Page() {
  return <DatabaseTablePage config={{
    title: 'Sale Returns',
    description: 'Refunds and returned sold stock',
    prop: 'returns',
    basePath: '/sales/returns',
    columns: [
      { key: 'reference', label: 'Reference' },
      { key: 'customer', label: 'Customer' },
      { key: 'date', label: 'Date' },
      { key: 'refund_method', label: 'Refund' },
      { key: 'grand_total', label: 'Total', className: 'text-right', render: row => Number(row.grand_total ?? 0).toFixed(2) },
    ],
    canDelete: true,
  }} />;
}
