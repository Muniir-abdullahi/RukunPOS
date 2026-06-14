<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Http\Requests\Products\StoreProductRequest;
use App\Http\Requests\Products\UpdateProductRequest;
use App\Models\Product;
use App\Services\Products\ProductService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(private readonly ProductService $productService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(function () use ($request) {
            $this->authorize('viewAny', Product::class);

            return Inertia::render('Inventory/Products', ['filters' => $request->only('search', 'category_id', 'status', 'page', 'per_page'), 'products' => Inertia::defer(fn () => $this->productService->getAll($request->all())), ...$this->productService->formOptions()]);
        });
    }

    public function create(): Response
    {
        return $this->tryCatch(function () {
            $this->authorize('create', Product::class);

            return Inertia::render('Inventory/ProductCreate', $this->productService->formOptions());
        });
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->authorize('create', Product::class);
            $this->productService->create($request->validated());

            return redirect()->route('products.index')->with('success', 'Product created.');
        });
    }

    public function show(Product $product): Response
    {
        return $this->tryCatch(function () use ($product) {
            $this->authorize('view', $product);

            return Inertia::render('Inventory/ProductShow', ['product' => $this->productService->findForShow($product)]);
        });
    }

    public function edit(Product $product): Response
    {
        return $this->tryCatch(function () use ($product) {
            $this->authorize('update', $product);

            return Inertia::render('Inventory/ProductEdit', ['product' => $this->productService->findForShow($product), ...$this->productService->formOptions()]);
        });
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request, $product) {
            $this->authorize('update', $product);
            $this->productService->update($product, $request->validated());

            return redirect()->route('products.index')->with('success', 'Product updated.');
        });
    }

    public function destroy(Product $product): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($product) {
            $this->authorize('delete', $product);
            $this->productService->delete($product);

            return back()->with('success', 'Product deleted.');
        });
    }
}
