<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RevokedToken extends Model
{
    protected $table = 'revoked_tokens';

    public $timestamps = false;

    protected $fillable = [
        'token',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];
}
