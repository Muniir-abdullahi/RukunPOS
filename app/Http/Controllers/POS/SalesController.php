<?php

namespace App\Http\Controllers\POS;

use Inertia\Inertia;
use Inertia\Response;

class SalesController
{
    public function index(): Response
    {
        return Inertia::render('Modules/CrudPage', ['module' => 'sales']);
    }

    public function pos(): Response
    {
        return Inertia::render('Sales/POSPage');
    }
}
