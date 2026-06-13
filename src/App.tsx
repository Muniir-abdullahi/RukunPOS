/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { POSLayout } from './components/layout/POSLayout';
import { LandingPage } from './pages/landing/LandingPage';
import { SystemDesign } from './pages/system-design/SystemDesign';
import { Dashboard } from './pages/dashboard/Dashboard';
import { POS } from './pages/sales/POS';

import { GenericCrudModule } from './components/crud/GenericCrud';
import * as ModuleConfigs from './pages/modules/ModuleDefinitions';
import { SalesReport, PurchaseReport, ProductReport, StockReport, ProfitLossReport } from './pages/modules/Reports';
import { MoneyTransfer, AccountStatement } from './pages/modules/Accounting';
import { Settings } from './pages/modules/Settings';

import { ProductList } from './pages/inventory/ProductList';
import { ProductForm } from './pages/inventory/ProductForm';
import { ProductDetail } from './pages/inventory/ProductDetail';
import { TaxonomyModule } from './pages/inventory/Taxonomies';
import { StockOverview } from './pages/inventory/StockOverview';
import { StockAdjustments } from './pages/inventory/StockAdjustments';
import { BarcodePrint } from './pages/inventory/BarcodePrint';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
        
        {/* POS Dedicated Layout */}
        <Route element={<POSLayout />}>
          <Route path="/pos" element={<POS />} />
        </Route>

        {/* Admin Dashboard */}
        <Route element={<AdminLayout />}>
          <Route path="/system-design" element={<SystemDesign />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* People Modules */}
          <Route path="/people/customers/*" element={<GenericCrudModule config={ModuleConfigs.CustomersConfig} />} />
          <Route path="/people/suppliers/*" element={<GenericCrudModule config={ModuleConfigs.SuppliersConfig} />} />
          <Route path="/people/users/*" element={<GenericCrudModule config={ModuleConfigs.UsersConfig} />} />
          
          {/* Product Modules */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/:id/edit" element={<ProductForm />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/products/categories/*" element={<TaxonomyModule type="Category" />} />
          <Route path="/products/brands/*" element={<TaxonomyModule type="Brand" />} />
          <Route path="/products/units/*" element={<TaxonomyModule type="Unit" />} />
          <Route path="/products/barcode" element={<BarcodePrint />} />
          
          {/* Purchase Modules */}
          <Route path="/purchases/*" element={<GenericCrudModule config={ModuleConfigs.PurchasesConfig} />} />
          <Route path="/purchases/return/*" element={<GenericCrudModule config={ModuleConfigs.PurchaseReturnsConfig} />} />
          
          {/* Sales Modules */}
          <Route path="/sales/*" element={<GenericCrudModule config={ModuleConfigs.SalesConfig} />} />
          <Route path="/sales/return/*" element={<GenericCrudModule config={ModuleConfigs.SaleReturnsConfig} />} />
          <Route path="/sales/exchange" element={
             <div className="p-8"><h1>Exchange Portal (Placeholder)</h1></div>
          } />
          
          {/* Quotation Modules */}
          <Route path="/quotations/*" element={<GenericCrudModule config={ModuleConfigs.QuotationsConfig} />} />
          
          {/* Expense Modules */}
          <Route path="/expenses/*" element={<GenericCrudModule config={ModuleConfigs.ExpensesConfig} />} />
          <Route path="/expenses/categories/*" element={<GenericCrudModule config={ModuleConfigs.ExpenseCategoriesConfig} />} />
          
          {/* Accounting Modules */}
          <Route path="/accounting/*" element={<GenericCrudModule config={ModuleConfigs.AccountsConfig} />} />
          <Route path="/accounting/transfer" element={<MoneyTransfer />} />
          <Route path="/accounting/statement" element={<AccountStatement />} />

          {/* Report Modules */}
          <Route path="/reports/sales" element={<SalesReport />} />
          <Route path="/reports/purchases" element={<PurchaseReport />} />
          <Route path="/reports/products" element={<ProductReport />} />
          <Route path="/reports/profit-loss" element={<ProfitLossReport />} />

          {/* Inventory Modules */}
          <Route path="/inventory/transfers/*" element={<GenericCrudModule config={ModuleConfigs.StockTransfersConfig} />} />
          <Route path="/inventory/adjustments/*" element={<StockAdjustments />} />
          <Route path="/reports/stock" element={<StockOverview />} />
          
          {/* Settings Modules */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/roles/*" element={<GenericCrudModule config={ModuleConfigs.RolesConfig} />} />
          <Route path="/settings/warehouses/*" element={<GenericCrudModule config={ModuleConfigs.WarehousesConfig} />} />
          <Route path="/settings/audit-logs/*" element={<GenericCrudModule config={ModuleConfigs.AuditLogsConfig} />} />
          <Route path="/settings/notifications" element={<div className="p-8"><h1>Notifications (Placeholder)</h1></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
