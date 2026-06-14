<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\HandlesControllerExceptions;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Routing\Controller as BaseController;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, HandlesControllerExceptions;
}
