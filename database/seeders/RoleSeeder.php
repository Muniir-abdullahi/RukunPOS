<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
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
        ])->map(fn (string $name) => Permission::updateOrCreate(
            ['name' => $name, 'guard_name' => 'web'],
            ['name' => $name, 'guard_name' => 'web'],
        ));

        $roles = [
            'Admin' => $permissions->pluck('name')->all(),
            'Cashier' => ['dashboard.view', 'pos.access', 'sales.manage', 'sales.return'],
            'Inventory Manager' => ['dashboard.view', 'products.view', 'products.create', 'products.update', 'inventory.adjust', 'inventory.transfer', 'purchases.manage', 'reports.view'],
            'Accountant' => ['dashboard.view', 'expenses.manage', 'accounting.manage', 'reports.view'],
            'Manager' => ['dashboard.view', 'products.view', 'customers.manage', 'suppliers.manage', 'purchases.manage', 'sales.manage', 'reports.view'],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            Role::updateOrCreate(['name' => $roleName, 'guard_name' => 'web'], ['name' => $roleName, 'guard_name' => 'web'])
                ->syncPermissions($rolePermissions);
        }
    }
}
