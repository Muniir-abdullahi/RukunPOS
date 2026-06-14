<?php

namespace App\Services\System;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Throwable;

class AuditLogService
{
    public function getAll(array $filters = []): LengthAwarePaginator
    {
        return AuditLog::query()
            ->with('user:id,name')
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where('description', 'like', "%{$search}%"))
            ->when($filters['module'] ?? null, fn ($query, $module) => $query->where('module', $module))
            ->when($filters['action'] ?? null, fn ($query, $action) => $query->where('action', $action))
            ->when($filters['user_id'] ?? null, fn ($query, $userId) => $query->where('user_id', $userId))
            ->when($filters['date_from'] ?? null, fn ($query, $date) => $query->whereDate('created_at', '>=', $date))
            ->when($filters['date_to'] ?? null, fn ($query, $date) => $query->whereDate('created_at', '<=', $date))
            ->latest()
            ->paginate(min(max((int) ($filters['per_page'] ?? 25), 10), 100))
            ->through(fn (AuditLog $log) => [
                'id' => $log->id,
                'date' => $log->created_at?->toDateTimeString(),
                'user' => $log->user?->name,
                'action' => $log->action,
                'module' => $log->module,
                'description' => $log->description,
                'ip_address' => $log->ip_address,
            ])
            ->withQueryString();
    }

    public static function log(?User $user, string $action, string $module, ?Model $model = null, array $oldValues = [], array $newValues = []): AuditLog
    {
        try {
            return AuditLog::create([
                'user_id' => $user?->id,
                'action' => $action,
                'module' => $module,
                'auditable_type' => $model ? $model::class : null,
                'auditable_id' => $model?->getKey(),
                'description' => trim($action.' '.$module),
                'old_values' => $oldValues,
                'new_values' => $newValues,
                'ip_address' => request()?->ip(),
                'user_agent' => request()?->userAgent(),
            ]);
        } catch (Throwable $exception) {
            report($exception);

            throw $exception;
        }
    }
}
