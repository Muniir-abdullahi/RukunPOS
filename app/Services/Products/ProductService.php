<?php

namespace App\Services\Products;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductStock;
use App\Models\TaxRate;
use App\Models\Unit;
use App\Models\Warehouse;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ProductService
{
    use HandlesServiceExceptions;

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $perPage = min(max((int) ($filters['per_page'] ?? 25), 10), 100);

        return $this->tryCatch(fn () => Product::query()
            ->with(['category:id,name', 'brand:id,name', 'unit:id,name,short_name', 'stocks.warehouse:id,name'])
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where('name', 'like', "%{$search}%")->orWhere('sku', 'like', "%{$search}%"))
            ->when($filters['category_id'] ?? null, fn ($query, $categoryId) => $query->where('category_id', $categoryId))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', strtolower($status)))
            ->latest()
            ->paginate($perPage)
            ->through(fn (Product $product) => $this->toPageData($product))
            ->withQueryString());
    }

    public function findForShow(Product $product): array
    {
        return $this->tryCatch(fn () => $this->toPageData($product->load(['category', 'brand', 'unit', 'stocks.warehouse', 'stockMovements'])));
    }

    public function formOptions(): array
    {
        return $this->tryCatch(fn () => [
            'categories' => Category::query()->active()->orderBy('name')->get(['id', 'name']),
            'brands' => Brand::query()->active()->orderBy('name')->get(['id', 'name']),
            'units' => Unit::query()->active()->orderBy('name')->get(['id', 'name', 'short_name']),
            'taxRates' => TaxRate::query()->active()->orderBy('name')->get(['id', 'name', 'rate']),
            'warehouses' => Warehouse::query()->active()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function create(array $data): Product
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($data) {
            $product = Product::create($this->normalize($data));
            Warehouse::query()->select('id')->each(fn (Warehouse $warehouse) => ProductStock::firstOrCreate(
                ['product_id' => $product->id, 'warehouse_id' => $warehouse->id],
                ['quantity' => 0, 'reserved_quantity' => 0],
            ));
            AuditLogService::log(auth()->user(), 'Create', 'Product', $product, [], $product->toArray());

            return $product;
        }));
    }

    public function update(Product $product, array $data): Product
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($product, $data) {
            $oldValues = $product->toArray();
            $product->update($this->normalize($data));
            AuditLogService::log(auth()->user(), 'Update', 'Product', $product, $oldValues, $product->toArray());

            return $product;
        }));
    }

    public function delete(Product $product): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($product): void {
            $oldValues = $product->toArray();
            $product->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'Product', null, $oldValues, []);
        }));
    }

    public function toPageData(Product $product): array
    {
        return $this->tryCatch(fn () => [
            'id' => (string) $product->id,
            'image' => $product->image_path ?: 'https://placehold.co/150x150/eff6ff/1e40af?text=Product',
            'name' => $product->name,
            'sku' => $product->sku,
            'barcode' => $product->barcode,
            'categoryId' => $product->category_id ? (string) $product->category_id : '',
            'category' => $product->category?->name,
            'brandId' => $product->brand_id ? (string) $product->brand_id : '',
            'brand' => $product->brand?->name,
            'unitId' => $product->unit_id ? (string) $product->unit_id : '',
            'unit' => $product->unit?->short_name,
            'costPrice' => (float) $product->cost_price,
            'sellingPrice' => (float) $product->selling_price,
            'stock' => (float) $product->stocks->sum('quantity'),
            'minStock' => (float) $product->alert_quantity,
            'description' => $product->description,
            'status' => ucfirst($product->status),
            'stocks' => $product->stocks->map(fn (ProductStock $stock) => [
                'warehouse' => $stock->warehouse?->name,
                'quantity' => (float) $stock->quantity,
            ])->values(),
        ]);
    }

    private function normalize(array $data): array
    {
        return $this->tryCatch(fn () => [
            'category_id' => $data['category_id'] ?? $data['categoryId'] ?? null,
            'brand_id' => $data['brand_id'] ?? $data['brandId'] ?? null,
            'unit_id' => $data['unit_id'] ?? $data['unitId'] ?? null,
            'sale_unit_id' => $data['sale_unit_id'] ?? $data['unit_id'] ?? $data['unitId'] ?? null,
            'purchase_unit_id' => $data['purchase_unit_id'] ?? $data['unit_id'] ?? $data['unitId'] ?? null,
            'tax_rate_id' => $data['tax_rate_id'] ?? null,
            'type' => $data['type'] ?? 'standard',
            'name' => $data['name'],
            'sku' => $data['sku'],
            'barcode' => $data['barcode'] ?? null,
            'image_path' => $data['image_path'] ?? $data['image'] ?? null,
            'cost_price' => $data['cost_price'] ?? $data['costPrice'] ?? 0,
            'selling_price' => $data['selling_price'] ?? $data['sellingPrice'] ?? 0,
            'alert_quantity' => $data['alert_quantity'] ?? $data['minStock'] ?? 0,
            'description' => $data['description'] ?? null,
            'status' => strtolower($data['status'] ?? 'active'),
        ]);
    }
}
