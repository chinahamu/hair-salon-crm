<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class MedicalRecordImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'medical_record_id',
        'path',
        'description',
    ];

    protected $appends = ['url'];

    public function medicalRecord()
    {
        return $this->belongsTo(MedicalRecord::class);
    }

    public function getUrlAttribute()
    {
        return Storage::url($this->path);
    }
}
