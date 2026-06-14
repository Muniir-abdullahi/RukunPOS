import DatabaseTablePage from '../DatabaseTablePage';

export default function Page() {
  return <DatabaseTablePage config={{
    title: 'Audit Logs',
    description: 'System activity history',
    prop: 'logs',
    basePath: '/audit-logs',
    columns: [
      { key: 'date', label: 'Date' },
      { key: 'user', label: 'User' },
      { key: 'action', label: 'Action' },
      { key: 'module', label: 'Module' },
      { key: 'description', label: 'Description' },
    ],
    canDelete: false,
  }} />;
}
