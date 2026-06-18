<?php

use Spatie\Permission\Models\Role;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\patch;
use function Pest\Laravel\post;

it('guest is redirected to login', function () {
    get(route('settings.roles'))->assertRedirect(route('login'));
});

it('index displays roles', function () {
    actingAsAdmin();
    Role::create(['name' => 'Manager Test', 'guard_name' => 'web']);

    get(route('settings.roles'))->assertOk();
});

it('store creates a role', function () {
    actingAsAdmin();

    post(route('settings.roles.store'), [
        'name' => 'Supervisor',
        'permissions' => [],
    ])->assertRedirect();

    assertDatabaseHas('roles', ['name' => 'Supervisor']);
});

it('update modifies role', function () {
    actingAsAdmin();
    $role = Role::create(['name' => 'Old Role', 'guard_name' => 'web']);

    patch(route('settings.roles.update', $role), [
        'name' => 'Updated Role Name',
        'permissions' => [],
    ])->assertRedirect();

    assertDatabaseHas('roles', ['id' => $role->id, 'name' => 'Updated Role Name']);
});

it('destroy deletes role', function () {
    actingAsAdmin();
    $role = Role::create(['name' => 'To Be Deleted', 'guard_name' => 'web']);

    delete(route('settings.roles.destroy', $role))
        ->assertRedirect();

    assertDatabaseMissing('roles', ['id' => $role->id]);
});
