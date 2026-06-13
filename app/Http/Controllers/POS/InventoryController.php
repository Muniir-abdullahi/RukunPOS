<?php

namespace App\Http\Controllers\POS;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController
{
    public function products(): Response
    {
        return Inertia::render('Inventory/Products');
    }

    public function productForm(?string $id = null): Response
    {
        return Inertia::render($id ? 'Inventory/ProductEdit' : 'Inventory/ProductCreate', [
            'id' => $id,
        ]);
    }

    public function productShow(string $id): Response
    {
        return Inertia::render('Inventory/ProductShow', [
            'id' => $id,
        ]);
    }

    public function barcode(): Response
    {
        return Inertia::render('Inventory/Barcode');
    }

    public function taxonomy(Request $request): Response
    {
        $type = $request->route('type');

        return Inertia::render('Inventory/Taxonomy', ['type' => $type]);
    }

    public function stockOverview(): Response
    {
        return Inertia::render('Inventory/Stock');
    }

    public function stockAdjustments(): Response
    {
        return Inertia::render('Inventory/Adjustments');
    }
}
