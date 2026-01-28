<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Payroll;

class Specific extends Model
{
    use HasFactory;

    protected $table = 'specifics';
    protected $fillable = [
        'name',
        'consultation_id',
        'is_active',
    ];

    public function consultation()
    {
        return $this->belongsTo(Consultation::class, 'consultation_id');
    }


    public function payroll()
    {
        return $this->belongsToMany(Payroll::class, 'consultations_payroll')
                    ->withTimestamps();
    }

    public function campaign()
    {
        return $this->belongsTo(Campaign::class, 'campaign_id');
    }

    // Scope para traer solo registros activos
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }
}
