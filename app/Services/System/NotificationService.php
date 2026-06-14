<?php

namespace App\Services\System;

use App\Models\Notification;
use App\Services\Concerns\HandlesServiceExceptions;
use App\Services\Concerns\NormalizesPagination;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class NotificationService
{
    use HandlesServiceExceptions, NormalizesPagination;

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        return $this->tryCatch(fn () => Notification::query()
            ->where(fn ($query) => $query->whereNull('user_id')->orWhere('user_id', auth()->id()))
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where('title', 'like', "%{$search}%")->orWhere('body', 'like', "%{$search}%"))
            ->latest()
            ->paginate($this->perPage($filters))
            ->withQueryString());
    }

    public function markAsRead(Notification $notification): void
    {
        $this->tryCatch(fn () => $notification->update(['read_at' => now()]));
    }

    public function markAllRead(): void
    {
        $this->tryCatch(fn () => Notification::query()
            ->where(fn ($query) => $query->whereNull('user_id')->orWhere('user_id', auth()->id()))
            ->whereNull('read_at')
            ->update(['read_at' => now()]));
    }
}
