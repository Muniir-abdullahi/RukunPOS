import DatabaseTablePage from '../DatabaseTablePage';

export default function Page() {
  return <DatabaseTablePage config={{
    title: 'Suppliers',
    description: 'Supplier accounts from the database',
    prop: 'suppliers',
    basePath: '/people/suppliers',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'company', label: 'Company' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'status', label: 'Status' },
      { key: 'total_due', label: 'Due', className: 'text-right', render: row => Number(row.total_due ?? 0).toFixed(2) },
    ],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    createLabel: 'Add Supplier',
    editingProp: 'editingSupplier',
    formDefaults: { status: 'active', opening_balance: 0 },
    formFields: [
      { key: 'name', label: 'Name', required: true },
      { key: 'company', label: 'Company', required: true },
      { key: 'phone', label: 'Phone', required: true },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'vat_number', label: 'VAT Number' },
      { key: 'opening_balance', label: 'Opening Balance', type: 'number' },
      { key: 'address', label: 'Address', type: 'textarea' },
      { key: 'city', label: 'City' },
      { key: 'country', label: 'Country' },
      { key: 'bank_details', label: 'Bank Details', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'select', options: [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }] },
    ],
  }} />;
}
