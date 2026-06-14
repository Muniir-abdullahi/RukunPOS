<?php

namespace App\Http\Controllers\Concerns;

use Closure;
use Illuminate\Http\RedirectResponse;
use Throwable;

trait HandlesControllerExceptions
{
    protected function tryCatch(Closure $callback, string $message = 'Something went wrong. Please try again.'): mixed
    {
        try {
            return $callback();
        } catch (Throwable $exception) {
            report($exception);

            if (request()->expectsJson()) {
                throw $exception;
            }

            return back()->with('error', $message);
        }
    }

    protected function tryCatchRedirect(Closure $callback, string $message = 'Something went wrong. Please try again.'): RedirectResponse
    {
        return $this->tryCatch($callback, $message);
    }
}
