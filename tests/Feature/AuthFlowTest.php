<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_redirects_guests_from_dashboard_to_login(): void
    {
        $this->get('/dashboard')->assertRedirect('/login');
    }

    public function test_rejects_invalid_login_credentials(): void
    {
        User::query()->create([
            'name' => 'Admin',
            'email' => 'admin@rukunpos.app',
            'password' => Hash::make('password123'),
        ]);

        $this->from('/login')
            ->post('/login', [
                'email' => 'admin@rukunpos.app',
                'password' => 'wrong-password',
            ])
            ->assertSessionHasErrors('email');
    }

    public function test_logs_in_and_redirects_to_dashboard(): void
    {
        User::query()->create([
            'name' => 'Admin',
            'email' => 'admin@rukunpos.app',
            'password' => Hash::make('password123'),
        ]);

        $this->post('/login', [
            'email' => 'admin@rukunpos.app',
            'password' => 'password123',
        ])->assertRedirect('/dashboard');

        $this->assertAuthenticated();
    }

    public function test_logs_out_and_redirects_to_login(): void
    {
        $user = User::query()->create([
            'name' => 'Admin',
            'email' => 'admin@rukunpos.app',
            'password' => Hash::make('password123'),
        ]);

        $this->actingAs($user)
            ->post('/logout')
            ->assertRedirect('/login');

        $this->assertGuest();
    }
}
