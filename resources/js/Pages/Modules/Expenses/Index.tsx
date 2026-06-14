import DatabaseTablePage from '../DatabaseTablePage';

export default function Page() {
  return <DatabaseTablePage config={{
    title: 'Expenses',
    description: 'Business expenses paid from accounts',
    prop: 'expenses',
    basePath: '/expenses',
    columns: [
      { key: 'reference', label: 'Reference' },
      { key: 'category', label: 'Category' },
      { key: 'account', label: 'Account' },
      { key: 'expense_date', label: 'Date' },
      { key: 'amount', label: 'Amount', className: 'text-right', render: row => Number(row.amount ?? 0).toFixed(2) },
      { key: 'note', label: 'Note' },
    ],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    createLabel: 'Add Expense',
  }} />;
}
