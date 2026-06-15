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
            $salesToday = Sale::query()->whereDate('sale_date', today())->count();
            $revenueMonth = (float) Sale::query()->whereMonth('sale_date', now()->month)->sum('grand_total');
            $purchaseMonth = (float) Purchase::query()->whereMonth('purchase_date', now()->month)->sum('grand_total');
            $expenseMonth = (float) Expense::query()->whereMonth('expense_date', now()->month)->sum('amount');

            return [
                'salesToday' => $salesToday,
                'revenueMonth' => $revenueMonth,
                'purchaseMonth' => $purchaseMonth,
                'expenseMonth' => $expenseMonth,
                'netProfit' => $revenueMonth - $purchaseMonth - $expenseMonth,
                'lowStockCount' => ProductStock::query()
                    ->whereHas('product', fn ($query) => $query->whereColumn('product_stocks.quantity', '<=', 'products.alert_quantity'))
                    ->orWhere('quantity', '<=', 0)
                    ->count(),
                'recentSales' => Sale::query()
                    ->with('customer:id,name')
                    ->latest()
                    ->take(10)
                    ->get(['id', 'reference', 'customer_id', 'grand_total', 'payment_status', 'sale_date']),
                'topProducts' => SaleItem::query()
                    ->selectRaw('product_id, sum(quantity) as total_qty, sum(line_total) as revenue')
                    ->with('product:id,name,sku')
                    ->groupBy('product_id')
                    ->orderByDesc('total_qty')
                    ->take(5)
                    ->get(),
                'revenueChart' => Sale::query()
                    ->selectRaw('date(sale_date) as date, sum(grand_total) as total')
                    ->where('sale_date', '>=', now()->subDays(6)->startOfDay())
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get(),
                'lowStockItems' => ProductStock::query()
                    ->with('product:id,name,sku,alert_quantity')
                    ->whereHas('product', fn ($query) => $query->whereColumn('product_stocks.quantity', '<=', 'products.alert_quantity'))
                    ->orWhere('quantity', '<=', 0)
                    ->latest()
                    ->take(10)
                    ->get()
                    ->map(fn (ProductStock $stock) => [
                        'id' => $stock->id,
                        'name' => $stock->product?->name ?? 'Unknown product',
                        'sku' => $stock->product?->sku ?? '-',
                        'stock' => (float) $stock->quantity,
                        'minStock' => (float) ($stock->product?->alert_quantity ?? 0),
                        'status' => $stock->quantity <= 0 ? 'Out of Stock' : 'Low Stock',
                    ]),
            ];
        });
    }
}
