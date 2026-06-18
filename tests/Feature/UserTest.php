<?php

use App\Models\User;
use Spatie\Permission\Models\Role;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\patch;
use function Pest\Laravel\post;

it('guest is redirected to login', function () {
    get(route('people.users'))->assertRedirect(route('login'));
});

it('index displays users', function () {
    actingAsAdmin();
    User::factory()->count(3)->create();

    get(route('people.users'))->assertOk();
});

it('store creates a user', function () {
    actingAsAdmin();

    $role = Role::firstOrCreate(['name' => 'Cashier', 'guard_name' => 'web']);

    post(route('people.users.store'), [
        'name' => 'New User',
        'email' => 'newuser@test.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => $role->name,
        'status' => 'active',
    ])->assertRedirect();

    assertDatabaseHas('users', ['name' => 'New User', 'email' => 'newuser@test.com']);
});

it('update modifies user', function () {
    actingAsAdmin();
    $user = User::factory()->create();
    $role = Role::firstOrCreate(['name' => 'Cashier', 'guard_name' => 'web']);

    patch(route('people.users.update', $user), [
        'name' => 'Updated User',
        'email' => $user->email,
        'role' => $role->name,
        'status' => 'active',
    ])->assertRedirect();

    assertDatabaseHas('users', ['id' => $user->id, 'name' => 'Updated User']);
});

it('destroy deletes user', function () {
    actingAsAdmin();
    $user = User::factory()->create();

    delete(route('people.users.destroy', $user))
        ->assertRedirect();

    assertDatabaseMissing('users', ['id' => $user->id]);
});
