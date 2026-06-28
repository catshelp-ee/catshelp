<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Animal extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
        'birthday',
        'profile_title',
        'status',
        'chip_number',
        'chip_registered_with_us',
        'description',
        'requirements_for_new_family',
        'additional_notes',
        'chronic_conditions',
    ];

    protected $casts = [
        'birthday' => 'datetime',
        'chip_registered_with_us' => 'boolean',
    ];

    public function rescues()
    {
        return $this->hasMany(AnimalRescue::class);
    }

    public function fosterHomes()
    {
        return $this->belongsToMany(FosterHome::class, 'animals_to_foster_homes')
            ->withPivot('foster_home_end_date');
    }

    public function characteristics()
    {
        return $this->hasMany(AnimalCharacteristic::class);
    }

    public function files()
    {
        return $this->hasMany(File::class);
    }

    public function todos()
    {
        return $this->hasMany(Todo::class);
    }

    public function profileFile()
    {
        return $this->hasOne(File::class, 'profile_animal_id');
    }

    public function treatments()
    {
        return $this->hasMany(Treatment::class);
    }
}
