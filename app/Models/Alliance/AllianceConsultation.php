<?php

namespace App\Models\Alliance;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Payroll;

class AllianceConsultation extends Model
{
    use HasFactory;

    protected $table = 'alliance_consultations';
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
        return $this->belongsToMany(Payroll::class, 'alliance_consultations_payroll')
                    ->withTimestamps();
    }

}
