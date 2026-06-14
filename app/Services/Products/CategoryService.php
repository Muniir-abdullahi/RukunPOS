<?php

namespace App\Services\Products;

use App\Models\Category;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\System\AuditLogService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CategoryService
{
    use HandlesServiceExceptions;

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $perPage = min(max((int) ($filters['per_page'] ?? 25), 10), 100);

        return $this->tryCatch(fn () => Category::query()
            ->with('parent:id,name')
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where('name', 'like', "%{$search}%")->orWhere('code', 'like', "%{$search}%"))
            ->latest()
            ->paginate($perPage)
            ->through(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'code' => $category->code,
                'description' => $category->description,
                'parent' => $category->parent?->name,
                'parent_id' => $category->parent_id,
                'status' => ucfirst($category->status),
            ])
            ->withQueryString());
    }

    public function create(array $data): Category
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($data) {
            $category = Category::create($this->normalize($data));
            AuditLogService::log(auth()->user(), 'Create', 'Category', $category, [], $category->toArray());

            return $category;
        }));
    }

    public function update(Category $category, array $data): Category
    {
        return $this->tryCatch(fn () => DB::transaction(function () use ($category, $data) {
            $oldValues = $category->toArray();
            $category->update($this->normalize($data));
            AuditLogService::log(auth()->user(), 'Update', 'Category', $category, $oldValues, $category->toArray());

            return $category;
        }));
    }

    public function delete(Category $category): void
    {
        $this->tryCatch(fn () => DB::transaction(function () use ($category): void {
            $oldValues = $category->toArray();
            $category->delete();
            AuditLogService::log(auth()->user(), 'Delete', 'Category', null, $oldValues, []);
        }));
    }

    private function normalize(array $data): array
    {
        return $this->tryCatch(fn () => [
            'parent_id' => $data['parent_id'] ?? null,
            'name' => $data['name'],
            'code' => $data['code'] ?? null,
            'description' => $data['description'] ?? null,
            'status' => strtolower($data['status'] ?? 'active'),
        ]);
    }
}
