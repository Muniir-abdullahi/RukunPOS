<?php

use App\Models\Supplier;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertSoftDeleted;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\patch;
use function Pest\Laravel\post;

it('guest is redirected to login', function () {
    get(route('suppliers.index'))->assertRedirect(route('login'));
});

it('index displays suppliers', function () {
    actingAsAdmin();
    Supplier::factory()->count(3)->create();

    get(route('suppliers.index'))->assertOk();
});

it('store creates a supplier', function () {
    actingAsAdmin();

    post(route('suppliers.store'), [
        'name' => 'Acme Supplies',
        'phone' => '+1234567890',
        'email' => 'contact@acme.test',
        'status' => 'active',
    ])->assertRedirect(route('suppliers.index'));

    assertDatabaseHas('suppliers', ['name' => 'Acme Supplies']);
});

it('update modifies supplier', function () {
    actingAsAdmin();
    $supplier = Supplier::factory()->create();

    patch(route('suppliers.update', $supplier), [
        'name' => 'Updated Supplier',
        'phone' => $supplier->phone,
        'email' => $supplier->email,
        'status' => 'active',
    ])->assertRedirect();

    assertDatabaseHas('suppliers', ['id' => $supplier->id, 'name' => 'Updated Supplier']);
});

it('destroy soft deletes supplier', function () {
    actingAsAdmin();
    $supplier = Supplier::factory()->create();

    delete(route('suppliers.destroy', $supplier))
        ->assertRedirect();

    assertSoftDeleted('suppliers', ['id' => $supplier->id]);
});
