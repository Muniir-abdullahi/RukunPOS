<?php

use App\Models\Account;
use App\Models\MoneyTransfer;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

it('guest is redirected to login', function () {
    get(route('money-transfers.index'))->assertRedirect(route('login'));
});

it('index displays money transfers', function () {
    actingAsAdmin();
    get(route('money-transfers.index'))->assertOk();
});

it('store creates a money transfer', function () {
    actingAsAdmin();
    $from = Account::factory()->create();
    $to = Account::factory()->create();

    post(route('money-transfers.store'), [
        'reference' => 'MT-1234',
        'from_account_id' => $from->id,
        'to_account_id' => $to->id,
        'amount' => 500,
        'transfer_date' => now()->toDateString(),
        'note' => 'Test Transfer',
    ])->assertRedirect();

    assertDatabaseHas('money_transfers', [
        'from_account_id' => $from->id,
        'to_account_id' => $to->id,
        'amount' => 500,
    ]);
});

it('show displays transfer details', function () {
    actingAsAdmin();
    $from = Account::factory()->create();
    $to = Account::factory()->create();
    $transfer = MoneyTransfer::create([
        'reference' => 'MT-0001',
        'from_account_id' => $from->id,
        'to_account_id' => $to->id,
        'amount' => 200,
        'transfer_date' => now()->toDateString(),
    ]);

    get(route('money-transfers.show', $transfer))->assertOk();
});

it('destroy deletes money transfer', function () {
    actingAsAdmin();
    $from = Account::factory()->create();
    $to = Account::factory()->create();
    $transfer = MoneyTransfer::create([
        'reference' => 'MT-0002',
        'from_account_id' => $from->id,
        'to_account_id' => $to->id,
        'amount' => 200,
        'transfer_date' => now()->toDateString(),
    ]);

    delete(route('money-transfers.destroy', $transfer))
        ->assertRedirect();

    \Pest\Laravel\assertDatabaseMissing('money_transfers', ['id' => $transfer->id]);
});
