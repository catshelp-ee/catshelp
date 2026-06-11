<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnimalRescue extends Model
{
    protected $table = 'animal_rescues';

    public $timestamps = false;

    protected $fillable = [
        'rescue_date',
        'state',
        'address',
        'location_notes',
        'rank_nr',
        'animal_id',
    ];

    protected $casts = [
        'rescue_date' => 'datetime',
    ];

    public function animal()
    {
        return $this->belongsTo(Animal::class);
    }
}
