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
    formDefaults: { expense_date: new Date().toISOString().slice(0, 10), amount: 0 },
    formFields: [
      { key: 'expense_category_id', label: 'Expense Category', type: 'select', required: true, optionsProp: 'expenseCategories' },
      { key: 'account_id', label: 'Account', type: 'select', required: true, optionsProp: 'accounts' },
      { key: 'expense_date', label: 'Expense Date', type: 'date', required: true },
      { key: 'amount', label: 'Amount', type: 'number', required: true },
      { key: 'reference', label: 'Reference' },
      { key: 'note', label: 'Note', type: 'textarea' },
    ],
  }} />;
}
