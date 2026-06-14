<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Services\System\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function __construct(private readonly NotificationService $notificationService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/Notifications/Index', ['filters' => $request->only('search', 'page', 'per_page'), 'notifications' => Inertia::defer(fn () => $this->notificationService->getAll($request->all()))]));
    }

    public function markAsRead(Notification $notification): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($notification) {
            $this->authorize('update', $notification);
            $this->notificationService->markAsRead($notification);

            return back()->with('success', 'Marked as read.');
        });
    }

    public function markAllRead(): RedirectResponse
    {
        return $this->tryCatchRedirect(function () {
            $this->notificationService->markAllRead();

            return back()->with('success', 'All notifications marked as read.');
        });
    }
}
