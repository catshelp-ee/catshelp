<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    public $timestamps = false;

    protected $fillable = [
        'full_name',
        'email',
        'identity_code',
        'citizenship',
        'role',
        'created_at',
    ];

    public function fosterHome()
    {
        return $this->hasOne(FosterHome::class);
    }
}
