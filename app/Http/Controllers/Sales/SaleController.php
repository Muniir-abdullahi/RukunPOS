<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Services\Sales\SaleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    public function __construct(private readonly SaleService $saleService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Sales/Index', ['filters' => $request->only('search', 'status', 'payment_status', 'customer_id', 'date_from', 'date_to', 'page', 'per_page'), 'sales' => Inertia::defer(fn () => $this->saleService->getAll($request->all())), ...$this->saleService->formOptions()]));
    }

    public function show(Sale $sale): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Sales/Show', ['sale' => $this->saleService->findForShow($sale)]));
    }

    public function destroy(Sale $sale): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($sale) {
            $this->saleService->delete($sale);

            return back()->with('success', 'Sale deleted.');
        });
    }
}
