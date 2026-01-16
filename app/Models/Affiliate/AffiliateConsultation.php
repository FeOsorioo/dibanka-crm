<?php

namespace App\Models\Affiliate;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Payroll;

class AffiliateConsultation extends Model
{
    use HasFactory;

    protected $table = 'affiliate_consultations';
    protected $fillable = [
        'name',
        'is_active',
    ];
    // Scope para traer solo registros activos
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }

    public function payrolls()
    {
        return $this->belongsToMany(
            Payroll::class,
            'affiliate_consultations_payroll',
            'consultation_id', // FK hacia AffiliateConsultation
            'payroll_id'       // FK hacia Payroll
        )->withTimestamps();
    }

}
