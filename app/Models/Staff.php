<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Staff extends Authenticatable
{
    use HasFactory, Notifiable;

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

    public function scopeAvailable($query, $storeId, $startTime, $endTime)
    {
        return $query->whereHas('shifts', function ($q) use ($storeId, $startTime, $endTime) {
            $q->where('store_id', $storeId)
              ->where('start_time', '<=', $startTime)
              ->where('end_time', '>=', $endTime)
              ->where('status', 'active');
        })->whereDoesntHave('reservations', function ($q) use ($startTime, $endTime) {
            $q->where('status', 'confirmed')
              ->where('start_time', '<', $endTime)
              ->where('end_time', '>', $startTime);
        });
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'organization_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
