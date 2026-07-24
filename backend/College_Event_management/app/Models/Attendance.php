<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'registration_id',
        'attendance_date',
        'status'
    ];

    public function registration()
    {
        return $this->belongsTo(Registration::class);
    }
}