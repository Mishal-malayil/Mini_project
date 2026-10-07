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
        Schema::create('student_notification_reads', function (Blueprint $table) {
            $table->id();

            $table->foreignId('student_id')
                ->constrained('students')
                ->cascadeOnDelete();

            $table->foreignId('announcement_id')
                ->constrained('announcements')
                ->cascadeOnDelete();

            $table->timestamps();

            // Prevent the same student from marking
            // the same announcement as read multiple times.
            $table->unique([
                'student_id',
                'announcement_id'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_notification_reads');
    }
};