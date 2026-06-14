<?php

namespace App\Services\Inventory;

use App\Models\ProductStock;
use App\Models\StockMovement;
use Illuminate\Database\Eloquent\Model;

class StockMovementService
{
    public function apply(int $productId, int $warehouseId, float $quantity, string $type, ?Model $reference = null, ?float $unitCost = null, ?string $note = null): void
    {
        ProductStock::query()->firstOrCreate(
            ['product_id' => $productId, 'warehouse_id' => $warehouseId],
            ['quantity' => 0, 'reserved_quantity' => 0],
        )->increment('quantity', $quantity);

        StockMovement::create([
            'product_id' => $productId,
            'warehouse_id' => $warehouseId,
            'user_id' => auth()->id(),
            'reference_type' => $reference ? $reference::class : null,
            'reference_id' => $reference?->getKey(),
            'movement_type' => $type,
            'quantity' => $quantity,
            'unit_cost' => $unitCost,
            'note' => $note,
            'occurred_at' => now(),
        ]);
    }

    public function reverseFor(Model $reference): void
    {
        StockMovement::query()
            ->where('reference_type', $reference::class)
            ->where('reference_id', $reference->getKey())
            ->get()
            ->each(function (StockMovement $movement): void {
                ProductStock::query()->firstOrCreate(
                    ['product_id' => $movement->product_id, 'warehouse_id' => $movement->warehouse_id],
                    ['quantity' => 0, 'reserved_quantity' => 0],
                )->increment('quantity', -$movement->quantity);
                $movement->delete();
            });
    }
}
