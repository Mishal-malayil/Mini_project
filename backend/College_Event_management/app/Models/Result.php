<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Student;
use App\Models\Event;

class Result extends Model
{
    protected $fillable = [
    'event_id',
    'student_id',
    'position',
    'remarks',
];

    public function registration()
    {
        return $this->belongsTo(Registration::class);
    }
    public function student()
{
    return $this->belongsTo(Student::class);
}

public function event()
{
    return $this->belongsTo(Event::class);
}
}