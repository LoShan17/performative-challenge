<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AddStockTest extends TestCase
{
    use RefreshDatabase;


    public function test_authenticated_user_store_stock()
    {
        $user = User::factory()->create();
        $this->post('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);
        $data = [
            'ticker' => 'MyStock',
            'pe' => 1,
            'debt_to_equity' => 1,
            'dividend_yield' => 1,
            'vs_sp500' => 1,
            'use_finnhub' => false
        ];
        $stocks_response = $this->post('/api/stocks', $data);
        $stocks_response->assertStatus(201);
        $this->assertDatabaseCount('stocks', 1);
    }
}
