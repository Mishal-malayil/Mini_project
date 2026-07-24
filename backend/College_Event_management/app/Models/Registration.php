<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    protected $fillable = [
        'student_id',
        'event_id',
        'registration_date',
        'status'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
    public function result()
   {
       return $this->hasOne(Result::class);
   }
}