<?php

use App\Models\Account;
use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductStock;
use App\Models\Sale;
use App\Models\Warehouse;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertSoftDeleted;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

it('guest is redirected to login', function () {
    get(route('sales.index'))->assertRedirect(route('login'));
});

it('index displays sales', function () {
    actingAsAdmin();
    Sale::factory()->count(3)->create();

    get(route('sales.index'))->assertOk();
});

it('store creates a sale via pos', function () {
    actingAsAdmin();
    $customer = Customer::factory()->create();
    $warehouse = Warehouse::factory()->create();
    $product = Product::factory()->create(['cost_price' => 50, 'selling_price' => 100]);
    $account = Account::factory()->create(['current_balance' => 0]);
    ProductStock::factory()->create([
        'product_id' => $product->id,
        'warehouse_id' => $warehouse->id,
        'quantity' => 10,
    ]);

    post(route('pos.sales.store'), [
        'customer_id' => $customer->id,
        'warehouse_id' => $warehouse->id,
        'cart' => [[
            'product_id' => $product->id,
            'quantity' => 1,
            'unit_price' => 100,
            'tax_amount' => 0,
            'discount_amount' => 0,
        ]],
        'payments' => [[
            'account_id' => $account->id,
            'method' => 'cash',
            'amount' => 100,
            'received_amount' => 100,
        ]],
        'tax_total' => 0,
        'discount_total' => 0,
    ])->assertRedirect();

    // We just check if a sale was made
    assertDatabaseHas('sales', ['customer_id' => $customer->id]);
});

it('show displays sale details', function () {
    actingAsAdmin();
    $sale = Sale::factory()->create();

    get(route('sales.show', $sale))->assertOk();
});

it('destroy deletes sale', function () {
    actingAsAdmin();
    $sale = Sale::factory()->create();

    delete(route('sales.destroy', $sale))
        ->assertRedirect();

    assertSoftDeleted('sales', ['id' => $sale->id]);
});
