<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('results', function (Blueprint $table) {
            $table->id();

            $table->foreignId('event_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->foreignId('student_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->enum('position', [
                'First',
                'Second',
                'Third',
                'Participation'
            ]);

            $table->string('remarks')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('results');
    }
};