<?php

namespace App\Http\Controllers\People;

use App\Http\Controllers\Controller;
use App\Http\Requests\People\StoreUserRequest;
use App\Http\Requests\People\UpdateUserRequest;
use App\Models\User;
use App\Services\People\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(private readonly UserService $userService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(function () use ($request) {
            $this->authorize('viewAny', User::class);

            return Inertia::render('Modules/CrudPage', ['module' => 'users', 'filters' => $request->only('search', 'status', 'page', 'per_page'), 'records' => Inertia::defer(fn () => $this->userService->getAll($request->all())), 'roles' => $this->userService->roles()]);
        });
    }

    public function create(): Response
    {
        return $this->tryCatch(function () {
            $this->authorize('create', User::class);

            return Inertia::render('Modules/CrudPage', ['module' => 'users', 'action' => 'add', 'roles' => $this->userService->roles()]);
        });
    }

    public function show(User $user): Response
    {
        return $this->tryCatch(function () use ($user) {
            $this->authorize('view', $user);

            return Inertia::render('Modules/CrudPage', ['module' => 'users', 'action' => 'view', 'id' => (string) $user->id, 'records' => ['data' => [$user->load('roles')]], 'roles' => $this->userService->roles()]);
        });
    }

    public function edit(User $user): Response
    {
        return $this->tryCatch(function () use ($user) {
            $this->authorize('update', $user);

            return Inertia::render('Modules/CrudPage', ['module' => 'users', 'action' => 'edit', 'id' => (string) $user->id, 'records' => ['data' => [$user->load('roles')]], 'roles' => $this->userService->roles()]);
        });
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->authorize('create', User::class);
            $this->userService->create($request->validated());

            return back()->with('success', 'User created.');
        });
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request, $user) {
            $this->authorize('update', $user);
            $this->userService->update($user, $request->validated());

            return back()->with('success', 'User updated.');
        });
    }

    public function updateStatus(User $user): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($user) {
            $this->authorize('update', $user);
            $this->userService->updateStatus($user);

            return back()->with('success', 'User status updated.');
        });
    }

    public function destroy(User $user): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($user) {
            $this->authorize('delete', $user);
            $this->userService->delete($user);

            return back()->with('success', 'User deleted.');
        });
    }
}
