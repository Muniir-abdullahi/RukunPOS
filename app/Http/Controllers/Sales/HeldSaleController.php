<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Http\Requests\Sales\StoreHeldSaleRequest;
use App\Models\HeldSale;
use App\Services\Sales\HeldSaleService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HeldSaleController extends Controller
{
    public function __construct(private readonly HeldSaleService $heldSaleService) {}

    public function index(): Response
    {
        return $this->tryCatch(fn () => Inertia::render('POS/HeldSales', ['heldSales' => $this->heldSaleService->getForCashier()]));
    }

    public function store(StoreHeldSaleRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->heldSaleService->hold($request->validated());

            return back()->with('success', 'Sale held.');
        });
    }

    public function destroy(HeldSale $heldSale): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($heldSale) {
            $this->heldSaleService->delete($heldSale);

            return back()->with('success', 'Held sale removed.');
        });
    }
}
