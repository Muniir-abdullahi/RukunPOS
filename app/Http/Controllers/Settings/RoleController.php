<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\StoreRoleRequest;
use App\Http\Requests\Settings\UpdateRoleRequest;
use App\Services\Settings\RoleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function __construct(private readonly RoleService $roleService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(function () use ($request) {
            $this->authorize('viewAny', Role::class);

            return Inertia::render('Modules/CrudPage', ['module' => 'roles', 'filters' => $request->only('search', 'page', 'per_page'), 'records' => Inertia::defer(fn () => $this->roleService->getAll($request->all())), 'permissions' => $this->roleService->permissions()]);
        });
    }

    public function create(): Response
    {
        return $this->tryCatch(function () {
            $this->authorize('create', Role::class);

            return Inertia::render('Modules/CrudPage', ['module' => 'roles', 'action' => 'add', 'permissions' => $this->roleService->permissions()]);
        });
    }

    public function show(Role $role): Response
    {
        return $this->tryCatch(function () use ($role) {
            $this->authorize('view', $role);

            return Inertia::render('Modules/CrudPage', ['module' => 'roles', 'action' => 'view', 'id' => (string) $role->id, 'records' => ['data' => [$role]]]);
        });
    }

    public function edit(Role $role): Response
    {
        return $this->tryCatch(function () use ($role) {
            $this->authorize('update', $role);

            return Inertia::render('Modules/CrudPage', ['module' => 'roles', 'action' => 'edit', 'id' => (string) $role->id, 'records' => ['data' => [$role]], 'permissions' => $this->roleService->permissions()]);
        });
    }

    public function store(StoreRoleRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->authorize('create', Role::class);
            $this->roleService->create($request->validated());

            return back()->with('success', 'Role created.');
        });
    }

    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request, $role) {
            $this->authorize('update', $role);
            $this->roleService->update($role, $request->validated());

            return back()->with('success', 'Role updated.');
        });
    }

    public function destroy(Role $role): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($role) {
            $this->authorize('delete', $role);
            $this->roleService->delete($role);

            return back()->with('success', 'Role deleted.');
        });
    }
}
