import DatabaseTablePage from '../DatabaseTablePage';

export default function Page() {
  return <DatabaseTablePage config={{
    title: 'Customers',
    description: 'Customer accounts from the database',
    prop: 'customers',
    basePath: '/people/customers',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'group', label: 'Group' },
      { key: 'status', label: 'Status' },
      { key: 'total_due', label: 'Due', className: 'text-right', render: row => Number(row.total_due ?? 0).toFixed(2) },
    ],
    filters: [
      { key: 'search', label: 'Search', type: 'text', placeholder: 'Search customers...' },
      { key: 'status', label: 'Status', type: 'select', options: [{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }] },
    ],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    createLabel: 'Add Customer',
  }} />;
}
