<?php

namespace App\Models;

use App\Models\Concerns\HasActiveStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TaxRate extends Model
{
    use HasActiveStatus;

    protected $guarded = [];

    protected function casts(): array
    {
        return ['rate' => 'decimal:4'];
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
