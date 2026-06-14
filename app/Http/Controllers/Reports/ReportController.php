<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Services\Reports\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function __construct(private readonly ReportService $reportService) {}

    public function sales(Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Reports/Sales', ['filters' => $request->all(), 'salesReport' => Inertia::defer(fn () => $this->reportService->sales($request->all()))]));
    }

    public function purchases(Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Reports/Purchases', ['filters' => $request->all(), 'purchasesReport' => Inertia::defer(fn () => $this->reportService->purchases($request->all()))]));
    }

    public function products(Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Reports/Products', ['filters' => $request->all(), 'productsReport' => Inertia::defer(fn () => $this->reportService->stock($request->all()))]));
    }

    public function stock(Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Reports/Stock', ['filters' => $request->all(), 'stockReport' => Inertia::defer(fn () => $this->reportService->stock($request->all()))]));
    }

    public function profitLoss(Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Reports/ProfitLoss', ['filters' => $request->all(), 'profitLossReport' => Inertia::defer(fn () => $this->reportService->profitLoss($request->all()))]));
    }

    public function expenses(Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Reports/Expenses', ['filters' => $request->all(), 'expensesReport' => Inertia::defer(fn () => $this->reportService->expenses($request->all()))]));
    }
}
