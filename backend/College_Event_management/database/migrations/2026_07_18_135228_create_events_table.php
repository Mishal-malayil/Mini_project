<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();

            // Foreign Keys
            $table->foreignId('category_id')
                  ->constrained('event_categories')
                  ->onDelete('cascade');

            $table->foreignId('coordinator_id')
                  ->constrained('coordinators')
                  ->onDelete('cascade');

            // Event Details
            $table->string('event_name');
            $table->text('description')->nullable();
            $table->string('venue');
            $table->date('event_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('max_participants');

            // Event Status
            $table->enum('status', ['Pending', 'Approved', 'Rejected'])
                  ->default('Pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};