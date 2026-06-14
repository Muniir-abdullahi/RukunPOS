<?php

namespace App\Http\Controllers\Purchases;

use App\Http\Controllers\Controller;
use App\Http\Requests\Purchases\StorePurchaseReturnRequest;
use App\Models\PurchaseReturn;
use App\Services\Purchases\PurchaseReturnService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseReturnController extends Controller
{
    public function __construct(private readonly PurchaseReturnService $purchaseReturnService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/Purchases/Returns', ['filters' => $request->only('search', 'page', 'per_page'), 'returns' => Inertia::defer(fn () => $this->purchaseReturnService->getAll($request->all())), ...$this->purchaseReturnService->formOptions()]));
    }

    public function create(): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/Purchases/ReturnCreate', $this->purchaseReturnService->formOptions()));
    }

    public function store(StorePurchaseReturnRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->purchaseReturnService->create($request->validated());

            return redirect()->route('purchase-returns.index')->with('success', 'Purchase return created.');
        });
    }

    public function show(PurchaseReturn $purchaseReturn): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/Purchases/ReturnCreate', ['purchaseReturn' => $purchaseReturn->load('items.product'), ...$this->purchaseReturnService->formOptions()]));
    }

    public function destroy(PurchaseReturn $purchaseReturn): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($purchaseReturn) {
            $this->purchaseReturnService->delete($purchaseReturn);

            return back()->with('success', 'Purchase return deleted.');
        });
    }
}
