<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'phone',
        'email',
        'description',
        'organization_id',
        'business_hours',
        'regular_holidays',
        'temporary_closures',
        'min_reservation_unit',
    ];

    protected $casts = [
        'business_hours' => 'array',
        'regular_holidays' => 'array',
        'temporary_closures' => 'array',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function shifts()
    {
        return $this->hasMany(Shift::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
