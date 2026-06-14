<?php

namespace App\Services\Concerns;

use Closure;
use Throwable;

trait HandlesServiceExceptions
{
    protected function tryCatch(Closure $callback): mixed
    {
        try {
            return $callback();
        } catch (Throwable $exception) {
            report($exception);

            throw $exception;
        }
    }
}
