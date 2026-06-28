<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'animal_id',
        'completed_date',
        'type',
        'due_date'
    ];

    protected $casts = [
        'completed_date' => 'datetime',
        'due_date' => 'datetime',
    ];

    public function animal()
    {
        return $this->belongsTo(Animal::class);
    }
}
