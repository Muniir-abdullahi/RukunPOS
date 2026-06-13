<?php

use App\Http\Controllers\POS\DashboardController;
use App\Http\Controllers\POS\InventoryController;
use App\Http\Controllers\POS\ModulesController;
use App\Http\Controllers\POS\SalesController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('Landing/Index'))->name('home');
Route::get('/login', fn () => Inertia::render('Auth/Login'))->name('login');

Route::middleware(['web'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/system-design', fn () => Inertia::render('SystemDesign/Index'))->name('system-design');
    Route::get('/pos', [SalesController::class, 'pos'])->name('pos');

    Route::get('/products', [InventoryController::class, 'products'])->name('products.index');
    Route::get('/products/new', [InventoryController::class, 'productForm'])->name('products.create');
    Route::get('/products/barcode', [InventoryController::class, 'barcode'])->name('products.barcode');
    Route::get('/products/{id}/edit', [InventoryController::class, 'productForm'])->name('products.edit');
    Route::get('/products/{id}', [InventoryController::class, 'productShow'])->name('products.show');
    Route::get('/products/categories/{path?}', [InventoryController::class, 'taxonomy'])->where('path', '.*')->defaults('type', 'Category')->name('products.categories');
    Route::get('/products/brands/{path?}', [InventoryController::class, 'taxonomy'])->where('path', '.*')->defaults('type', 'Brand')->name('products.brands');
    Route::get('/products/units/{path?}', [InventoryController::class, 'taxonomy'])->where('path', '.*')->defaults('type', 'Unit')->name('products.units');

    Route::get('/reports/stock', [InventoryController::class, 'stockOverview'])->name('reports.stock');
    Route::get('/inventory/adjustments/{path?}', [InventoryController::class, 'stockAdjustments'])->where('path', '.*')->name('inventory.adjustments');
    Route::get('/inventory/transfers/{path?}', [ModulesController::class, 'crud'])->where('path', '.*')->defaults('config', 'StockTransfersConfig')->name('inventory.transfers');

    Route::get('/people/customers/{path?}', [ModulesController::class, 'crud'])->where('path', '.*')->defaults('config', 'CustomersConfig')->name('people.customers');
    Route::get('/people/suppliers/{path?}', [ModulesController::class, 'crud'])->where('path', '.*')->defaults('config', 'SuppliersConfig')->name('people.suppliers');
    Route::get('/people/users/{path?}', [ModulesController::class, 'crud'])->where('path', '.*')->defaults('config', 'UsersConfig')->name('people.users');
    Route::get('/purchases/return/{path?}', [ModulesController::class, 'crud'])->where('path', '.*')->defaults('config', 'PurchaseReturnsConfig')->name('purchases.return');
    Route::get('/purchases/{path?}', [ModulesController::class, 'crud'])->where('path', '.*')->defaults('config', 'PurchasesConfig')->name('purchases');
    Route::get('/sales/return/{path?}', [ModulesController::class, 'crud'])->where('path', '.*')->defaults('config', 'SaleReturnsConfig')->name('sales.return');
    Route::get('/sales/exchange', fn () => Inertia::render('Modules/Placeholder', ['title' => 'Exchange Portal (Placeholder)']))->name('sales.exchange');
    Route::get('/sales/{path?}', [ModulesController::class, 'crud'])->where('path', '.*')->defaults('config', 'SalesConfig')->name('sales');
    Route::get('/quotations/{path?}', [ModulesController::class, 'crud'])->where('path', '.*')->defaults('config', 'QuotationsConfig')->name('quotations');
    Route::get('/expenses/categories/{path?}', [ModulesController::class, 'crud'])->where('path', '.*')->defaults('config', 'ExpenseCategoriesConfig')->name('expenses.categories');
    Route::get('/expenses/{path?}', [ModulesController::class, 'crud'])->where('path', '.*')->defaults('config', 'ExpensesConfig')->name('expenses');
    Route::get('/accounting/transfer', fn () => Inertia::render('Modules/AccountingPage', ['view' => 'transfer']))->name('accounting.transfer');
    Route::get('/accounting/statement', fn () => Inertia::render('Modules/AccountingPage', ['view' => 'statement']))->name('accounting.statement');
    Route::get('/accounting/{path?}', [ModulesController::class, 'crud'])->where('path', '.*')->defaults('config', 'AccountsConfig')->name('accounting');
    Route::get('/reports/{report}', [ModulesController::class, 'report'])->whereIn('report', ['sales', 'purchases', 'products', 'profit-loss'])->name('reports.show');
    Route::get('/settings/roles/{path?}', [ModulesController::class, 'crud'])->where('path', '.*')->defaults('config', 'RolesConfig')->name('settings.roles');
    Route::get('/settings/warehouses/{path?}', [ModulesController::class, 'crud'])->where('path', '.*')->defaults('config', 'WarehousesConfig')->name('settings.warehouses');
    Route::get('/settings/audit-logs/{path?}', [ModulesController::class, 'crud'])->where('path', '.*')->defaults('config', 'AuditLogsConfig')->name('settings.audit-logs');
    Route::get('/settings/notifications', fn () => Inertia::render('Modules/Placeholder', ['title' => 'Notifications (Placeholder)']))->name('settings.notifications');
    Route::get('/settings', fn () => Inertia::render('Modules/SettingsPage'))->name('settings');
});
