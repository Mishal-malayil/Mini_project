<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Student extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'department',
        'semester',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    public function results()
    {
        return $this->hasMany(Result::class);
    }
}