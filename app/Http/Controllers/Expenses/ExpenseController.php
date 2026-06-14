<?php

namespace App\Http\Controllers\Expenses;

use App\Http\Controllers\Controller;
use App\Http\Requests\Expenses\StoreExpenseRequest;
use App\Http\Requests\Expenses\UpdateExpenseRequest;
use App\Models\Expense;
use App\Services\Expenses\ExpenseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    public function __construct(private readonly ExpenseService $expenseService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/Expenses/Index', ['filters' => $request->only('search', 'expense_category_id', 'account_id', 'date_from', 'date_to', 'page', 'per_page'), 'expenses' => Inertia::defer(fn () => $this->expenseService->getAll($request->all())), ...$this->expenseService->formOptions()]));
    }

    public function store(StoreExpenseRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->expenseService->create($request->validated());

            return back()->with('success', 'Expense created.');
        });
    }

    public function show(Expense $expense): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/Expenses/Index', ['expense' => $expense->load('category', 'account'), ...$this->expenseService->formOptions()]));
    }

    public function update(UpdateExpenseRequest $request, Expense $expense): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request, $expense) {
            $this->expenseService->update($expense, $request->validated());

            return back()->with('success', 'Expense updated.');
        });
    }

    public function destroy(Expense $expense): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($expense) {
            $this->expenseService->delete($expense);

            return back()->with('success', 'Expense deleted.');
        });
    }
}
