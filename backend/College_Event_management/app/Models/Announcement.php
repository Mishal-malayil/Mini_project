<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = [
        'title',
        'message',
        'event_id',
        'published_at'
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}