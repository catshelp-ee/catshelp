<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnimalCharacteristic extends Model
{
    protected $table = 'animal_characteristics';

    public $timestamps = false;

    protected $fillable = [
        'animal_id',
        'type',
        'value',
    ];

    public function animal()
    {
        return $this->belongsTo(Animal::class);
    }
}
