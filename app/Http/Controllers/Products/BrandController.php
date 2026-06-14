<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Http\Requests\Products\StoreBrandRequest;
use App\Http\Requests\Products\UpdateBrandRequest;
use App\Models\Brand;
use App\Services\Products\BrandService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function __construct(private readonly BrandService $brandService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(function () use ($request) {
            $this->authorize('viewAny', Brand::class);

            return Inertia::render('Inventory/Taxonomy', ['type' => 'Brand', 'filters' => $request->only('search', 'page', 'per_page'), 'records' => Inertia::defer(fn () => $this->brandService->getAll($request->all()))]);
        });
    }

    public function create(): Response
    {
        return $this->tryCatch(function () {
            $this->authorize('create', Brand::class);

            return Inertia::render('Inventory/Taxonomy', ['type' => 'Brand', 'selectedRecord' => null]);
        });
    }

    public function show(Brand $brand): Response
    {
        return $this->tryCatch(function () use ($brand) {
            $this->authorize('view', $brand);

            return Inertia::render('Inventory/Taxonomy', ['type' => 'Brand', 'selectedRecord' => $brand]);
        });
    }

    public function edit(Brand $brand): Response
    {
        return $this->tryCatch(function () use ($brand) {
            $this->authorize('update', $brand);

            return Inertia::render('Inventory/Taxonomy', ['type' => 'Brand', 'selectedRecord' => $brand, 'editing' => true]);
        });
    }

    public function store(StoreBrandRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->authorize('create', Brand::class);
            $this->brandService->create($request->validated());

            return back()->with('success', 'Brand created.');
        });
    }

    public function update(UpdateBrandRequest $request, Brand $brand): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request, $brand) {
            $this->authorize('update', $brand);
            $this->brandService->update($brand, $request->validated());

            return back()->with('success', 'Brand updated.');
        });
    }

    public function destroy(Brand $brand): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($brand) {
            $this->authorize('delete', $brand);
            $this->brandService->delete($brand);

            return back()->with('success', 'Brand deleted.');
        });
    }
}
