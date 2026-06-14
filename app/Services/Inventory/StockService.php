<?php

namespace App\Services\Inventory;

use App\Models\Product;
use App\Models\ProductStock;
use App\Services\Concerns\HandlesServiceExceptions;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class StockService
{
    use HandlesServiceExceptions;

    public function overview(array $filters = []): LengthAwarePaginator
    {
        $perPage = min(max((int) ($filters['per_page'] ?? 25), 10), 100);
        $stockSum = '(select coalesce(sum(quantity), 0) from product_stocks where product_stocks.product_id = products.id)';

        return $this->tryCatch(fn () => Product::query()
            ->with(['category:id,name', 'unit:id,name,short_name'])
            ->withSum('stocks as stock_quantity', 'quantity')
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            }))
            ->when(($filters['status'] ?? null) === 'low', fn ($query) => $query
                ->whereRaw("{$stockSum} > 0")
                ->whereRaw("{$stockSum} <= products.alert_quantity"))
            ->when(($filters['status'] ?? null) === 'out', fn ($query) => $query
                ->whereRaw("{$stockSum} <= 0"))
            ->orderBy('name')
            ->paginate($perPage)
            ->through(fn (Product $product) => [
                'id' => (string) $product->id,
                'image' => $product->image_path ?: 'https://placehold.co/150x150/eff6ff/1e40af?text=Product',
                'name' => $product->name,
                'sku' => $product->sku,
                'categoryId' => $product->category_id ? (string) $product->category_id : '',
                'category' => $product->category?->name,
                'unitId' => $product->unit_id ? (string) $product->unit_id : '',
                'costPrice' => (float) $product->cost_price,
                'stock' => (float) ($product->stock_quantity ?? 0),
                'minStock' => (float) $product->alert_quantity,
                'status' => ucfirst($product->status),
            ])
            ->withQueryString());
    }

    public function getCurrentStock(int $productId, int $warehouseId): float
    {
        return $this->tryCatch(fn () => (float) ProductStock::query()
            ->where('product_id', $productId)
            ->where('warehouse_id', $warehouseId)
            ->value('quantity'));
    }
}
