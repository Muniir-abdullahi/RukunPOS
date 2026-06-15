import DatabaseTablePage from '../DatabaseTablePage';

export default function Page() {
  return <DatabaseTablePage config={{
    title: 'Money Transfers',
    description: 'Internal transfers between accounts',
    prop: 'transfers',
    basePath: '/accounting/transfers',
    columns: [
      { key: 'reference', label: 'Reference' },
      { key: 'from_account', label: 'From' },
      { key: 'to_account', label: 'To' },
      { key: 'transfer_date', label: 'Date' },
      { key: 'amount', label: 'Amount', className: 'text-right', render: row => Number(row.amount ?? 0).toFixed(2) },
      { key: 'note', label: 'Note' },
    ],
    canCreate: true,
    canDelete: true,
    createLabel: 'New Transfer',
    formDefaults: { transfer_date: new Date().toISOString().slice(0, 10), amount: 0 },
    formFields: [
      { key: 'from_account_id', label: 'From Account', type: 'select', required: true, optionsProp: 'accounts' },
      { key: 'to_account_id', label: 'To Account', type: 'select', required: true, optionsProp: 'accounts' },
      { key: 'transfer_date', label: 'Transfer Date', type: 'date', required: true },
      { key: 'amount', label: 'Amount', type: 'number', required: true },
      { key: 'note', label: 'Note', type: 'textarea' },
    ],
  }} />;
}
