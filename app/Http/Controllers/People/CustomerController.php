<?php

namespace App\Http\Controllers\People;

use App\Http\Controllers\Controller;
use App\Http\Requests\People\StoreCustomerRequest;
use App\Http\Requests\People\UpdateCustomerRequest;
use App\Models\Customer;
use App\Services\People\CustomerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function __construct(private readonly CustomerService $customerService) {}

    public function index(Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/Customers/Index', ['filters' => $request->only('search', 'customer_group_id', 'status', 'page', 'per_page'), 'customers' => Inertia::defer(fn () => $this->customerService->getAll($request->all())), ...$this->customerService->formOptions()]));
    }

    public function store(StoreCustomerRequest $request): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request) {
            $this->customerService->create($request->validated());

            return redirect()->route('customers.index')->with('success', 'Customer created.');
        });
    }

    public function show(Customer $customer, Request $request): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/Customers/Show', ['customer' => $this->customerService->findForShow($customer), 'recentSales' => Inertia::defer(fn () => $this->customerService->recentSales($customer, $request->all()))]));
    }

    public function edit(Customer $customer): Response
    {
        return $this->tryCatch(fn () => Inertia::render('Modules/Customers/Index', ['editingCustomer' => $this->customerService->findForShow($customer), ...$this->customerService->formOptions()]));
    }

    public function update(UpdateCustomerRequest $request, Customer $customer): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($request, $customer) {
            $this->customerService->update($customer, $request->validated());

            return redirect()->route('customers.index')->with('success', 'Customer updated.');
        });
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        return $this->tryCatchRedirect(function () use ($customer) {
            $this->customerService->delete($customer);

            return back()->with('success', 'Customer deleted.');
        });
    }
}
