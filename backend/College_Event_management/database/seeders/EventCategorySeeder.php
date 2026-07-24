<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EventCategory;

class EventCategorySeeder extends Seeder
{
    public function run(): void
    {
        EventCategory::create([
            'category_name' => 'Sports'
        ]);

        EventCategory::create([
            'category_name' => 'Arts'
        ]);

        EventCategory::create([
            'category_name' => 'Technical'
        ]);
    }
}