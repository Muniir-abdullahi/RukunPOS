<?php

namespace App\Http\Controllers\POS;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ModulesController
{
    public function show(string $module): Response
    {
        return Inertia::render('Modules/CrudPage', ['module' => $module]);
    }

    public function crud(Request $request): Response
    {
        $module = $this->moduleKey((string) $request->route('config'));
        [$action, $id] = $this->actionFromPath((string) $request->route('path', ''));

        return Inertia::render('Modules/CrudPage', [
            'module' => $module,
            'action' => $action,
            'id' => $id,
        ]);
    }

    public function report(string $report): Response
    {
        return Inertia::render('Modules/ReportPage', ['report' => $report]);
    }

    private function moduleKey(string $config): string
    {
        return [
            'CustomersConfig' => 'customers',
            'SuppliersConfig' => 'suppliers',
            'UsersConfig' => 'users',
            'PurchasesConfig' => 'purchases',
            'PurchaseReturnsConfig' => 'purchaseReturns',
            'SalesConfig' => 'sales',
            'SaleReturnsConfig' => 'saleReturns',
            'QuotationsConfig' => 'quotations',
            'ExpensesConfig' => 'expenses',
            'ExpenseCategoriesConfig' => 'expenseCategories',
            'AccountsConfig' => 'accounts',
            'StockTransfersConfig' => 'stockTransfers',
            'RolesConfig' => 'roles',
            'WarehousesConfig' => 'warehouses',
            'AuditLogsConfig' => 'auditLogs',
        ][$config] ?? $config;
    }

    private function actionFromPath(string $path): array
    {
        $path = trim($path, '/');

        if ($path === '') {
            return ['list', null];
        }

        if ($path === 'add') {
            return ['add', null];
        }

        if (str_ends_with($path, '/edit')) {
            return ['edit', str_replace('/edit', '', $path)];
        }

        return ['view', $path];
    }
}
