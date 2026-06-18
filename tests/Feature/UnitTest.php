<?php

use App\Models\Unit;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertSoftDeleted;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\patch;
use function Pest\Laravel\post;

it('guest is redirected to login', function () {
    get(route('products.units'))->assertRedirect(route('login'));
});

it('index displays units', function () {
    actingAsAdmin();
    Unit::factory()->count(3)->create();

    get(route('products.units'))->assertOk();
});

it('store creates a unit', function () {
    actingAsAdmin();

    post(route('products.units.store'), [
        'name' => 'Kilogram',
        'code' => 'KG',
        'short_name' => 'kg',
        'operator' => '*',
        'operation_value' => 1,
        'status' => 'active',
    ])->assertRedirect();

    assertDatabaseHas('units', ['name' => 'Kilogram']);
});

it('update modifies unit', function () {
    actingAsAdmin();
    $unit = Unit::factory()->create();

    patch(route('products.units.update', $unit), [
        'name' => 'Updated Unit',
        'code' => $unit->code,
        'short_name' => $unit->short_name,
        'operator' => $unit->operator,
        'operation_value' => $unit->operation_value,
        'status' => 'active',
    ])->assertRedirect();

    assertDatabaseHas('units', ['id' => $unit->id, 'name' => 'Updated Unit']);
});

it('destroy soft deletes unit', function () {
    actingAsAdmin();
    $unit = Unit::factory()->create();

    delete(route('products.units.destroy', $unit))
        ->assertRedirect();

    assertSoftDeleted('units', ['id' => $unit->id]);
});
