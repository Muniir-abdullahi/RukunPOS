import DatabaseTablePage from '../DatabaseTablePage';

export default function Page() {
  return <DatabaseTablePage config={{
    title: 'Notifications',
    description: 'User notifications',
    prop: 'notifications',
    basePath: '/notifications',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'body', label: 'Message' },
      { key: 'type', label: 'Type' },
      { key: 'read_at', label: 'Read At' },
      { key: 'created_at', label: 'Date' },
    ],
  }} />;
}
