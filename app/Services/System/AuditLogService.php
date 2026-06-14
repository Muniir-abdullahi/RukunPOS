<?php

namespace App\Services\System;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Throwable;

class AuditLogService
{
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
