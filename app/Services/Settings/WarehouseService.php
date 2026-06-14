<?php

namespace App\Services\Settings;

use App\Models\Warehouse;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class WarehouseService
{
    use HandlesServiceExceptions;

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $perPage = min(max((int) ($filters['per_page'] ?? 25), 10), 100);

        return $this->tryCatch(fn () => Warehouse::query()
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where('name', 'like', "%{$search}%")->orWhere('city', 'like', "%{$search}%"))
            ->latest()
            ->paginate($perPage)
            ->through(fn (Warehouse $warehouse) => [
                'id' => $warehouse->id,
                'name' => $warehouse->name,
                'phone' => $warehouse->phone,
                'email' => $warehouse->email,
                'address' => $warehouse->address,
                'city' => $warehouse->city,
                'zipCode' => $warehouse->zip_code,
                'status' => ucfirst($warehouse->status),
            ])
            ->withQueryString());
    }

    public function create(array $data): Warehouse
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($data) {
            $warehouse = Warehouse::create($this->normalize($data));
            AuditLogService::log(auth()->user(), 'Create', 'Warehouse', $warehouse, [], $warehouse->toArray());

            return $warehouse;
        }));
    }

    public function update(Warehouse $warehouse, array $data): Warehouse
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($warehouse, $data) {
            $oldValues = $warehouse->toArray();
            $warehouse->update($this->normalize($data));
            AuditLogService::log(auth()->user(), 'Update', 'Warehouse', $warehouse, $oldValues, $warehouse->toArray());

            return $warehouse;
        }));
    }

    public function delete(Warehouse $warehouse): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($warehouse): void {
            $oldValues = $warehouse->toArray();
            $warehouse->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'Warehouse', null, $oldValues, []);
        }));
    }

    private function normalize(array $data): array
    {
        return $this->tryCatch(fn () => [
            'name' => $data['name'],
            'phone' => $data['phone'] ?? null,
            'email' => $data['email'] ?? null,
            'address' => $data['address'] ?? null,
            'city' => $data['city'] ?? null,
            'zip_code' => $data['zip_code'] ?? $data['zipCode'] ?? null,
            'status' => strtolower($data['status'] ?? 'active'),
        ]);
    }
}
