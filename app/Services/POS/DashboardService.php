<?php

namespace App\Services\POS;

use App\Models\Expense;
use App\Models\ProductStock;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Services\Concerns\HandlesServiceExceptions;

class DashboardService
{
    use HandlesServiceExceptions;

    public function getData(): array
    {
        return $this->tryCatch(function () {
            $salesToday = (float) Sale::query()->whereDate('sale_date', today())->sum('grand_total');
            $revenueMonth = (float) Sale::query()->whereMonth('sale_date', now()->month)->sum('grand_total');
            $purchaseMonth = (float) Purchase::query()->whereMonth('purchase_date', now()->month)->sum('grand_total');
            $expenseMonth = (float) Expense::query()->whereMonth('expense_date', now()->month)->sum('amount');

            return [
                'stats' => ['salesToday' => $salesToday, 'revenueMonth' => $revenueMonth, 'purchaseMonth' => $purchaseMonth, 'expenseMonth' => $expenseMonth, 'netProfit' => $revenueMonth - $purchaseMonth - $expenseMonth, 'lowStockCount' => ProductStock::query()->where('quantity', '<=', 0)->count()],
                'recentSales' => Sale::query()->with('customer:id,name')->latest()->take(10)->get(),
                'topProducts' => SaleItem::query()->selectRaw('product_id, sum(quantity) as total_qty, sum(line_total) as revenue')->with('product:id,name')->groupBy('product_id')->orderByDesc('total_qty')->take(5)->get(),
                'revenueChart' => Sale::query()->selectRaw('date(sale_date) as name, sum(grand_total) as sales')->where('sale_date', '>=', now()->subDays(6)->startOfDay())->groupBy('name')->orderBy('name')->get(),
            ];
        });
    }
}
