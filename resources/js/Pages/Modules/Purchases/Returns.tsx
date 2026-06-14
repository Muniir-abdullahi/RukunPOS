import DatabaseTablePage from '../DatabaseTablePage';

export default function Page() {
  return <DatabaseTablePage config={{
    title: 'Purchase Returns',
    description: 'Returned supplier stock',
    prop: 'returns',
    basePath: '/purchases/returns',
    columns: [
      { key: 'reference', label: 'Reference' },
      { key: 'supplier', label: 'Supplier' },
      { key: 'date', label: 'Date' },
      { key: 'grand_total', label: 'Total', className: 'text-right', render: row => Number(row.grand_total ?? 0).toFixed(2) },
    ],
    canCreate: true,
    canDelete: true,
    createLabel: 'New Return',
  }} />;
}
