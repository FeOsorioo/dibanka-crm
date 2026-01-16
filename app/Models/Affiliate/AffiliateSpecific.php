<?php

namespace App\Models\Affiliate;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Payroll;
use App\Models\Affiliate\AffiliateConsultation;

class AffiliateSpecific extends Model
{
    use HasFactory;

    protected $table = 'affiliate_specifics';
    protected $fillable = [
        'name',
        'consultation_id',
        'is_active',
    ];

    public function consultation()
    {
        return $this->belongsTo(AffiliateConsultation::class, 'consultation_id');
    }


    public function payroll()
    {
        return $this->belongsToMany(Payroll::class, 'affiliate_consultations_payroll')
                    ->withTimestamps();
    }


    // Scope para traer solo registros activos
    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }
}