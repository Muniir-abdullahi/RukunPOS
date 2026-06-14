<?php

namespace App\Services\Products;

use App\Models\TaxRate;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class TaxRateService
{
    use HandlesServiceExceptions;

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $perPage = min(max((int) ($filters['per_page'] ?? 25), 10), 100);

        return $this->tryCatch(fn () => TaxRate::query()
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->latest()
            ->paginate($perPage)
            ->through(fn (TaxRate $taxRate) => ['id' => $taxRate->id, 'name' => $taxRate->name, 'rate' => $taxRate->rate, 'status' => ucfirst($taxRate->status)])
            ->withQueryString());
    }

    public function create(array $data): TaxRate
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($data) {
            $taxRate = TaxRate::create(['name' => $data['name'], 'rate' => $data['rate'], 'status' => strtolower($data['status'] ?? 'active')]);
            AuditLogService::log(auth()->user(), 'Create', 'Tax Rate', $taxRate, [], $taxRate->toArray());

            return $taxRate;
        }));
    }

    public function update(TaxRate $taxRate, array $data): TaxRate
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($taxRate, $data) {
            $oldValues = $taxRate->toArray();
            $taxRate->update(['name' => $data['name'], 'rate' => $data['rate'], 'status' => strtolower($data['status'] ?? 'active')]);
            AuditLogService::log(auth()->user(), 'Update', 'Tax Rate', $taxRate, $oldValues, $taxRate->toArray());

            return $taxRate;
        }));
    }

    public function delete(TaxRate $taxRate): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($taxRate): void {
            $oldValues = $taxRate->toArray();
            $taxRate->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'Tax Rate', null, $oldValues, []);
        }));
    }
}
