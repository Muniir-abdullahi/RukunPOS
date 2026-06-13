<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Customer;
use App\Models\CustomerGroup;
use App\Models\ExpenseCategory;
use App\Models\Product;
use App\Models\ProductStock;
use App\Models\TaxRate;
use App\Models\Unit;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = collect([
            'dashboard.view',
            'pos.access',
            'products.view',
            'products.create',
            'products.update',
            'products.delete',
            'inventory.adjust',
            'inventory.transfer',
            'customers.manage',
            'suppliers.manage',
            'users.manage',
            'purchases.manage',
            'sales.manage',
            'sales.return',
            'quotations.manage',
            'expenses.manage',
            'accounting.manage',
            'reports.view',
            'settings.manage',
            'audit_logs.view',
        ])->map(fn (string $name) => Permission::firstOrCreate([
            'name' => $name,
            'guard_name' => 'web',
        ]));

        $roles = [
            'Admin' => $permissions->pluck('name')->all(),
            'Cashier' => ['dashboard.view', 'pos.access', 'sales.manage', 'sales.return'],
            'Inventory Manager' => ['dashboard.view', 'products.view', 'products.create', 'products.update', 'inventory.adjust', 'inventory.transfer', 'purchases.manage', 'reports.view'],
            'Accountant' => ['dashboard.view', 'expenses.manage', 'accounting.manage', 'reports.view'],
            'Manager' => ['dashboard.view', 'products.view', 'customers.manage', 'suppliers.manage', 'purchases.manage', 'sales.manage', 'reports.view'],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web'])
                ->syncPermissions($rolePermissions);
        }

        $admin = User::updateOrCreate(
            ['email' => 'admin@salelite.com'],
            [
                'name' => 'Admin User',
                'phone' => '+252610000000',
                'status' => 'active',
                'password' => Hash::make('password'),
            ],
        );
        $admin->assignRole('Admin');

        $regular = CustomerGroup::firstOrCreate(['name' => 'Regular'], ['status' => 'active']);
        CustomerGroup::firstOrCreate(['name' => 'VIP'], ['status' => 'active']);

        Customer::firstOrCreate(
            ['name' => 'Walk-in Customer'],
            ['customer_group_id' => $regular->id, 'status' => 'active'],
        );

        $mainWarehouse = Warehouse::firstOrCreate(
            ['name' => 'Main Warehouse'],
            ['phone' => '+252610000001', 'email' => 'main@salelite.test', 'city' => 'Mogadishu', 'status' => 'active'],
        );
        Warehouse::firstOrCreate(['name' => 'Store Front'], ['city' => 'Mogadishu', 'status' => 'active']);

        $piece = Unit::firstOrCreate(['code' => 'pc'], ['name' => 'Piece', 'short_name' => 'pcs', 'status' => 'active']);
        Unit::firstOrCreate(['code' => 'kg'], ['name' => 'Kilogram', 'short_name' => 'kg', 'status' => 'active']);
        Unit::firstOrCreate(['code' => 'l'], ['name' => 'Liter', 'short_name' => 'L', 'status' => 'active']);

        $electronics = Category::firstOrCreate(['code' => 'ELEC'], ['name' => 'Electronics', 'status' => 'active']);
        Category::firstOrCreate(['code' => 'DRN'], ['name' => 'Drinks', 'status' => 'active']);
        Category::firstOrCreate(['code' => 'SNK'], ['name' => 'Snacks', 'status' => 'active']);
        Category::firstOrCreate(['code' => 'GRO'], ['name' => 'Grocery', 'status' => 'active']);
        Category::firstOrCreate(['code' => 'PHA'], ['name' => 'Pharmacy', 'status' => 'active']);

        $sony = Brand::firstOrCreate(['name' => 'Sony'], ['status' => 'active']);
        Brand::firstOrCreate(['name' => 'Coca Cola'], ['status' => 'active']);

        $noTax = TaxRate::firstOrCreate(['name' => 'No Tax'], ['rate' => 0, 'status' => 'active']);
        TaxRate::firstOrCreate(['name' => 'VAT 10%'], ['rate' => 10, 'status' => 'active']);

        Account::firstOrCreate(['account_no' => 'AC-001'], ['name' => 'Cash', 'type' => 'cash', 'opening_balance' => 5000, 'current_balance' => 5000]);
        Account::firstOrCreate(['account_no' => 'AC-002'], ['name' => 'Bank Account', 'type' => 'bank', 'opening_balance' => 15400.50, 'current_balance' => 15400.50]);
        Account::firstOrCreate(['account_no' => 'AC-003'], ['name' => 'EVC Plus', 'type' => 'mobile_money', 'opening_balance' => 0, 'current_balance' => 0]);

        ExpenseCategory::firstOrCreate(['name' => 'Rent'], ['description' => 'Office or store rent', 'status' => 'active']);
        ExpenseCategory::firstOrCreate(['name' => 'Utilities'], ['description' => 'Power, water, internet', 'status' => 'active']);

        $product = Product::firstOrCreate(
            ['sku' => 'SNY-TV-55'],
            [
                'category_id' => $electronics->id,
                'brand_id' => $sony->id,
                'unit_id' => $piece->id,
                'sale_unit_id' => $piece->id,
                'purchase_unit_id' => $piece->id,
                'tax_rate_id' => $noTax->id,
                'name' => 'Sony Bravia 55" 4K',
                'barcode' => '8493021948',
                'cost_price' => 400,
                'selling_price' => 599.99,
                'alert_quantity' => 5,
                'status' => 'active',
            ],
        );

        ProductStock::firstOrCreate(
            ['product_id' => $product->id, 'warehouse_id' => $mainWarehouse->id],
            ['quantity' => 12, 'reserved_quantity' => 0],
        );
    }
}
