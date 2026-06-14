import DatabaseTablePage from '../DatabaseTablePage';

export default function Page() {
  return <DatabaseTablePage config={{
    title: 'Accounts',
    description: 'Cash, bank, and payment accounts',
    prop: 'accounts',
    basePath: '/accounting/accounts',
    columns: [
      { key: 'account_no', label: 'Account No' },
      { key: 'name', label: 'Name' },
      { key: 'type', label: 'Type' },
      { key: 'current_balance', label: 'Balance', className: 'text-right', render: row => Number(row.current_balance ?? 0).toFixed(2) },
      { key: 'status', label: 'Status' },
    ],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    createLabel: 'Add Account',
  }} />;
}
