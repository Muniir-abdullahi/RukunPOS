<?php

use App\Models\Product;
use App\Models\StockAdjustment;
use App\Models\Warehouse;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\patch;
use function Pest\Laravel\post;

it('guest is redirected to login', function () {
    get(route('inventory.adjustments'))->assertRedirect(route('login'));
});

it('index displays stock adjustments', function () {
    actingAsAdmin();
    // Assuming StockAdjustment factory exists
    // StockAdjustment::factory()->count(3)->create();

    get(route('inventory.adjustments'))->assertOk();
});

it('store creates a stock adjustment', function () {
    actingAsAdmin();
    $warehouse = Warehouse::factory()->create();

    post(route('inventory.adjustments.store'), [
        'reference' => 'SA-1234',
        'warehouse_id' => $warehouse->id,
        'date' => now()->toDateString(),
        'note' => 'Test Adjustment',
        'items' => [
            [
                'product_id' => Product::factory()->create()->id,
                'type' => 'increase',
                'quantity' => 5,
            ],
        ],
    ])->assertRedirect();

    assertDatabaseHas('stock_adjustments', [
        'warehouse_id' => $warehouse->id,
        'note' => 'Test Adjustment',
    ]);
});

it('update modifies stock adjustment', function () {
    actingAsAdmin();
    $warehouse = Warehouse::factory()->create();
    // We create manually if factory is missing, but it should be created by user or factory
    $adjustment = StockAdjustment::create([
        'reference' => 'SA-0001',
        'warehouse_id' => $warehouse->id,
        'date' => now()->toDateString(),
    ]);

    patch(route('inventory.adjustments.update', $adjustment), [
        'warehouse_id' => $warehouse->id,
        'date' => now()->toDateString(),
        'note' => 'Updated adjustment',
        'items' => [
            [
                'product_id' => Product::factory()->create()->id,
                'type' => 'decrease',
                'quantity' => 2,
            ],
        ],
    ])->assertRedirect();

    assertDatabaseHas('stock_adjustments', ['id' => $adjustment->id, 'note' => 'Updated adjustment']);
});

it('destroy deletes stock adjustment', function () {
    actingAsAdmin();
    $warehouse = Warehouse::factory()->create();
    $adjustment = StockAdjustment::create([
        'reference' => 'SA-0002',
        'warehouse_id' => $warehouse->id,
        'date' => now()->toDateString(),
    ]);

    delete(route('inventory.adjustments.destroy', $adjustment))
        ->assertRedirect();

    \Pest\Laravel\assertDatabaseMissing('stock_adjustments', ['id' => $adjustment->id]);
});
