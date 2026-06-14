<?php

namespace App\Services\Reports;

use App\Models\Expense;
use App\Models\ProductStock;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Warehouse;
use App\Services\Concerns\HandlesServiceExceptions;
use Carbon\Carbon;

class ReportService
{
    use HandlesServiceExceptions;

    public function sales(array $filters = []): array
    {
        return $this->tryCatch(function () use ($filters) {
            [$from, $to] = $this->period($filters);
            $query = Sale::query()->whereBetween('sale_date', [$from, $to]);

            return ['total_sales' => (clone $query)->count(), 'total_revenue' => (float) (clone $query)->sum('grand_total'), 'total_discount' => (float) (clone $query)->sum('discount_total'), 'total_tax' => (float) (clone $query)->sum('tax_total'), 'net_revenue' => (float) (clone $query)->sum('grand_total'), 'rows' => (clone $query)->selectRaw('date(sale_date) as date, count(*) as sales_count, sum(grand_total) as revenue, sum(discount_total) as discount, sum(tax_total) as tax')->groupBy('date')->orderBy('date')->get()];
        });
    }

    public function purchases(array $filters = []): array
    {
        return $this->tryCatch(function () use ($filters) {
            [$from, $to] = $this->period($filters);
            $query = Purchase::query()->whereBetween('purchase_date', [$from, $to]);

            return ['total_purchases' => (clone $query)->count(), 'total_amount' => (float) (clone $query)->sum('grand_total'), 'paid_total' => (float) (clone $query)->sum('paid_total'), 'due_total' => (float) (clone $query)->sum('due_total'), 'rows' => (clone $query)->selectRaw('purchase_date as date, count(*) as purchases_count, sum(grand_total) as total')->groupBy('purchase_date')->orderBy('purchase_date')->get()];
        });
    }

    public function profitLoss(array $filters = []): array
    {
        return $this->tryCatch(function () use ($filters) {
            [$from, $to] = $this->period($filters);
            $revenue = (float) Sale::query()->whereBetween('sale_date', [$from, $to])->sum('grand_total');
            $cogs = (float) SaleItem::query()->whereHas('sale', fn ($query) => $query->whereBetween('sale_date', [$from, $to]))->selectRaw('sum(quantity * unit_cost) as total')->value('total');
            $expenses = (float) Expense::query()->whereBetween('expense_date', [$from, $to])->sum('amount');
            $gross = $revenue - $cogs;
            $net = $gross - $expenses;

            return ['revenue' => $revenue, 'cost_of_goods' => $cogs, 'gross_profit' => $gross, 'expenses' => $expenses, 'net_profit' => $net, 'margin_percent' => $revenue > 0 ? round(($net / $revenue) * 100, 2) : 0];
        });
    }

    public function stock(array $filters = []): array
    {
        return $this->tryCatch(fn () => ['warehouses' => Warehouse::query()->orderBy('name')->get(['id', 'name']), 'products' => ProductStock::query()->with(['product:id,name,sku', 'warehouse:id,name'])->get()]);
    }

    public function expenses(array $filters = []): array
    {
        return $this->tryCatch(function () use ($filters) {
            [$from, $to] = $this->period($filters);
            $query = Expense::query()->with('category:id,name')->whereBetween('expense_date', [$from, $to]);

            return ['total_expenses' => (float) (clone $query)->sum('amount'), 'rows' => $query->latest()->get()];
        });
    }

    private function period(array $filters): array
    {
        return [Carbon::parse($filters['date_from'] ?? now()->startOfMonth()), Carbon::parse($filters['date_to'] ?? now()->endOfMonth())];
    }
}
