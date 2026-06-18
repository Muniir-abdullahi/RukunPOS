<?php

use App\Models\Account;
use App\Models\Expense;
use App\Models\ExpenseCategory;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertSoftDeleted;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\patch;
use function Pest\Laravel\post;

it('guest is redirected to login', function () {
    get(route('expenses.index'))->assertRedirect(route('login'));
});

it('index displays expenses', function () {
    actingAsAdmin();
    Expense::factory()->count(3)->create();

    get(route('expenses.index'))->assertOk();
});

it('store creates an expense', function () {
    actingAsAdmin();
    $category = ExpenseCategory::factory()->create();
    $account = Account::factory()->create();

    post(route('expenses.store'), [
        'expense_category_id' => $category->id,
        'account_id' => $account->id,
        'expense_date' => now()->toDateString(),
        'amount' => 150,
        'note' => 'Test Expense',
    ])->assertRedirect();

    assertDatabaseHas('expenses', ['amount' => 150]);
});

it('update modifies expense', function () {
    actingAsAdmin();
    $expense = Expense::factory()->create();

    patch(route('expenses.update', $expense), [
        'expense_category_id' => $expense->expense_category_id,
        'account_id' => $expense->account_id,
        'expense_date' => now()->toDateString(),
        'amount' => 200,
        'note' => 'Updated Note',
    ])->assertRedirect();

    assertDatabaseHas('expenses', ['id' => $expense->id, 'amount' => 200]);
});

it('destroy deletes expense', function () {
    actingAsAdmin();
    $expense = Expense::factory()->create();

    delete(route('expenses.destroy', $expense))
        ->assertRedirect();

    assertSoftDeleted('expenses', ['id' => $expense->id]);
});
