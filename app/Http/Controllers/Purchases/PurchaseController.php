<?php

namespace App\Http\Controllers\Purchases;

use App\Http\Controllers\Controller;
use App\Http\Requests\Purchases\StorePurchaseRequest;
use App\Http\Requests\Purchases\UpdatePurchaseRequest;
use App\Models\Purchase;
use App\Services\Purchases\PurchaseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseController extends Controller
{
    public function __construct(private readonly PurchaseService $purchaseService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/Purchases/Index', ['filters' => $request->only('search', 'supplier_id', 'status', 'payment_status', 'date_from', 'date_to', 'page', 'per_page'), 'purchases' => Inertia::defer(fn () => $this->purchaseService->getAll($request->all())), ...$this->purchaseService->formOptions()]));
    }

    public function create(): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/Purchases/Create', $this->purchaseService->formOptions()));
    }

    public function store(StorePurchaseRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->purchaseService->create($request->validated());

            return redirect()->route('purchases.index')->with('success', 'Purchase created.');
        });
    }

    public function show(Purchase $purchase): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/Purchases/Show', ['purchase' => $this->purchaseService->findForShow($purchase)]));
    }

    public function edit(Purchase $purchase): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/Purchases/Create', ['purchase' => $this->purchaseService->findForShow($purchase), ...$this->purchaseService->formOptions()]));
    }

    public function update(UpdatePurchaseRequest $request, Purchase $purchase): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request, $purchase) {
            $this->purchaseService->update($purchase, $request->validated());

            return redirect()->route('purchases.index')->with('success', 'Purchase updated.');
        });
    }

    public function destroy(Purchase $purchase): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($purchase) {
            $this->purchaseService->delete($purchase);

            return back()->with('success', 'Purchase deleted.');
        });
    }
}
