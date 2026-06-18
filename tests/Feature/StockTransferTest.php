<?php

use App\Models\Product;
use App\Models\ProductStock;
use App\Models\StockTransfer;
use App\Models\Warehouse;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\patch;
use function Pest\Laravel\post;

it('guest is redirected to login', function () {
    get(route('inventory.transfers'))->assertRedirect(route('login'));
});

it('index displays stock transfers', function () {
    actingAsAdmin();
    get(route('inventory.transfers'))->assertOk();
});

it('store creates a stock transfer', function () {
    actingAsAdmin();
    $from = Warehouse::factory()->create();
    $to = Warehouse::factory()->create();
    $product = Product::factory()->create();
    ProductStock::factory()->create([
        'product_id' => $product->id,
        'warehouse_id' => $from->id,
        'quantity' => 10,
    ]);

    post(route('inventory.transfers.store'), [
        'reference' => 'ST-1234',
        'from_warehouse_id' => $from->id,
        'to_warehouse_id' => $to->id,
        'date' => now()->toDateString(),
        'status' => 'completed',
        'items' => [[
            'product_id' => $product->id,
            'quantity' => 2,
        ]],
    ])->assertRedirect();

    assertDatabaseHas('stock_transfers', [
        'from_warehouse_id' => $from->id,
        'to_warehouse_id' => $to->id,
        'status' => 'completed',
    ]);
});

it('update modifies stock transfer', function () {
    actingAsAdmin();
    $from = Warehouse::factory()->create();
    $to = Warehouse::factory()->create();
    $product = Product::factory()->create();
    ProductStock::factory()->create([
        'product_id' => $product->id,
        'warehouse_id' => $from->id,
        'quantity' => 10,
    ]);
    $transfer = StockTransfer::create([
        'reference' => 'ST-0001',
        'from_warehouse_id' => $from->id,
        'to_warehouse_id' => $to->id,
        'date' => now()->toDateString(),
        'status' => 'pending',
    ]);

    patch(route('inventory.transfers.update', $transfer), [
        'from_warehouse_id' => $from->id,
        'to_warehouse_id' => $to->id,
        'date' => now()->toDateString(),
        'status' => 'completed',
        'note' => 'Updated transfer',
        'items' => [[
            'product_id' => $product->id,
            'quantity' => 2,
        ]],
    ])->assertRedirect();

    assertDatabaseHas('stock_transfers', ['id' => $transfer->id, 'status' => 'completed', 'note' => 'Updated transfer']);
});

it('destroy deletes stock transfer', function () {
    actingAsAdmin();
    $from = Warehouse::factory()->create();
    $to = Warehouse::factory()->create();
    $transfer = StockTransfer::create([
        'reference' => 'ST-0002',
        'from_warehouse_id' => $from->id,
        'to_warehouse_id' => $to->id,
        'date' => now()->toDateString(),
        'status' => 'pending',
    ]);

    delete(route('inventory.transfers.destroy', $transfer))
        ->assertRedirect();

    \Pest\Laravel\assertDatabaseMissing('stock_transfers', ['id' => $transfer->id]);
});
