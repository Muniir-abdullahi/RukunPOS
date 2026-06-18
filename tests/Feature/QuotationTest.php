<?php

use App\Models\Customer;
use App\Models\Product;
use App\Models\Quotation;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertSoftDeleted;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\patch;
use function Pest\Laravel\post;

it('guest is redirected to login', function () {
    get(route('quotations.index'))->assertRedirect(route('login'));
});

it('index displays quotations', function () {
    actingAsAdmin();
    Quotation::factory()->count(3)->create();

    get(route('quotations.index'))->assertOk();
});

it('store creates a quotation', function () {
    actingAsAdmin();
    $customer = Customer::factory()->create();
    $product = Product::factory()->create();

    post(route('quotations.store'), [
        'customer_id' => $customer->id,
        'quotation_date' => now()->toDateString(),
        'status' => 'pending',
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 1,
                'unit_price' => 100,
                'tax_amount' => 0,
                'discount_amount' => 0,
            ],
        ],
    ])->assertRedirect();

    assertDatabaseHas('quotations', ['customer_id' => $customer->id]);
});

it('update modifies quotation', function () {
    actingAsAdmin();
    $quotation = Quotation::factory()->create();
    $product = Product::factory()->create();

    patch(route('quotations.update', $quotation), [
        'customer_id' => $quotation->customer_id,
        'quotation_date' => now()->toDateString(),
        'status' => 'sent',
        'items' => [
            [
                'product_id' => $product->id,
                'quantity' => 1,
                'unit_price' => 150,
                'tax_amount' => 0,
                'discount_amount' => 0,
            ],
        ],
    ])->assertRedirect();

    assertDatabaseHas('quotations', ['id' => $quotation->id, 'status' => 'sent']);
});

it('destroy deletes quotation', function () {
    actingAsAdmin();
    $quotation = Quotation::factory()->create();

    delete(route('quotations.destroy', $quotation))
        ->assertRedirect();

    assertSoftDeleted('quotations', ['id' => $quotation->id]);
});
