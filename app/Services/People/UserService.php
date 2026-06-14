<?php

namespace App\Services\People;

use App\Models\User;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserService
{
    use HandlesServiceExceptions;

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $perPage = min(max((int) ($filters['per_page'] ?? 25), 10), 100);

        return $this->tryCatch(fn () => User::query()
            ->with('roles:id,name')
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate($perPage)
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->roles->pluck('name')->first(),
                'roles' => $user->roles->pluck('name')->values(),
                'status' => ucfirst($user->status),
            ])
            ->withQueryString());
    }

    public function roles(): array
    {
        return $this->tryCatch(fn () => Role::query()->orderBy('name')->pluck('name')->all());
    }

    public function create(array $data): User
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($data) {
            $user = User::create([...Arr::except($data, ['role', 'roles']), 'password' => Hash::make($data['password'])]);
            $user->syncRoles(Arr::wrap($data['role'] ?? $data['roles'] ?? []));
            AuditLogService::log(auth()->user(), 'Create', 'User', $user, [], $user->toArray());

            return $user;
        }));
    }

    public function update(User $user, array $data): User
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($user, $data) {
            $oldValues = $user->load('roles')->toArray();
            $payload = Arr::except($data, ['role', 'roles', 'password']);
            $user->update(($data['password'] ?? null) ? [...$payload, 'password' => Hash::make($data['password'])] : $payload);
            $user->syncRoles(Arr::wrap($data['role'] ?? $data['roles'] ?? []));
            AuditLogService::log(auth()->user(), 'Update', 'User', $user, $oldValues, $user->fresh('roles')->toArray());

            return $user;
        }));
    }

    public function updateStatus(User $user): User
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($user) {
            $oldValues = $user->toArray();
            $user->update(['status' => $user->status === 'active' ? 'inactive' : 'active']);
            AuditLogService::log(auth()->user(), 'Update Status', 'User', $user, $oldValues, $user->toArray());

            return $user;
        }));
    }

    public function delete(User $user): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($user): void {
            $oldValues = $user->load('roles')->toArray();
            $user->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'User', null, $oldValues, []);
        }));
    }
}
