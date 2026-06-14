<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Http\Requests\Sales\StoreQuotationRequest;
use App\Http\Requests\Sales\UpdateQuotationRequest;
use App\Models\Quotation;
use App\Services\Sales\QuotationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuotationController extends Controller
{
    public function __construct(private readonly QuotationService $quotationService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Sales/Quotations', ['filters' => $request->only('search', 'customer_id', 'status', 'page', 'per_page'), 'quotations' => Inertia::defer(fn () => $this->quotationService->getAll($request->all())), ...$this->quotationService->formOptions()]));
    }

    public function store(StoreQuotationRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->quotationService->create($request->validated());

            return back()->with('success', 'Quotation created.');
        });
    }

    public function show(Quotation $quotation): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Sales/Quotations', ['quotation' => $quotation->load('items.product', 'customer'), ...$this->quotationService->formOptions()]));
    }

    public function update(UpdateQuotationRequest $request, Quotation $quotation): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request, $quotation) {
            $this->quotationService->update($quotation, $request->validated());

            return back()->with('success', 'Quotation updated.');
        });
    }

    public function destroy(Quotation $quotation): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($quotation) {
            $this->quotationService->delete($quotation);

            return back()->with('success', 'Quotation deleted.');
        });
    }

    public function convertToSale(Request $request, Quotation $quotation): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request, $quotation) {
            $this->quotationService->convertToSale($quotation, $request->all());

            return back()->with('success', 'Quotation converted.');
        });
    }
}
