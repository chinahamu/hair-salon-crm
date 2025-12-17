<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'name',
        'description',
        'price',
        'duration',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
        'price' => 'integer',
        'duration' => 'integer',
    ];

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function facilityRequirements()
    {
        return $this->hasMany(MenuFacilityRequirement::class);
    }

    public function reservations()
    {
        return $this->belongsToMany(Reservation::class, 'reservation_menus')
            ->withPivot('price', 'duration')
            ->withTimestamps();
    }
}
