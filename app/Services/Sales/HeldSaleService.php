<?php

namespace App\Services\Sales;

use App\Models\HeldSale;
use App\Services\Concerns\HandlesServiceExceptions;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class HeldSaleService
{
    use HandlesServiceExceptions;

    public function getForCashier()
    {
        return $this->tryCatch(fn () => HeldSale::query()->where('cashier_id', auth()->id())->latest('held_at')->get());
    }

    public function hold(array $data): HeldSale
    {
        return $this->tryCatch(fn () => DB::transaction(fn () => HeldSale::create(['reference' => 'HELD-'.uniqid(), 'customer_id' => $data['customer_id'] ?? null, 'warehouse_id' => $data['warehouse_id'], 'cashier_id' => auth()->id(), 'cart_snapshot' => $data['cart_snapshot'], 'subtotal' => $data['subtotal'] ?? 0, 'tax_total' => $data['tax_total'] ?? 0, 'discount_total' => $data['discount_total'] ?? 0, 'grand_total' => $data['grand_total'] ?? 0, 'held_at' => now()])));
    }

    public function delete(HeldSale $heldSale): void
    {
        $this->tryCatch(function () use ($heldSale): void {
            if ($heldSale->cashier_id !== auth()->id()) {
                throw ValidationException::withMessages(['held_sale' => 'You cannot remove another cashier held sale.']);
            }
            $heldSale->delete();
        });
    }
}
