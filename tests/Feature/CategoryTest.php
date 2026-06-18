<?php

use App\Models\Category;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertSoftDeleted;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\patch;
use function Pest\Laravel\post;

it('guest is redirected to login', function () {
    get(route('products.categories'))->assertRedirect(route('login'));
});

it('index displays categories', function () {
    actingAsAdmin();
    Category::factory()->count(3)->create();

    get(route('products.categories'))->assertOk();
});

it('store creates a category', function () {
    actingAsAdmin();

    post(route('products.categories.store'), [
        'name' => 'Beverages',
        'description' => 'All kinds of drinks',
        'status' => 'active',
    ])->assertRedirect();

    assertDatabaseHas('categories', ['name' => 'Beverages']);
});

it('update modifies category', function () {
    actingAsAdmin();
    $category = Category::factory()->create();

    patch(route('products.categories.update', $category), [
        'name' => 'Updated Category',
        'description' => $category->description,
        'status' => 'active',
    ])->assertRedirect();

    assertDatabaseHas('categories', ['id' => $category->id, 'name' => 'Updated Category']);
});

it('destroy soft deletes category', function () {
    actingAsAdmin();
    $category = Category::factory()->create();

    delete(route('products.categories.destroy', $category))
        ->assertRedirect();

    assertSoftDeleted('categories', ['id' => $category->id]);
});
