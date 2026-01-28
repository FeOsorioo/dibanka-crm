<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Payroll;
use App\Models\Campaign;

class Consultation extends Model
{
    use HasFactory;

    protected $table = 'consultations';
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
        return $this->belongsToMany(Payroll::class, 'consultations_payroll')
                    ->withTimestamps();
    }

    // Relación Muchos a Muchos con Campaign
    public function campaign()
    {
        return $this->belongsToMany(Campaign::class, 'consultations_campaign')
                    ->withTimestamps();
    }

    public function specifics()
    {
        return $this->hasMany(Specific::class, 'consultation_id');
    }
}