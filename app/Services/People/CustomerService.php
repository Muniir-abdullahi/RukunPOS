<?php

namespace App\Services\People;

use App\Models\Customer;
use App\Models\CustomerGroup;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\Concerns\NormalizesPagination;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    use HandlesServiceExceptions, NormalizesPagination;

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        return $this->tryCatch(fn () => Customer::query()
            ->with('group:id,name')
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")->orWhere('phone', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
            }))
            ->when($filters['customer_group_id'] ?? null, fn ($query, $groupId) => $query->where('customer_group_id', $groupId))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', strtolower($status)))
            ->latest()
            ->paginate($this->perPage($filters))
            ->through(fn (Customer $customer) => $this->toRow($customer))
            ->withQueryString());
    }

    public function findForShow(Customer $customer): array
    {
        return $this->tryCatch(fn () => $this->toRow($customer->load('group')));
    }

    public function recentSales(Customer $customer, array $filters = []): LengthAwarePaginator
    {
        return $this->tryCatch(fn () => $customer->sales()
            ->latest()
            ->paginate($this->perPage($filters))
            ->withQueryString());
    }

    public function formOptions(): array
    {
        return $this->tryCatch(fn () => ['customerGroups' => CustomerGroup::query()->active()->orderBy('name')->get(['id', 'name'])]);
    }

    public function create(array $data): Customer
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($data) {
            $customer = Customer::create($this->normalize($data));
            AuditLogService::log(auth()->user(), 'Create', 'Customer', $customer, [], $customer->toArray());

            return $customer;
        }));
    }

    public function update(Customer $customer, array $data): Customer
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($customer, $data) {
            $old = $customer->toArray();
            $customer->update($this->normalize($data));
            AuditLogService::log(auth()->user(), 'Update', 'Customer', $customer, $old, $customer->toArray());

            return $customer;
        }));
    }

    public function delete(Customer $customer): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($customer): void {
            $old = $customer->toArray();
            $customer->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'Customer', null, $old, []);
        }));
    }

    private function toRow(Customer $customer): array
    {
        return [
            'id' => $customer->id,
            'name' => $customer->name,
            'company' => $customer->company,
            'email' => $customer->email,
            'phone' => $customer->phone,
            'group' => $customer->group?->name,
            'customer_group_id' => $customer->customer_group_id,
            'credit_limit' => (float) ($customer->credit_limit ?? 0),
            'opening_balance' => (float) $customer->opening_balance,
            'status' => ucfirst($customer->status),
        ];
    }

    private function normalize(array $data): array
    {
        return [...$data, 'status' => strtolower($data['status'] ?? 'active')];
    }
}
