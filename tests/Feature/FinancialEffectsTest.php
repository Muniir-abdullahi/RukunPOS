<?php

use App\Models\Account;
use App\Models\Customer;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\MoneyTransfer;
use App\Models\Product;
use App\Models\ProductStock;
use App\Models\Purchase;
use App\Models\Quotation;
use App\Models\Sale;
use App\Models\Supplier;
use App\Models\Warehouse;

use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\delete;
use function Pest\Laravel\post;

describe('Inventory Effects', function () {

    it('completing a sale decrements product stock', function () {
        actingAsAdmin();
        $warehouse = Warehouse::factory()->create();
        $product = Product::factory()->create(['selling_price' => 10]);
        $stock = ProductStock::factory()->create([
            'product_id' => $product->id,
            'warehouse_id' => $warehouse->id,
            'quantity' => 10,
        ]);
        $account = Account::factory()->create(['current_balance' => 0]);

        post(route('pos.sales.store'), [
            'warehouse_id' => $warehouse->id,
            'customer_id' => null,
            'cart' => [[
                'product_id' => $product->id,
                'quantity' => 3,
                'unit_price' => 10,
                'unit_cost' => 5,
                'tax_amount' => 0,
                'discount_amount' => 0,
                'line_total' => 30,
            ]],
            'payments' => [[
                'method' => 'cash',
                'amount' => 30,
                'received_amount' => 30,
                'change_amount' => 0,
                'account_id' => $account->id,
            ]],
            'subtotal' => 30,
            'tax_total' => 0,
            'discount_total' => 0,
            'grand_total' => 30,
        ]);

        expect((float) $stock->fresh()->quantity)->toBe(7.0);
    });

    it('completing a sale credits the payment account', function () {
        actingAsAdmin();
        $warehouse = Warehouse::factory()->create();
        $product = Product::factory()->create(['selling_price' => 50]);
        ProductStock::factory()->create([
            'product_id' => $product->id,
            'warehouse_id' => $warehouse->id,
            'quantity' => 10,
        ]);
        $account = Account::factory()->create(['current_balance' => 100]);

        post(route('pos.sales.store'), [
            'warehouse_id' => $warehouse->id,
            'customer_id' => null,
            'cart' => [[
                'product_id' => $product->id,
                'quantity' => 1,
                'unit_price' => 50,
                'unit_cost' => 25,
                'tax_amount' => 0,
                'discount_amount' => 0,
                'line_total' => 50,
            ]],
            'payments' => [[
                'method' => 'cash',
                'amount' => 50,
                'received_amount' => 50,
                'change_amount' => 0,
                'account_id' => $account->id,
            ]],
            'subtotal' => 50,
            'tax_total' => 0,
            'discount_total' => 0,
            'grand_total' => 50,
        ]);

        expect((float) $account->fresh()->current_balance)->toBe(150.0);
    });

    it('receiving a purchase increments product stock', function () {
        actingAsAdmin();
        $warehouse = Warehouse::factory()->create();
        $supplier = Supplier::factory()->create();
        $product = Product::factory()->create();
        $stock = ProductStock::factory()->create([
            'product_id' => $product->id,
            'warehouse_id' => $warehouse->id,
            'quantity' => 0,
        ]);

        post(route('purchases.store'), [
            'supplier_id' => $supplier->id,
            'warehouse_id' => $warehouse->id,
            'purchase_date' => now()->toDateString(),
            'status' => 'received',
            'items' => [[
                'product_id' => $product->id,
                'quantity' => 20,
                'unit_cost' => 5,
                'tax_amount' => 0,
                'discount_amount' => 0,
                'line_total' => 100,
            ]],
            'subtotal' => 100,
            'grand_total' => 100,
        ]);

        expect((float) $stock->fresh()->quantity)->toBe(20.0);
    });

    it('deleting a received purchase reverses stock', function () {
        actingAsAdmin();
        $warehouse = Warehouse::factory()->create();
        $supplier = Supplier::factory()->create();
        $product = Product::factory()->create();
        $stock = ProductStock::factory()->create([
            'product_id' => $product->id,
            'warehouse_id' => $warehouse->id,
            'quantity' => 0,
        ]);

        // First receive the purchase to increment stock
        post(route('purchases.store'), [
            'supplier_id' => $supplier->id,
            'warehouse_id' => $warehouse->id,
            'purchase_date' => now()->toDateString(),
            'status' => 'received',
            'items' => [[
                'product_id' => $product->id,
                'quantity' => 15,
                'unit_cost' => 5,
                'tax_amount' => 0,
                'discount_amount' => 0,
                'line_total' => 75,
            ]],
            'subtotal' => 75,
            'grand_total' => 75,
        ]);

        expect((float) $stock->fresh()->quantity)->toBe(15.0);

        $purchase = Purchase::latest()->first();
        delete(route('purchases.destroy', $purchase));

        expect((float) $stock->fresh()->quantity)->toBe(0.0);
    });

    it('sale return increments stock back', function () {
        actingAsAdmin();
        $warehouse = Warehouse::factory()->create();
        $product = Product::factory()->create();
        $stock = ProductStock::factory()->create([
            'product_id' => $product->id,
            'warehouse_id' => $warehouse->id,
            'quantity' => 10,
        ]);

        // Let's assume a sale happened reducing it to 7.
        $stock->update(['quantity' => 7]);

        // Then a sale return for qty 2
        $customer = Customer::factory()->create();
        $sale = Sale::factory()->create(['customer_id' => $customer->id, 'warehouse_id' => $warehouse->id]);

        post(route('sale-returns.store'), [
            'sale_id' => $sale->id,
            'customer_id' => $customer->id,
            'warehouse_id' => $warehouse->id,
            'return_date' => now()->toDateString(),
            'status' => 'completed',
            'subtotal' => 20,
            'grand_total' => 20,
            'items' => [[
                'product_id' => $product->id,
                'quantity' => 2,
                'unit_price' => 10,
                'line_total' => 20,
            ]],
        ]);

        expect((float) $stock->fresh()->quantity)->toBe(9.0);
    });

    it('purchase return decrements stock', function () {
        actingAsAdmin();
        $warehouse = Warehouse::factory()->create();
        $product = Product::factory()->create();
        $stock = ProductStock::factory()->create([
            'product_id' => $product->id,
            'warehouse_id' => $warehouse->id,
            'quantity' => 20,
        ]);

        $supplier = Supplier::factory()->create();
        $purchase = Purchase::factory()->create(['supplier_id' => $supplier->id, 'warehouse_id' => $warehouse->id]);

        post(route('purchase-returns.store'), [
            'purchase_id' => $purchase->id,
            'supplier_id' => $supplier->id,
            'warehouse_id' => $warehouse->id,
            'return_date' => now()->toDateString(),
            'status' => 'completed',
            'subtotal' => 25,
            'grand_total' => 25,
            'items' => [[
                'product_id' => $product->id,
                'quantity' => 5,
                'unit_cost' => 5,
                'line_total' => 25,
            ]],
        ]);

        expect((float) $stock->fresh()->quantity)->toBe(15.0);
    });
});

describe('Account Effects', function () {

    it('creating an expense debits the account', function () {
        actingAsAdmin();
        $account = Account::factory()->create(['current_balance' => 500]);
        $category = ExpenseCategory::factory()->create();
        $warehouse = Warehouse::factory()->create();

        post(route('expenses.store'), [
            'expense_category_id' => $category->id,
            'account_id' => $account->id,
            'warehouse_id' => $warehouse->id,
            'expense_date' => now()->toDateString(),
            'amount' => 150,
            'note' => 'Test',
        ]);

        expect((float) $account->fresh()->current_balance)->toBe(350.0);
    });

    it('deleting an expense reverses the account debit', function () {
        actingAsAdmin();
        $account = Account::factory()->create(['current_balance' => 500]);
        $category = ExpenseCategory::factory()->create();
        $warehouse = Warehouse::factory()->create();

        post(route('expenses.store'), [
            'expense_category_id' => $category->id,
            'account_id' => $account->id,
            'warehouse_id' => $warehouse->id,
            'expense_date' => now()->toDateString(),
            'amount' => 150,
            'note' => 'Test',
        ]);

        expect((float) $account->fresh()->current_balance)->toBe(350.0);

        $expense = Expense::latest()->first();
        delete(route('expenses.destroy', $expense));

        expect((float) $account->fresh()->current_balance)->toBe(500.0);
    });

    it('money transfer debits source and credits destination', function () {
        actingAsAdmin();
        $from = Account::factory()->create(['current_balance' => 1000]);
        $to = Account::factory()->create(['current_balance' => 200]);

        post(route('money-transfers.store'), [
            'from_account_id' => $from->id,
            'to_account_id' => $to->id,
            'transfer_date' => now()->toDateString(),
            'amount' => 300,
        ]);

        expect((float) $from->fresh()->current_balance)->toBe(700.0);
        expect((float) $to->fresh()->current_balance)->toBe(500.0);
    });

    it('deleting a transfer reverses both account balances', function () {
        actingAsAdmin();
        $from = Account::factory()->create(['current_balance' => 1000]);
        $to = Account::factory()->create(['current_balance' => 200]);

        post(route('money-transfers.store'), [
            'from_account_id' => $from->id,
            'to_account_id' => $to->id,
            'transfer_date' => now()->toDateString(),
            'amount' => 300,
        ]);

        $transfer = MoneyTransfer::latest()->first();
        delete(route('money-transfers.destroy', $transfer));

        expect((float) $from->fresh()->current_balance)->toBe(1000.0);
        expect((float) $to->fresh()->current_balance)->toBe(200.0);
    });
});

describe('Quotation Conversion', function () {

    it('converting quotation creates a sale', function () {
        actingAsAdmin();
        $warehouse = Warehouse::factory()->create();
        $product = Product::factory()->create([
            'cost_price' => 40,
            'selling_price' => 100,
        ]);
        $account = Account::factory()->create(['current_balance' => 0]);
        $quotation = Quotation::factory()->create(['status' => 'pending']);
        $quotation->items()->create([
            'product_id' => $product->id,
            'quantity' => 1,
            'unit_price' => 100,
            'tax_amount' => 0,
            'discount_amount' => 0,
            'line_total' => 100,
        ]);
        ProductStock::factory()->create([
            'product_id' => $product->id,
            'warehouse_id' => $warehouse->id,
            'quantity' => 10,
        ]);

        post(route('quotations.convert', $quotation), [
            'warehouse_id' => $warehouse->id,
            'customer_id' => $quotation->customer_id,
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

        expect($quotation->fresh()->status)->toBe('converted');
        expect($quotation->fresh()->converted_sale_id)->not->toBeNull();
        assertDatabaseHas('sales', ['id' => $quotation->fresh()->converted_sale_id]);
    });
});
