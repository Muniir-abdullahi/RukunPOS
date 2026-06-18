<?php

use App\Models\Warehouse;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertSoftDeleted;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\patch;
use function Pest\Laravel\post;

it('guest is redirected to login', function () {
    get(route('settings.warehouses'))->assertRedirect(route('login'));
});

it('index displays warehouses', function () {
    actingAsAdmin();
    Warehouse::factory()->count(3)->create();

    get(route('settings.warehouses'))->assertOk();
});

it('store creates a warehouse', function () {
    actingAsAdmin();

    post(route('settings.warehouses.store'), [
        'name' => 'Main Warehouse',
        'phone' => '123456789',
        'email' => 'warehouse@test.com',
        'status' => 'active',
    ])->assertRedirect();

    assertDatabaseHas('warehouses', ['name' => 'Main Warehouse']);
});

it('update modifies warehouse', function () {
    actingAsAdmin();
    $warehouse = Warehouse::factory()->create();

    patch(route('settings.warehouses.update', $warehouse), [
        'name' => 'Updated Warehouse',
        'phone' => $warehouse->phone,
        'email' => $warehouse->email,
        'status' => 'active',
    ])->assertRedirect();

    assertDatabaseHas('warehouses', ['id' => $warehouse->id, 'name' => 'Updated Warehouse']);
});

it('destroy soft deletes warehouse', function () {
    actingAsAdmin();
    $warehouse = Warehouse::factory()->create();

    delete(route('settings.warehouses.destroy', $warehouse))
        ->assertRedirect();

    assertSoftDeleted('warehouses', ['id' => $warehouse->id]);
});
