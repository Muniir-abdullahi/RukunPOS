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
    editingProp: 'editingCustomer',
    formDefaults: { status: 'active', opening_balance: 0, credit_limit: 0 },
    formFields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'phone', label: 'Phone', required: true },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'company', label: 'Company' },
      { key: 'customer_group_id', label: 'Customer Group', type: 'select', optionsProp: 'customerGroups' },
      { key: 'credit_limit', label: 'Credit Limit', type: 'number' },
      { key: 'opening_balance', label: 'Opening Balance', type: 'number' },
      { key: 'address', label: 'Address', type: 'textarea' },
      { key: 'city', label: 'City' },
      { key: 'country', label: 'Country' },
      { key: 'status', label: 'Status', type: 'select', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] },
    ],
  }} />;
}
