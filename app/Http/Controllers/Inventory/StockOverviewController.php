<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\Inventory\StockService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockOverviewController extends Controller
{
    public function __construct(private readonly StockService $stockService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(function () use ($request) {
            $this->authorize('viewAny', Product::class);

            return Inertia::render('Inventory/Stock', [
                'filters' => $request->only('search', 'status', 'page', 'per_page'),
                'products' => Inertia::defer(fn () => $this->stockService->overview($request->all())),
            ]);
        });
    }
}
