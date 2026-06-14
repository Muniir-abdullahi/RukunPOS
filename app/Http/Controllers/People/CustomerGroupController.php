<?php

namespace App\Http\Controllers\People;

use App\Http\Controllers\Controller;
use App\Http\Requests\People\StoreCustomerGroupRequest;
use App\Http\Requests\People\UpdateCustomerGroupRequest;
use App\Models\CustomerGroup;
use App\Services\People\CustomerGroupService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerGroupController extends Controller
{
    public function __construct(private readonly CustomerGroupService $customerGroupService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/ExpenseCategories/Index', ['title' => 'Customer Groups', 'filters' => $request->only('search', 'page', 'per_page'), 'records' => Inertia::defer(fn () => $this->customerGroupService->getAll($request->all()))]));
    }

    public function store(StoreCustomerGroupRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->customerGroupService->create($request->validated());

            return back()->with('success', 'Customer group created.');
        });
    }

    public function update(UpdateCustomerGroupRequest $request, CustomerGroup $customerGroup): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request, $customerGroup) {
            $this->customerGroupService->update($customerGroup, $request->validated());

            return back()->with('success', 'Customer group updated.');
        });
    }

    public function destroy(CustomerGroup $customerGroup): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($customerGroup) {
            $this->customerGroupService->delete($customerGroup);

            return back()->with('success', 'Customer group deleted.');
        });
    }
}
