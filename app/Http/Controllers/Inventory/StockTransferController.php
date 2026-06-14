<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\StoreStockTransferRequest;
use App\Http\Requests\Inventory\UpdateStockTransferRequest;
use App\Models\StockTransfer;
use App\Services\Inventory\StockTransferService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockTransferController extends Controller
{
    public function __construct(private readonly StockTransferService $stockTransferService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(function () use ($request) {
            $this->authorize('viewAny', StockTransfer::class);

            return Inertia::render('Modules/CrudPage', [
                ...$this->stockTransferService->pageData(),
                'filters' => $request->only('search', 'page', 'per_page'),
                'records' => Inertia::defer(fn () => $this->stockTransferService->getAll($request->all())),
            ]);
        });
    }

    public function create(): Response
    {
        return $this->tryCatch(function () {
            $this->authorize('create', StockTransfer::class);

            return Inertia::render('Modules/CrudPage', [...$this->stockTransferService->pageData(), 'action' => 'add']);
        });
    }

    public function show(StockTransfer $stockTransfer): Response
    {
        return $this->tryCatch(function () use ($stockTransfer) {
            $this->authorize('view', $stockTransfer);

            return Inertia::render('Modules/CrudPage', [
                ...$this->stockTransferService->pageData(),
                'action' => 'view',
                'id' => (string) $stockTransfer->id,
                'selectedRecord' => $this->stockTransferService->findForShow($stockTransfer),
            ]);
        });
    }

    public function edit(StockTransfer $stockTransfer): Response
    {
        return $this->tryCatch(function () use ($stockTransfer) {
            $this->authorize('update', $stockTransfer);

            return Inertia::render('Modules/CrudPage', [
                ...$this->stockTransferService->pageData(),
                'action' => 'edit',
                'id' => (string) $stockTransfer->id,
                'selectedRecord' => $this->stockTransferService->findForShow($stockTransfer),
            ]);
        });
    }

    public function store(StoreStockTransferRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->authorize('create', StockTransfer::class);
            $this->stockTransferService->process($request->validated());

            return back()->with('success', 'Stock transfer saved.');
        });
    }

    public function update(UpdateStockTransferRequest $request, StockTransfer $stockTransfer): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request, $stockTransfer) {
            $this->authorize('update', $stockTransfer);
            $this->stockTransferService->update($stockTransfer, $request->validated());

            return back()->with('success', 'Stock transfer updated.');
        });
    }

    public function destroy(StockTransfer $stockTransfer): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($stockTransfer) {
            $this->authorize('delete', $stockTransfer);
            $this->stockTransferService->delete($stockTransfer);

            return back()->with('success', 'Stock transfer deleted.');
        });
    }
}
