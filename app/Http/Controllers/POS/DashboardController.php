<?php

namespace App\Http\Controllers\POS;

use App\Http\Controllers\Controller;
use App\Services\POS\DashboardService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $dashboardService) {}

    public function index(): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Dashboard/Index', [
            'dashboardData' => Inertia::defer(fn () => $this->dashboardService->getData()),
        ]));
    }
}
