<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentPasswordReset extends Model
{
    protected $table = 'student_password_resets';

    protected $fillable = [
        'email',
        'otp_hash',
        'expires_at',
        'attempts',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'verified_at' => 'datetime',
        ];
    }
}