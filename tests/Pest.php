<?php

use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind different classes or traits.
|
*/

pest()->extend(TestCase::class)
    ->in('Feature', 'Unit');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

function ensureTestPermissions(): array
{
    $permissions = [
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
    ];

    foreach ($permissions as $permission) {
        Permission::findOrCreate($permission, 'web');
    }

    app(PermissionRegistrar::class)->forgetCachedPermissions();

    return $permissions;
}

function actingAsAdmin(): User
{
    $role = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
    $role->syncPermissions(ensureTestPermissions());
    $user = User::factory()->create();
    $user->assignRole($role);

    return login($user);
}

function actingAsCashier(): User
{
    $role = Role::firstOrCreate(['name' => 'Cashier', 'guard_name' => 'web']);
    $role->syncPermissions(['dashboard.view', 'pos.access', 'sales.manage', 'sales.return']);
    $user = User::factory()->create();
    $user->assignRole($role);

    return login($user);
}

function login(User $user): User
{
    test()->actingAs($user);

    return $user;
}
