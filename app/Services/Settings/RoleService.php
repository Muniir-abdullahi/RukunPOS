<?php

namespace App\Services\Settings;

use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleService
{
    use HandlesServiceExceptions;

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $perPage = min(max((int) ($filters['per_page'] ?? 25), 10), 100);

        return $this->tryCatch(fn () => Role::query()
            ->with('permissions:id,name')
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->latest()
            ->paginate($perPage)
            ->through(fn (Role $role) => [
                'id' => $role->id,
                'name' => $role->name,
                'description' => $role->permissions->pluck('name')->join(', '),
                'permissions' => $role->permissions->pluck('name')->values(),
            ])
            ->withQueryString());
    }

    public function permissions(): array
    {
        return $this->tryCatch(fn () => Permission::query()->orderBy('name')->pluck('name')->all());
    }

    public function create(array $data): Role
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($data) {
            $role = Role::create(['name' => $data['name'], 'guard_name' => 'web']);
            $role->syncPermissions($data['permissions'] ?? []);
            app(PermissionRegistrar::class)->forgetCachedPermissions();
            AuditLogService::log(auth()->user(), 'Create', 'Role', $role, [], $role->toArray());

            return $role;
        }));
    }

    public function update(Role $role, array $data): Role
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($role, $data) {
            $oldValues = $role->load('permissions')->toArray();
            $role->update(['name' => $data['name']]);
            $role->syncPermissions($data['permissions'] ?? []);
            app(PermissionRegistrar::class)->forgetCachedPermissions();
            AuditLogService::log(auth()->user(), 'Update', 'Role', $role, $oldValues, $role->fresh('permissions')->toArray());

            return $role;
        }));
    }

    public function delete(Role $role): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($role): void {
            $oldValues = $role->load('permissions')->toArray();
            $role->delete();
            app(PermissionRegistrar::class)->forgetCachedPermissions();
            AuditLogService::log(auth()->user(), 'Delete', 'Role', null, $oldValues, []);
        }));
    }
}
