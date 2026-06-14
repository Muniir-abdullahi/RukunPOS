<?php

namespace App\Http\Controllers\Expenses;

use App\Http\Controllers\Controller;
use App\Http\Requests\Expenses\StoreExpenseCategoryRequest;
use App\Http\Requests\Expenses\UpdateExpenseCategoryRequest;
use App\Models\ExpenseCategory;
use App\Services\Expenses\ExpenseCategoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseCategoryController extends Controller
{
    public function __construct(private readonly ExpenseCategoryService $expenseCategoryService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/ExpenseCategories/Index', ['title' => 'Expense Categories', 'filters' => $request->only('search', 'page', 'per_page'), 'records' => Inertia::defer(fn () => $this->expenseCategoryService->getAll($request->all()))]));
    }

    public function store(StoreExpenseCategoryRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->expenseCategoryService->create($request->validated());

            return back()->with('success', 'Expense category created.');
        });
    }

    public function update(UpdateExpenseCategoryRequest $request, ExpenseCategory $expenseCategory): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request, $expenseCategory) {
            $this->expenseCategoryService->update($expenseCategory, $request->validated());

            return back()->with('success', 'Expense category updated.');
        });
    }

    public function destroy(ExpenseCategory $expenseCategory): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($expenseCategory) {
            $this->expenseCategoryService->delete($expenseCategory);

            return back()->with('success', 'Expense category deleted.');
        });
    }
}
