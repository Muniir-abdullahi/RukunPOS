import React from 'react';
import { usePage } from '@inertiajs/react';
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
  const { props } = usePage<{ module: string; action?: 'list' | 'add' | 'view' | 'edit'; id?: string }>();
  const config = configs[props.module];
  if (!config) return <div className="p-8 text-gray-500">Module not found.</div>;
  return <GenericCrudModule config={config} action={props.action} id={props.id} />;
}

Page.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Page;
