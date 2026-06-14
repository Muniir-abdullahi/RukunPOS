<?php

namespace App\Http\Controllers\Products;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\Products\BarcodeService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BarcodeController extends Controller
{
    public function __construct(private readonly BarcodeService $barcodeService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(function () use ($request) {
            $this->authorize('viewAny', Product::class);

            return Inertia::render('Inventory/Barcode', ['products' => $this->barcodeService->getForPrinting((array) $request->input('ids', []))]);
        });
    }
}
