<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuFacilityRequirement extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_id',
        'facility_type',
        'quantity',
    ];

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }
}
