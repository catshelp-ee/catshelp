<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'animal_id',
        'profile_animal_id',
        'uuid',
        'extension',
        'type',
    ];

    public function animal()
    {
        return $this->belongsTo(Animal::class);
    }

    public function profileAnimal()
    {
        return $this->belongsTo(Animal::class, 'profile_animal_id');
    }
}
