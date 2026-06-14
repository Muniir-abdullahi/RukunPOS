<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Http\Requests\Products\StoreUnitRequest;
use App\Http\Requests\Products\UpdateUnitRequest;
use App\Models\Unit;
use App\Services\Products\UnitService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UnitController extends Controller
{
    public function __construct(private readonly UnitService $unitService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(function () use ($request) {
            $this->authorize('viewAny', Unit::class);

            return Inertia::render('Inventory/Taxonomy', ['type' => 'Unit', 'filters' => $request->only('search', 'page', 'per_page'), 'records' => Inertia::defer(fn () => $this->unitService->getAll($request->all()))]);
        });
    }

    public function create(): Response
    {
        return $this->tryCatch(function () {
            $this->authorize('create', Unit::class);

            return Inertia::render('Inventory/Taxonomy', ['type' => 'Unit', 'selectedRecord' => null]);
        });
    }

    public function show(Unit $unit): Response
    {
        return $this->tryCatch(function () use ($unit) {
            $this->authorize('view', $unit);

            return Inertia::render('Inventory/Taxonomy', ['type' => 'Unit', 'selectedRecord' => $unit]);
        });
    }

    public function edit(Unit $unit): Response
    {
        return $this->tryCatch(function () use ($unit) {
            $this->authorize('update', $unit);

            return Inertia::render('Inventory/Taxonomy', ['type' => 'Unit', 'selectedRecord' => $unit, 'editing' => true]);
        });
    }

    public function store(StoreUnitRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->authorize('create', Unit::class);
            $this->unitService->create($request->validated());

            return back()->with('success', 'Unit created.');
        });
    }

    public function update(UpdateUnitRequest $request, Unit $unit): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request, $unit) {
            $this->authorize('update', $unit);
            $this->unitService->update($unit, $request->validated());

            return back()->with('success', 'Unit updated.');
        });
    }

    public function destroy(Unit $unit): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($unit) {
            $this->authorize('delete', $unit);
            $this->unitService->delete($unit);

            return back()->with('success', 'Unit deleted.');
        });
    }
}
