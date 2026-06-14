<?php

namespace App\Services\Expenses;

use App\Models\ExpenseCategory;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\Concerns\NormalizesPagination;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ExpenseCategoryService
{
    use HandlesServiceExceptions, NormalizesPagination;

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        return $this->tryCatch(fn () => ExpenseCategory::query()
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
            ->latest()
            ->paginate($this->perPage($filters))
            ->withQueryString());
    }

    public function options()
    {
        return $this->tryCatch(fn () => ExpenseCategory::query()->active()->orderBy('name')->get(['id', 'name']));
    }

    public function create(array $data): ExpenseCategory
    {
        return $this->write(new ExpenseCategory, $data, 'Create');
    }

    public function update(ExpenseCategory $expenseCategory, array $data): ExpenseCategory
    {
        return $this->write($expenseCategory, $data, 'Update');
    }

    public function delete(ExpenseCategory $expenseCategory): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($expenseCategory): void {
            $old = $expenseCategory->toArray();
            $expenseCategory->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'Expense Category', null, $old, []);
        }));
    }

    private function write(ExpenseCategory $category, array $data, string $action): ExpenseCategory
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($category, $data, $action) {
            $old = $category->exists ? $category->toArray() : [];
            $category->fill(['name' => $data['name'], 'description' => $data['description'] ?? null, 'status' => strtolower($data['status'] ?? 'active')])->save();
            AuditLogService::log(auth()->user(), $action, 'Expense Category', $category, $old, $category->toArray());

            return $category;
        }));
    }
}
