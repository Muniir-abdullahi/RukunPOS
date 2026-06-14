<?php

namespace App\Http\Controllers\Purchases;

use App\Http\Controllers\Controller;
use App\Http\Requests\Purchases\StorePurchasePaymentRequest;
use App\Models\Purchase;
use App\Services\Purchases\PurchaseService;
use Illuminate\Http\RedirectResponse;

class PurchasePaymentController extends Controller
{
    public function __construct(private readonly PurchaseService $purchaseService) {}

    public function store(StorePurchasePaymentRequest $request, Purchase $purchase): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request, $purchase) {
            $this->purchaseService->addPayment($purchase, $request->validated());

            return back()->with('success', 'Purchase payment added.');
        });
    }
}
