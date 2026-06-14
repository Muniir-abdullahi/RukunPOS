<?php

namespace App\Services\People;

use App\Models\Supplier;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\Concerns\NormalizesPagination;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class SupplierService
{
    use HandlesServiceExceptions, NormalizesPagination;

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        return $this->tryCatch(fn () => Supplier::query()
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")->orWhere('company', 'like', "%{$search}%")->orWhere('phone', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
            }))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', strtolower($status)))
            ->latest()
            ->paginate($this->perPage($filters))
            ->withQueryString());
    }

    public function findForShow(Supplier $supplier): array
    {
        return $this->tryCatch(fn () => $supplier->toArray());
    }

    public function recentPurchases(Supplier $supplier, array $filters = []): LengthAwarePaginator
    {
        return $this->tryCatch(fn () => $supplier->purchases()->latest()->paginate($this->perPage($filters))->withQueryString());
    }

    public function create(array $data): Supplier
    {
        return $this->write(new Supplier, $data, 'Create');
    }

    public function update(Supplier $supplier, array $data): Supplier
    {
        return $this->write($supplier, $data, 'Update');
    }

    public function delete(Supplier $supplier): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($supplier): void {
            $old = $supplier->toArray();
            $supplier->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'Supplier', null, $old, []);
        }));
    }

    private function write(Supplier $supplier, array $data, string $action): Supplier
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($supplier, $data, $action) {
            $old = $supplier->exists ? $supplier->toArray() : [];
            $supplier->fill([...$data, 'status' => strtolower($data['status'] ?? 'active')])->save();
            AuditLogService::log(auth()->user(), $action, 'Supplier', $supplier, $old, $supplier->toArray());

            return $supplier;
        }));
    }
}
