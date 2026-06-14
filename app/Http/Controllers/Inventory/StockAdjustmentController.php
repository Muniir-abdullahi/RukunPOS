<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StoreStockAdjustmentRequest;
use App\Http\Requests\Inventory\UpdateStockAdjustmentRequest;
use App\Models\StockAdjustment;
use App\Services\Inventory\StockAdjustmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockAdjustmentController extends Controller
{
    public function __construct(private readonly StockAdjustmentService $stockAdjustmentService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(function () use ($request) {
            $this->authorize('viewAny', StockAdjustment::class);

            return Inertia::render('Inventory/Adjustments', [
                ...$this->stockAdjustmentService->pageData(),
                'filters' => $request->only('search', 'page', 'per_page'),
                'adjustments' => Inertia::defer(fn () => $this->stockAdjustmentService->getAll($request->all())),
            ]);
        });
    }

    public function create(): Response
    {
        return $this->tryCatch(function () {
            $this->authorize('create', StockAdjustment::class);

            return Inertia::render('Inventory/Adjustments', $this->stockAdjustmentService->pageData());
        });
    }

    public function show(StockAdjustment $stockAdjustment): Response
    {
        return $this->tryCatch(function () use ($stockAdjustment) {
            $this->authorize('view', $stockAdjustment);

            return Inertia::render('Inventory/Adjustments', [
                ...$this->stockAdjustmentService->pageData(),
                'selectedAdjustment' => $this->stockAdjustmentService->findForShow($stockAdjustment),
            ]);
        });
    }

    public function edit(StockAdjustment $stockAdjustment): Response
    {
        return $this->tryCatch(function () use ($stockAdjustment) {
            $this->authorize('update', $stockAdjustment);

            return Inertia::render('Inventory/Adjustments', [
                ...$this->stockAdjustmentService->pageData(),
                'selectedAdjustment' => $this->stockAdjustmentService->findForShow($stockAdjustment),
                'editing' => true,
            ]);
        });
    }

    public function store(StoreStockAdjustmentRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->authorize('create', StockAdjustment::class);
            $this->stockAdjustmentService->process($request->validated());

            return back()->with('success', 'Stock adjustment saved.');
        });
    }

    public function update(UpdateStockAdjustmentRequest $request, StockAdjustment $stockAdjustment): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request, $stockAdjustment) {
            $this->authorize('update', $stockAdjustment);
            $this->stockAdjustmentService->update($stockAdjustment, $request->validated());

            return back()->with('success', 'Stock adjustment updated.');
        });
    }

    public function destroy(StockAdjustment $stockAdjustment): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($stockAdjustment) {
            $this->authorize('delete', $stockAdjustment);
            $this->stockAdjustmentService->delete($stockAdjustment);

            return back()->with('success', 'Stock adjustment deleted.');
        });
    }
}
