import DatabaseTablePage from '../DatabaseTablePage';

export default function Page() {
  return <DatabaseTablePage config={{
    title: 'Expense Categories',
    description: 'Expense classification records',
    prop: 'records',
    basePath: '/expenses/categories',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'description', label: 'Description' },
      { key: 'status', label: 'Status' },
    ],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    createLabel: 'Add Category',
  }} />;
}
