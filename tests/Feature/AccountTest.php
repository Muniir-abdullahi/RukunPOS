<?php

use App\Models\Account;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertSoftDeleted;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\patch;
use function Pest\Laravel\post;

it('guest is redirected to login', function () {
    get(route('accounts.index'))->assertRedirect(route('login'));
});

it('index displays accounts', function () {
    actingAsAdmin();
    Account::factory()->count(3)->create();

    get(route('accounts.index'))->assertOk();
});

it('store creates an account', function () {
    actingAsAdmin();

    post(route('accounts.store'), [
        'account_no' => 'ACC-12345',
        'name' => 'Main Account',
        'opening_balance' => 1000,
        'status' => 'active',
    ])->assertRedirect();

    assertDatabaseHas('accounts', ['account_no' => 'ACC-12345']);
});

it('update modifies account', function () {
    actingAsAdmin();
    $account = Account::factory()->create();

    patch(route('accounts.update', $account), [
        'account_no' => $account->account_no,
        'name' => 'Updated Account',
        'status' => 'active',
    ])->assertRedirect();

    assertDatabaseHas('accounts', ['id' => $account->id, 'name' => 'Updated Account']);
});

it('destroy soft deletes account', function () {
    actingAsAdmin();
    $account = Account::factory()->create();

    delete(route('accounts.destroy', $account))
        ->assertRedirect();

    assertSoftDeleted('accounts', ['id' => $account->id]);
});
