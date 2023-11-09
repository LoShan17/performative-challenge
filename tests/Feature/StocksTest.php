<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StocksTest extends TestCase
{
    use RefreshDatabase;


    public function test_authenticated_user_can_see_stocks()
    {
        $user = User::factory()->create();
        $this->post('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $stocks_response = $this->get('/api/stocks');
        $stocks_response->assertStatus(200);
    }
}
