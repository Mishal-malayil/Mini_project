<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Coordinator;
use Illuminate\Support\Facades\Hash;

class CoordinatorSeeder extends Seeder
{
    public function run(): void
    {
        Coordinator::firstOrCreate(
            ['email' => 'john@gmail.com'],
            [
                'name' => 'John',
                'phone' => '9876543210',
                'department' => 'Computer Science',
                'designation' => 'Assistant Professor',
                'password' => Hash::make('password123'),
            ]
        );

        Coordinator::firstOrCreate(
            ['email' => 'anjali@example.com'],
            [
                'name' => 'Anjali',
                'phone' => '9876543211',
                'department' => 'Electronics',
                'designation' => 'Associate Professor',
                'password' => Hash::make('123456'),
            ]
        );
    }
}