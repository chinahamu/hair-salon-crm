<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'staff_id',
        'reservation_id',
        'visit_date',
        'content',
    ];

    protected $casts = [
        'visit_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function images()
    {
        return $this->hasMany(MedicalRecordImage::class);
    }
}
