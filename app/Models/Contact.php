<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ChangeHistory;
use App\Models\Entity;
use App\Models\Campaign;
use App\Models\Payroll;

class Contact extends Model
{
    protected $fillable = [
        'campaign_id',
        'payroll_id',
        'entity_id',
        'name',
        'identification_type',
        'phone',
        'identification_number',
        'update_phone',
        'email',
        'is_active',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class, 'campaign_id');
    }

    public function payroll()
    {
        return $this->belongsTo(Payroll::class, 'payroll_id');
    }

    public function entity()
    {
        return $this->belongsTo(Entity::class, 'entity_id');
    }

    public function scopeSearch($query, $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('name', 'LIKE', "%{$term}%")
                ->orWhere('phone', 'LIKE', "%{$term}%")
                ->orWhere('update_phone', 'LIKE', "%{$term}%")
                ->orWhere('email', 'LIKE', "%{$term}%")
                ->orWhere('identification_type', 'LIKE', "%{$term}%")
                ->orWhere('identification_number', 'LIKE', "%{$term}%")
                ->orWhereHas('payroll', function ($payrollQuery) use ($term) {
                    $payrollQuery->where('name', 'LIKE', "%{$term}%");
                })
                ->orWhereHas('entity', function ($entityQuery) use ($term) {
                    $entityQuery->where('name', 'LIKE', "%{$term}%");
                })
                ->orWhereHas('campaign', function ($campaignQuery) use ($term) {
                    $campaignQuery->where('name', 'LIKE', "%{$term}%");
                });
        });
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', 1);
    }
    
    public function histories()
    {
        return $this->morphMany(ChangeHistory::class, 'entity');
    }
}