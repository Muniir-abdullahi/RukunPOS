<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Http\Requests\Products\StoreCategoryRequest;
use App\Http\Requests\Products\UpdateCategoryRequest;
use App\Models\Category;
use App\Services\Products\CategoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(private readonly CategoryService $categoryService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(function () use ($request) {
            $this->authorize('viewAny', Category::class);

            return Inertia::render('Inventory/Taxonomy', ['type' => 'Category', 'filters' => $request->only('search', 'page', 'per_page'), 'records' => Inertia::defer(fn () => $this->categoryService->getAll($request->all()))]);
        });
    }

    public function create(): Response
    {
        return $this->tryCatch(function () {
            $this->authorize('create', Category::class);

            return Inertia::render('Inventory/Taxonomy', ['type' => 'Category', 'selectedRecord' => null]);
        });
    }

    public function show(Category $category): Response
    {
        return $this->tryCatch(function () use ($category) {
            $this->authorize('view', $category);

            return Inertia::render('Inventory/Taxonomy', ['type' => 'Category', 'selectedRecord' => $category]);
        });
    }

    public function edit(Category $category): Response
    {
        return $this->tryCatch(function () use ($category) {
            $this->authorize('update', $category);

            return Inertia::render('Inventory/Taxonomy', ['type' => 'Category', 'selectedRecord' => $category, 'editing' => true]);
        });
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->authorize('create', Category::class);
            $this->categoryService->create($request->validated());

            return back()->with('success', 'Category created.');
        });
    }

    public function update(UpdateCategoryRequest $request, Category $category): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request, $category) {
            $this->authorize('update', $category);
            $this->categoryService->update($category, $request->validated());

            return back()->with('success', 'Category updated.');
        });
    }

    public function destroy(Category $category): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($category) {
            $this->authorize('delete', $category);
            $this->categoryService->delete($category);

            return back()->with('success', 'Category deleted.');
        });
    }
}
