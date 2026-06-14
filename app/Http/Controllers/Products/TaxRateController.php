<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Http\Requests\Products\StoreTaxRateRequest;
use App\Http\Requests\Products\UpdateTaxRateRequest;
use App\Models\TaxRate;
use App\Services\Products\TaxRateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaxRateController extends Controller
{
    public function __construct(private readonly TaxRateService $taxRateService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(function () use ($request) {
            $this->authorize('viewAny', TaxRate::class);

            return Inertia::render('Inventory/Taxonomy', ['type' => 'TaxRate', 'filters' => $request->only('search', 'page', 'per_page'), 'records' => Inertia::defer(fn () => $this->taxRateService->getAll($request->all()))]);
        });
    }

    public function create(): Response
    {
        return $this->tryCatch(function () {
            $this->authorize('create', TaxRate::class);

            return Inertia::render('Inventory/Taxonomy', ['type' => 'TaxRate', 'selectedRecord' => null]);
        });
    }

    public function show(TaxRate $taxRate): Response
    {
        return $this->tryCatch(function () use ($taxRate) {
            $this->authorize('view', $taxRate);

            return Inertia::render('Inventory/Taxonomy', ['type' => 'TaxRate', 'selectedRecord' => $taxRate]);
        });
    }

    public function edit(TaxRate $taxRate): Response
    {
        return $this->tryCatch(function () use ($taxRate) {
            $this->authorize('update', $taxRate);

            return Inertia::render('Inventory/Taxonomy', ['type' => 'TaxRate', 'selectedRecord' => $taxRate, 'editing' => true]);
        });
    }

    public function store(StoreTaxRateRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->authorize('create', TaxRate::class);
            $this->taxRateService->create($request->validated());

            return back()->with('success', 'Tax rate created.');
        });
    }

    public function update(UpdateTaxRateRequest $request, TaxRate $taxRate): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request, $taxRate) {
            $this->authorize('update', $taxRate);
            $this->taxRateService->update($taxRate, $request->validated());

            return back()->with('success', 'Tax rate updated.');
        });
    }

    public function destroy(TaxRate $taxRate): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($taxRate) {
            $this->authorize('delete', $taxRate);
            $this->taxRateService->delete($taxRate);

            return back()->with('success', 'Tax rate deleted.');
        });
    }
}
