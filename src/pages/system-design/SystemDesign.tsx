import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export function SystemDesign() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="System Design Document" 
        description="Architecture, scope, and foundation for the POS MVP."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Product Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm">
              <strong className="text-gray-900">What it does:</strong> A simple, modern Point of Sale (POS), inventory, and sales management system.
            </p>
            <p className="text-gray-600 text-sm">
              <strong className="text-gray-900">Target Users:</strong> Small and medium retail businesses looking for an easy-to-use checkout and stock-keeping solution.
            </p>
            <p className="text-gray-600 text-sm">
              <strong className="text-gray-900">Key Business Problems Solved:</strong> Centralized product tracking, quick frictionless checkout, fast access to customer data, and straightforward business insights.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. MVP Scope (Included)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Dashboard (Metrics & Charts)</li>
              <li>People (Customers, Suppliers, Users)</li>
              <li>Products (Categories, Brands, Units, List, Barcode)</li>
              <li>Purchases (List, Add, Return)</li>
              <li>Sales (POS Interface, List, Returns)</li>
              <li>Quotations (List, Convert to Sale)</li>
              <li>Expenses (Categories, Tracking)</li>
              <li>Accounting (Accounts, Transfers, Statements)</li>
              <li>Reports (Sales, Purchase, Stock, Profit/Loss)</li>
              <li>Settings (User Roles, Notifications)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Excluded from MVP</CardTitle>
          </CardHeader>
          <CardContent>
             <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>HRM, Payroll, Attendance, Holidays, Overtime</li>
              <li>Coupons, Gift cards, Installments</li>
              <li>Courier & Delivery management</li>
              <li>Advanced warehouse & expiry tracking</li>
              <li>Daily sale objectives & Multi-branch logic</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Main User Roles</CardTitle>
          </CardHeader>
          <CardContent>
             <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li><strong className="text-gray-900">Owner/Admin:</strong> Full access to all modules and settings.</li>
              <li><strong className="text-gray-900">Cashier:</strong> Access to POS, Sales list, and daily cash reports.</li>
              <li><strong className="text-gray-900">Inventory Manager:</strong> Access to Products, Purchases, and Stock Reports.</li>
              <li><strong className="text-gray-900">Accountant:</strong> Access to Expenses, Accounting, and financial reports.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle>5. User Flows</CardTitle>
          </CardHeader>
          <CardContent>
             <ul className="list-decimal list-inside text-sm text-gray-600 space-y-1">
              <li><strong>Add Product:</strong> Define category/unit/brand &rarr; Enter details &rarr; Set price/cost.</li>
              <li><strong>Make POS Sale:</strong> Scan/Select items &rarr; Add Customer &rarr; Select Payment Method &rarr; Print Receipt.</li>
              <li><strong>Create Purchase:</strong> Select Supplier &rarr; Add Stock Items &rarr; Pay Supplier.</li>
              <li><strong>Convert Quotation:</strong> View Quotation &rarr; Click Convert &rarr; Generates Sale Record.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
             <CardTitle>6. Data Entities (Frontend Mocks)</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex flex-wrap gap-2">
              {['Customer','Supplier','User','Category','Brand','Unit','Product','Purchase','Sale','SaleReturn','SaleExchange','Quotation','Expense','Account','MoneyTransfer','ReportSummary'].map(entity => (
                <span key={entity} className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                  {entity}
                </span>
              ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
