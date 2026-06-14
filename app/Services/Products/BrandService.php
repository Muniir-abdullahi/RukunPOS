<?php

namespace App\Services\Products;

use App\Models\Brand;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class BrandService
{
    use HandlesServiceExceptions;

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $perPage = min(max((int) ($filters['per_page'] ?? 25), 10), 100);

        return $this->tryCatch(fn () => Brand::query()
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->latest()
            ->paginate($perPage)
            ->through(fn (Brand $brand) => [
                'id' => $brand->id,
                'name' => $brand->name,
                'description' => $brand->description,
                'status' => ucfirst($brand->status),
            ])
            ->withQueryString());
    }

    public function create(array $data): Brand
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($data) {
            $brand = Brand::create(['name' => $data['name'], 'description' => $data['description'] ?? null, 'status' => strtolower($data['status'] ?? 'active')]);
            AuditLogService::log(auth()->user(), 'Create', 'Brand', $brand, [], $brand->toArray());

            return $brand;
        }));
    }

    public function update(Brand $brand, array $data): Brand
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($brand, $data) {
            $oldValues = $brand->toArray();
            $brand->update(['name' => $data['name'], 'description' => $data['description'] ?? null, 'status' => strtolower($data['status'] ?? 'active')]);
            AuditLogService::log(auth()->user(), 'Update', 'Brand', $brand, $oldValues, $brand->toArray());

            return $brand;
        }));
    }

    public function delete(Brand $brand): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($brand): void {
            $oldValues = $brand->toArray();
            $brand->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'Brand', null, $oldValues, []);
        }));
    }
}
