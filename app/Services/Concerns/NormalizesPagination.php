<?php

namespace App\Services\Concerns;

trait NormalizesPagination
{
    protected function perPage(array $filters): int
    {
        return min(max((int) ($filters['per_page'] ?? 25), 10), 100);
    }
}
