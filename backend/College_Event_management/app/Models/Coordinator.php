<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coordinator extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'department',
        'designation',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    public function events()
    {
        return $this->hasMany(Event::class);
    }
}