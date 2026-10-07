<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentNotificationRead extends Model
{
    protected $table = 'student_notification_reads';

    protected $fillable = [
        'student_id',
        'announcement_id',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function announcement()
    {
        return $this->belongsTo(Announcement::class);
    }
}