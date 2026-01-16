<?php

namespace App\Models\Alliance;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Payroll;
use App\Models\Alliance\AllianceConsultation;

class AllianceSpecific extends Model
{
    use HasFactory;

    protected $table = 'alliance_specifics';
    protected $fillable = [
        'name',
        'consultation_id',
        'is_active',
    ];

    public function consultation()
    {
        return $this->belongsTo(AllianceConsultation::class, 'consultation_id');
    }


    public function payrolls()
    {
        return $this->belongsToMany(Payroll::class, 'payroll_consultations_aliados')
                    ->withTimestamps();
    }


    // Scope para traer solo registros activos
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }
}
