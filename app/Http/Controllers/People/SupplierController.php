<?php

namespace App\Http\Controllers\People;

use App\Http\Controllers\Controller;
use App\Http\Requests\People\StoreSupplierRequest;
use App\Http\Requests\People\UpdateSupplierRequest;
use App\Models\Supplier;
use App\Services\People\SupplierService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function __construct(private readonly SupplierService $supplierService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/Suppliers/Index', ['filters' => $request->only('search', 'status', 'page', 'per_page'), 'suppliers' => Inertia::defer(fn () => $this->supplierService->getAll($request->all()))]));
    }

    public function store(StoreSupplierRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->supplierService->create($request->validated());

            return redirect()->route('suppliers.index')->with('success', 'Supplier created.');
        });
    }

    public function show(Supplier $supplier, Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/Suppliers/Show', ['supplier' => $this->supplierService->findForShow($supplier), 'recentPurchases' => Inertia::defer(fn () => $this->supplierService->recentPurchases($supplier, $request->all()))]));
    }

    public function edit(Supplier $supplier): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/Suppliers/Index', ['editingSupplier' => $this->supplierService->findForShow($supplier)]));
    }

    public function update(UpdateSupplierRequest $request, Supplier $supplier): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request, $supplier) {
            $this->supplierService->update($supplier, $request->validated());

            return redirect()->route('suppliers.index')->with('success', 'Supplier updated.');
        });
    }

    public function destroy(Supplier $supplier): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($supplier) {
            $this->supplierService->delete($supplier);

            return back()->with('success', 'Supplier deleted.');
        });
    }
}
