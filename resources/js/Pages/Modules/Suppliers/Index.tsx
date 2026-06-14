import DatabaseTablePage from '../DatabaseTablePage';

export default function Page() {
  return <DatabaseTablePage config={{
    title: 'Suppliers',
    description: 'Supplier accounts from the database',
    prop: 'suppliers',
    basePath: '/people/suppliers',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'company_name', label: 'Company' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status' },
      { key: 'total_due', label: 'Due', className: 'text-right', render: row => Number(row.total_due ?? 0).toFixed(2) },
    ],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    createLabel: 'Add Supplier',
  }} />;
}
