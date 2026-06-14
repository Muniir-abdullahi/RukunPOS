<?php

namespace App\Services\Sales;

use App\Models\Product;
use App\Services\Concerns\HandlesServiceExceptions;

class POSService
{
    use HandlesServiceExceptions;

    public function getProducts(int $warehouseId)
    {
        return $this->tryCatch(fn () => Product::query()
            ->active()
            ->with(['category:id,name'])
            ->whereHas('stocks', fn ($query) => $query->where('warehouse_id', $warehouseId)->where('quantity', '>', 0))
            ->withSum(['stocks as current_stock' => fn ($query) => $query->where('warehouse_id', $warehouseId)], 'quantity')
            ->orderBy('name')
            ->get(['id', 'category_id', 'name', 'sku', 'barcode', 'selling_price', 'image_path'])
            ->map(fn (Product $product) => ['id' => $product->id, 'name' => $product->name, 'sku' => $product->sku, 'barcode' => $product->barcode, 'selling_price' => (float) $product->selling_price, 'image_path' => $product->image_path, 'stock' => (float) $product->current_stock, 'category' => $product->category]));
    }
}
