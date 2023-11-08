<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SignUpTest extends TestCase
{
    use RefreshDatabase;


    public function test_user_can_signup()
    {
        $response = $this->post('/api/signup', [
            'name' => "aa",
            'email' => "a@b.com",
            'password' => "password!1A",
            'password_confirmation' => "password!1A",
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseCount('users', 1);
    }
}
