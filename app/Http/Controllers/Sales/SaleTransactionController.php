<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Http\Requests\Sales\StoreSaleRequest;
use App\Services\Sales\SaleService;
use Illuminate\Http\RedirectResponse;

class SaleTransactionController extends Controller
{
    public function __construct(private readonly SaleService $saleService) {}

    public function store(StoreSaleRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $sale = $this->saleService->completeSale($request->validated());

            return back()->with('success', 'Sale completed.')->with('sale', $sale);
        });
    }
}
