<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FosterHome extends Model
{
    protected $table = 'foster_homes';

    public $timestamps = false;

    protected $fillable = [
        'location',
        'user_id',
        'start_date',
        'end_date',
        'catshelp_mentor_id',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function animals()
    {
        return $this->belongsToMany(Animal::class, 'animals_to_foster_homes')
            ->withPivot('foster_home_end_date');
    }
}
