<?php

use App\Models\Customer;
use App\Models\CustomerGroup;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertSoftDeleted;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\patch;
use function Pest\Laravel\post;

it('guest is redirected to login', function () {
    get(route('customers.index'))->assertRedirect(route('login'));
});

it('index displays customers', function () {
    actingAsAdmin();
    Customer::factory()->count(3)->create();

    get(route('customers.index'))
        ->assertOk();
    // ->assertInertia(fn ($page) => $page->component('Modules/Customers/Index'));
});

it('store creates a customer', function () {
    actingAsAdmin();

    $customerGroup = CustomerGroup::factory()->create();

    post(route('customers.store'), [
        'customer_group_id' => $customerGroup->id,
        'name' => 'Hassan Ali',
        'phone' => '+252611000001',
        'status' => 'active',
    ])->assertRedirect(route('customers.index'));

    assertDatabaseHas('customers', ['name' => 'Hassan Ali']);
});

it('update modifies customer', function () {
    actingAsAdmin();
    $customer = Customer::factory()->create();

    patch(route('customers.update', $customer), [
        'customer_group_id' => $customer->customer_group_id,
        'name' => 'Updated Name',
        'phone' => $customer->phone,
        'status' => 'active',
    ])->assertRedirect(); // could be back or index depending on implementation

    assertDatabaseHas('customers', ['id' => $customer->id, 'name' => 'Updated Name']);
});

it('destroy soft deletes customer', function () {
    actingAsAdmin();
    $customer = Customer::factory()->create();

    delete(route('customers.destroy', $customer))
        ->assertRedirect();

    assertSoftDeleted('customers', ['id' => $customer->id]);
});
