<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Treatment extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'treatment_name',
        'active',
        'confirmed',
        'confirmation_date',
        'visit_date',
        'next_visit_date',
        'animal_id',
    ];

    protected $casts = [
        'active' => 'boolean',
        'confirmed' => 'boolean',
        'confirmation_date' => 'datetime',
        'visit_date' => 'datetime',
        'next_visit_date' => 'datetime',
    ];

    public function animal()
    {
        return $this->belongsTo(Animal::class);
    }
}
