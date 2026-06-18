<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\TaxRate;
use App\Models\Unit;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertSoftDeleted;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\patch;
use function Pest\Laravel\post;

it('guest is redirected to login', function () {
    get(route('products.index'))->assertRedirect(route('login'));
});

it('index displays products', function () {
    actingAsAdmin();
    Product::factory()->count(3)->create();

    get(route('products.index'))->assertOk();
});

it('store creates a product', function () {
    actingAsAdmin();

    $category = Category::factory()->create();
    $brand = Brand::factory()->create();
    $unit = Unit::factory()->create();
    $taxRate = TaxRate::factory()->create();

    $response = post(route('products.store'), [
        'name' => 'Test Product',
        'sku' => 'PRD-1234',
        'categoryId' => $category->id,
        'brandId' => $brand->id,
        'unitId' => $unit->id,
        'taxRateId' => $taxRate->id,
        'costPrice' => 10,
        'sellingPrice' => 20,
        'minStock' => 5,
        'status' => 'active',
    ]);

    $response->assertRedirect(route('products.index'));

    assertDatabaseHas('products', ['name' => 'Test Product', 'sku' => 'PRD-1234']);
});

it('update modifies product', function () {
    actingAsAdmin();
    $product = Product::factory()->create();

    patch(route('products.update', $product), [
        'name' => 'Updated Product Name',
        'sku' => $product->sku,
        'categoryId' => $product->category_id,
        'brandId' => $product->brand_id,
        'unitId' => $product->unit_id,
        'taxRateId' => $product->tax_rate_id,
        'costPrice' => $product->cost_price,
        'sellingPrice' => $product->selling_price,
        'minStock' => $product->alert_quantity,
        'status' => 'active',
    ])->assertRedirect();

    assertDatabaseHas('products', ['id' => $product->id, 'name' => 'Updated Product Name']);
});

it('destroy soft deletes product', function () {
    actingAsAdmin();
    $product = Product::factory()->create();

    delete(route('products.destroy', $product))
        ->assertRedirect();

    assertSoftDeleted('products', ['id' => $product->id]);
});
