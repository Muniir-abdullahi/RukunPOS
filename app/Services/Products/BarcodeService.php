<?php

namespace App\Services\Products;

use App\Models\Product;
use App\Services\Concerns\HandlesServiceExceptions;
use Illuminate\Database\Eloquent\Collection;

class BarcodeService
{
    use HandlesServiceExceptions;

    public function getForPrinting(array $ids = []): Collection
    {
        return $this->tryCatch(fn () => Product::query()
            ->when($ids !== [], fn ($query) => $query->whereIn('id', $ids))
            ->orderBy('name')
            ->get(['id', 'name', 'sku', 'barcode', 'selling_price']));
    }
}
