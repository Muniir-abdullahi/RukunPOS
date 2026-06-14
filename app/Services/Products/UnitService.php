<?php

namespace App\Services\Products;

use App\Models\Unit;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class UnitService
{
    use HandlesServiceExceptions;

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $perPage = min(max((int) ($filters['per_page'] ?? 25), 10), 100);

        return $this->tryCatch(fn () => Unit::query()
            ->with('baseUnit:id,name')
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where('name', 'like', "%{$search}%")->orWhere('code', 'like', "%{$search}%"))
            ->latest()
            ->paginate($perPage)
            ->through(fn (Unit $unit) => [
                'id' => $unit->id,
                'name' => $unit->name,
                'code' => $unit->code,
                'shortName' => $unit->short_name,
                'baseUnit' => $unit->baseUnit?->name,
                'base_unit_id' => $unit->base_unit_id,
                'status' => ucfirst($unit->status),
            ])
            ->withQueryString());
    }

    public function create(array $data): Unit
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($data) {
            $unit = Unit::create($this->normalize($data));
            AuditLogService::log(auth()->user(), 'Create', 'Unit', $unit, [], $unit->toArray());

            return $unit;
        }));
    }

    public function update(Unit $unit, array $data): Unit
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($unit, $data) {
            $oldValues = $unit->toArray();
            $unit->update($this->normalize($data));
            AuditLogService::log(auth()->user(), 'Update', 'Unit', $unit, $oldValues, $unit->toArray());

            return $unit;
        }));
    }

    public function delete(Unit $unit): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($unit): void {
            $oldValues = $unit->toArray();
            $unit->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'Unit', null, $oldValues, []);
        }));
    }

    private function normalize(array $data): array
    {
        return $this->tryCatch(fn () => [
            'base_unit_id' => $data['base_unit_id'] ?? null,
            'name' => $data['name'],
            'code' => $data['code'] ?? $data['shortName'] ?? $data['short_name'],
            'short_name' => $data['short_name'] ?? $data['shortName'] ?? null,
            'status' => strtolower($data['status'] ?? 'active'),
        ]);
    }
}
