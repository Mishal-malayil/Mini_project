<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
    'category_id',
    'coordinator_id',
    'event_name',
    'description',
    'image',
    'venue',
    'event_date',
    'start_time',
    'end_time',
    'max_participants',
    'status',

];

    public function category()
    {
        return $this->belongsTo(EventCategory::class, 'category_id');
    }

    public function coordinator()
    {
        return $this->belongsTo(Coordinator::class, 'coordinator_id');
    }

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }
    public function announcements()
{
    return $this->hasMany(Announcement::class);
}
}