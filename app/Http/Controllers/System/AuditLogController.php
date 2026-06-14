<?php

namespace App\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use App\Services\System\AuditLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function __construct(private readonly AuditLogService $auditLogService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(function () use ($request) {
            $this->authorize('viewAny', AuditLog::class);

            return Inertia::render('Modules/AuditLogs/Index', ['filters' => $request->only('search', 'module', 'action', 'user_id', 'date_from', 'date_to', 'page', 'per_page'), 'logs' => Inertia::defer(fn () => $this->auditLogService->getAll($request->all())), 'users' => User::query()->orderBy('name')->get(['id', 'name'])]);
        });
    }
}
