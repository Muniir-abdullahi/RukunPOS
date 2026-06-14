<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use App\Http\Requests\Accounting\StoreMoneyTransferRequest;
use App\Models\MoneyTransfer;
use App\Services\Accounting\AccountService;
use App\Services\Accounting\MoneyTransferService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MoneyTransferController extends Controller
{
    public function __construct(private readonly MoneyTransferService $moneyTransferService, private readonly AccountService $accountService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/MoneyTransfers/Index', ['filters' => $request->only('date_from', 'date_to', 'from_account_id', 'page', 'per_page'), 'transfers' => Inertia::defer(fn () => $this->moneyTransferService->getAll($request->all())), 'accounts' => $this->accountService->getAll()]));
    }

    public function store(StoreMoneyTransferRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->moneyTransferService->transfer($request->validated());

            return back()->with('success', 'Money transferred.');
        });
    }

    public function show(MoneyTransfer $moneyTransfer): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/MoneyTransfers/Index', ['moneyTransfer' => $moneyTransfer->load('fromAccount', 'toAccount'), 'accounts' => $this->accountService->getAll()]));
    }

    public function destroy(MoneyTransfer $moneyTransfer): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($moneyTransfer) {
            $this->moneyTransferService->delete($moneyTransfer);

            return back()->with('success', 'Transfer deleted.');
        });
    }
}
