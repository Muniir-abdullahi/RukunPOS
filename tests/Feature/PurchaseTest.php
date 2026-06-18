<?php

use App\Models\Product;
use App\Models\Purchase;
use App\Models\Supplier;
use App\Models\Warehouse;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertSoftDeleted;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\patch;
use function Pest\Laravel\post;

it('guest is redirected to login', function () {
    get(route('purchases.index'))->assertRedirect(route('login'));
});

it('index displays purchases', function () {
    actingAsAdmin();
    Purchase::factory()->count(3)->create();

    get(route('purchases.index'))->assertOk();
});

it('store creates a purchase', function () {
    actingAsAdmin();
    $supplier = Supplier::factory()->create();
    $warehouse = Warehouse::factory()->create();
    $product = Product::factory()->create();

    post(route('purchases.store'), [
        'supplier_id' => $supplier->id,
        'warehouse_id' => $warehouse->id,
        'purchase_date' => now()->toDateString(),
        'status' => 'received',
        'items' => [[
            'product_id' => $product->id,
            'quantity' => 2,
            'unit_cost' => 50,
            'tax_amount' => 0,
            'discount_amount' => 0,
        ]],
    ])->assertRedirect(route('purchases.index'));

    assertDatabaseHas('purchases', ['supplier_id' => $supplier->id]);
});

it('update modifies purchase', function () {
    actingAsAdmin();
    $purchase = Purchase::factory()->create();
    $product = Product::factory()->create();

    patch(route('purchases.update', $purchase), [
        'supplier_id' => $purchase->supplier_id,
        'warehouse_id' => $purchase->warehouse_id,
        'purchase_date' => now()->toDateString(),
        'status' => 'ordered',
        'items' => [[
            'product_id' => $product->id,
            'quantity' => 3,
            'unit_cost' => 50,
            'tax_amount' => 0,
            'discount_amount' => 0,
        ]],
    ])->assertRedirect();

    assertDatabaseHas('purchases', ['id' => $purchase->id, 'status' => 'ordered']);
});

it('destroy deletes purchase', function () {
    actingAsAdmin();
    $purchase = Purchase::factory()->create();

    delete(route('purchases.destroy', $purchase))
        ->assertRedirect();

    assertSoftDeleted('purchases', ['id' => $purchase->id]);
});
