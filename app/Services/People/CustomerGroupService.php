<?php

namespace App\Services\People;

use App\Models\CustomerGroup;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\Concerns\NormalizesPagination;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CustomerGroupService
{
    use HandlesServiceExceptions, NormalizesPagination;

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        return $this->tryCatch(fn () => CustomerGroup::query()
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->latest()
            ->paginate($this->perPage($filters))
            ->withQueryString());
    }

    public function options()
    {
        return $this->tryCatch(fn () => CustomerGroup::query()->active()->orderBy('name')->get(['id', 'name']));
    }

    public function create(array $data): CustomerGroup
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($data) {
            $group = CustomerGroup::create($this->normalize($data));
            AuditLogService::log(auth()->user(), 'Create', 'Customer Group', $group, [], $group->toArray());

            return $group;
        }));
    }

    public function update(CustomerGroup $customerGroup, array $data): CustomerGroup
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($customerGroup, $data) {
            $old = $customerGroup->toArray();
            $customerGroup->update($this->normalize($data));
            AuditLogService::log(auth()->user(), 'Update', 'Customer Group', $customerGroup, $old, $customerGroup->toArray());

            return $customerGroup;
        }));
    }

    public function delete(CustomerGroup $customerGroup): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($customerGroup): void {
            $old = $customerGroup->toArray();
            $customerGroup->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'Customer Group', null, $old, []);
        }));
    }

    private function normalize(array $data): array
    {
        return ['name' => $data['name'], 'description' => $data['description'] ?? null, 'status' => strtolower($data['status'] ?? 'active')];
    }
}
