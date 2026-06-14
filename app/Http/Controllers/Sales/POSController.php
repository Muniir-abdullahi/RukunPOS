<?php

namespace App\Http\Controllers\Sales;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Customer;
use App\Models\TaxRate;
use App\Models\Warehouse;
use App\Services\Sales\HeldSaleService;
use App\Services\Sales\POSService;
use Inertia\Inertia;
use Inertia\Response;

class POSController extends Controller
{
    public function __construct(private readonly POSService $posService, private readonly HeldSaleService $heldSaleService) {}

    public function index(): Response
    {
        return $this->tryCatch(function () {
            $warehouse = Warehouse::query()->first();

            return Inertia::render('POS/Index', ['warehouse' => $warehouse, 'customers' => Customer::query()->active()->get(['id', 'name', 'phone']), 'accounts' => Account::query()->active()->get(['id', 'name', 'type', 'current_balance']), 'taxRates' => TaxRate::query()->active()->get(), 'heldSales' => $this->heldSaleService->getForCashier(), 'products' => Inertia::defer(fn () => $warehouse ? $this->posService->getProducts($warehouse->id) : collect())]);
        });
    }
}
