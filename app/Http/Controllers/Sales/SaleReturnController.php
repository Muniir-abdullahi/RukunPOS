<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Http\Requests\Sales\StoreSaleReturnRequest;
use App\Models\SaleReturn;
use App\Services\Sales\SaleReturnService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SaleReturnController extends Controller
{
    public function __construct(private readonly SaleReturnService $saleReturnService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Sales/Returns', ['filters' => $request->only('search', 'page', 'per_page'), 'returns' => Inertia::defer(fn () => $this->saleReturnService->getAll($request->all()))]));
    }

    public function store(StoreSaleReturnRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->saleReturnService->create($request->validated());

            return back()->with('success', 'Sale return created.');
        });
    }

    public function show(SaleReturn $saleReturn): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Sales/Returns', ['saleReturn' => $saleReturn->load('items.product', 'customer')]));
    }

    public function destroy(SaleReturn $saleReturn): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($saleReturn) {
            $this->saleReturnService->delete($saleReturn);

            return back()->with('success', 'Sale return deleted.');
        });
    }
}
