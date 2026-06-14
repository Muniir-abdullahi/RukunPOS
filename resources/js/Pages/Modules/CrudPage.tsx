import React from 'react';
import { Deferred, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { GenericCrudModule, type CrudConfig } from '@/Components/crud/GenericCrud';
import * as ModuleConfigs from './ModuleDefinitions';

const configs: Record<string, CrudConfig> = {
  customers: ModuleConfigs.CustomersConfig,
  suppliers: ModuleConfigs.SuppliersConfig,
  users: ModuleConfigs.UsersConfig,
  purchases: ModuleConfigs.PurchasesConfig,
  purchaseReturns: ModuleConfigs.PurchaseReturnsConfig,
  sales: ModuleConfigs.SalesConfig,
  saleReturns: ModuleConfigs.SaleReturnsConfig,
  quotations: ModuleConfigs.QuotationsConfig,
  expenses: ModuleConfigs.ExpensesConfig,
  expenseCategories: ModuleConfigs.ExpenseCategoriesConfig,
  accounts: ModuleConfigs.AccountsConfig,
  stockTransfers: ModuleConfigs.StockTransfersConfig,
  roles: ModuleConfigs.RolesConfig,
  warehouses: ModuleConfigs.WarehousesConfig,
  auditLogs: ModuleConfigs.AuditLogsConfig,
};

function Page() {
  const { props } = usePage<{ module: string; action?: 'list' | 'add' | 'view' | 'edit'; id?: string; records?: any; filters?: Record<string, any>; roles?: string[] }>();
  const baseConfig = configs[props.module];
  const config = baseConfig ? {
    ...baseConfig,
    mockData: props.records?.data ?? baseConfig.mockData,
    formFields: baseConfig.formFields.map(field => {
      if (field.key === 'role' && props.roles) {
        return { ...field, options: props.roles.map(role => ({ value: role, label: role })) };
      }

      return field;
    }),
  } : undefined;

  if (!config) return <div className="p-8 text-gray-500">Module not found.</div>;

  const module = (
    <GenericCrudModule
      config={config}
      action={props.action}
      id={props.id}
      tableData={props.records}
      filterDefaults={props.filters}
    />
  );

  if ((props.action ?? 'list') !== 'list' || !props.filters) return module;

  return (
    <Deferred
      data="records"
      fallback={<GenericCrudModule config={config} action={props.action} id={props.id} tableData={null} filterDefaults={props.filters} />}
    >
      {module}
    </Deferred>
  );
}

Page.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Page;
