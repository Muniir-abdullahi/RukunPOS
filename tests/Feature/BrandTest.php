<?php

use App\Models\Brand;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertSoftDeleted;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\patch;
use function Pest\Laravel\post;

it('guest is redirected to login', function () {
    get(route('products.brands'))->assertRedirect(route('login'));
});

it('index displays brands', function () {
    actingAsAdmin();
    Brand::factory()->count(3)->create();

    get(route('products.brands'))->assertOk();
});

it('store creates a brand', function () {
    actingAsAdmin();

    post(route('products.brands.store'), [
        'name' => 'Acme Brand',
        'description' => 'Quality products',
        'status' => 'active',
    ])->assertRedirect();

    assertDatabaseHas('brands', ['name' => 'Acme Brand']);
});

it('update modifies brand', function () {
    actingAsAdmin();
    $brand = Brand::factory()->create();

    patch(route('products.brands.update', $brand), [
        'name' => 'Updated Brand',
        'description' => $brand->description,
        'status' => 'active',
    ])->assertRedirect();

    assertDatabaseHas('brands', ['id' => $brand->id, 'name' => 'Updated Brand']);
});

it('destroy soft deletes brand', function () {
    actingAsAdmin();
    $brand = Brand::factory()->create();

    delete(route('products.brands.destroy', $brand))
        ->assertRedirect();

    assertSoftDeleted('brands', ['id' => $brand->id]);
});
