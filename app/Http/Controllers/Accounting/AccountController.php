<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use App\Http\Requests\Accounting\StoreAccountRequest;
use App\Http\Requests\Accounting\UpdateAccountRequest;
use App\Models\Account;
use App\Services\Accounting\AccountService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function __construct(private readonly AccountService $accountService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/Accounts/Index', ['accounts' => $this->accountService->getAll($request->all())]));
    }

    public function store(StoreAccountRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->accountService->create($request->validated());

            return back()->with('success', 'Account created.');
        });
    }

    public function show(Account $account, Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/Accounts/Statement', ['account' => $account, 'filters' => $request->only('date_from', 'date_to', 'type', 'page', 'per_page'), 'transactions' => Inertia::defer(fn () => $this->accountService->transactions($account, $request->all()))]));
    }

    public function update(UpdateAccountRequest $request, Account $account): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request, $account) {
            $this->accountService->update($account, $request->validated());

            return back()->with('success', 'Account updated.');
        });
    }

    public function destroy(Account $account): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($account) {
            $this->accountService->delete($account);

            return back()->with('success', 'Account deleted.');
        });
    }

    public function statement(Account $account, Request $request): Response
    {
        return $this->show($account, $request);
    }
}
