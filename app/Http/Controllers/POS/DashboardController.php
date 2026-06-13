<?php

namespace App\Http\Controllers\POS;

use Inertia\Inertia;
use Inertia\Response;

class DashboardController
{
    public function index(): Response
    {
        return Inertia::render('Dashboard/Index', [
            'stats' => [
                'salesToday' => 0,
                'totalRevenue' => 0,
                'totalPurchases' => 0,
                'netProfit' => 0,
                'lowStockAlerts' => 0,
            ],
            'recentSales' => [],
            'topProducts' => [],
        ]);
    }
}

