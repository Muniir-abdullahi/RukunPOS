<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\StoreWarehouseRequest;
use App\Http\Requests\Settings\UpdateWarehouseRequest;
use App\Models\Warehouse;
use App\Services\Settings\WarehouseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WarehouseController extends Controller
{
    public function __construct(private readonly WarehouseService $warehouseService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(function () use ($request) {
            $this->authorize('viewAny', Warehouse::class);

            return Inertia::render('Modules/CrudPage', ['module' => 'warehouses', 'filters' => $request->only('search', 'page', 'per_page'), 'records' => Inertia::defer(fn () => $this->warehouseService->getAll($request->all()))]);
        });
    }

    public function create(): Response
    {
        return $this->tryCatch(function () {
            $this->authorize('create', Warehouse::class);

            return Inertia::render('Modules/CrudPage', ['module' => 'warehouses', 'action' => 'add']);
        });
    }

    public function show(Warehouse $warehouse): Response
    {
        return $this->tryCatch(function () use ($warehouse) {
            $this->authorize('view', $warehouse);

            return Inertia::render('Modules/CrudPage', ['module' => 'warehouses', 'action' => 'view', 'id' => (string) $warehouse->id, 'records' => ['data' => [$warehouse]]]);
        });
    }

    public function edit(Warehouse $warehouse): Response
    {
        return $this->tryCatch(function () use ($warehouse) {
            $this->authorize('update', $warehouse);

            return Inertia::render('Modules/CrudPage', ['module' => 'warehouses', 'action' => 'edit', 'id' => (string) $warehouse->id, 'records' => ['data' => [$warehouse]]]);
        });
    }

    public function store(StoreWarehouseRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->authorize('create', Warehouse::class);
            $this->warehouseService->create($request->validated());

            return back()->with('success', 'Warehouse created.');
        });
    }

    public function update(UpdateWarehouseRequest $request, Warehouse $warehouse): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request, $warehouse) {
            $this->authorize('update', $warehouse);
            $this->warehouseService->update($warehouse, $request->validated());

            return back()->with('success', 'Warehouse updated.');
        });
    }

    public function destroy(Warehouse $warehouse): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($warehouse) {
            $this->authorize('delete', $warehouse);
            $this->warehouseService->delete($warehouse);

            return back()->with('success', 'Warehouse deleted.');
        });
    }
}
