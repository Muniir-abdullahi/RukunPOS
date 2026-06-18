<?php

use App\Models\User;

use function Pest\Laravel\get;

it('guest is redirected to login', function () {
    get(route('audit-logs.index'))->assertRedirect(route('login'));
});

it('index displays audit logs', function () {
    actingAsAdmin();

    // Trigger some event that creates an audit log
    $user = User::factory()->create();

    get(route('audit-logs.index'))->assertOk();
});

it('index can be filtered by user', function () {
    actingAsAdmin();
    get(route('audit-logs.index', ['user_id' => 1]))->assertOk();
});

it('index can be filtered by event type', function () {
    actingAsAdmin();
    get(route('audit-logs.index', ['event' => 'created']))->assertOk();
});

it('index can be filtered by date', function () {
    actingAsAdmin();
    get(route('audit-logs.index', ['date' => now()->toDateString()]))->assertOk();
});
