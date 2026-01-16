<?php

namespace App\Models\Affiliate;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Affiliate\AffiliateContact;
use App\Models\Affiliate\AffiliateConsultation;
use App\Models\Affiliate\AffiliateSpecific;
use App\Models\TypeManagement;
use App\Models\Monitoring;
use App\Models\ChangeHistory;

class AffiliateManagement extends Model
{
    use HasFactory;

    protected $table = 'affiliate_management';

    protected $fillable = [
        'user_id',
        'contact_id',
        'solution',
        'consultation_id',
        'specific_id',
        'comments',
        'solution_date',
        'monitoring_id',
        'sms',
        'wsp',
        'type_management_id',
        'wolkvox_id'
    ];

    public function monitoring()
    {
        return $this->belongsTo(Monitoring::class, 'monitoring_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function consultation()
    {
        return $this->belongsTo(AffiliateConsultation::class, 'consultation_id');
    }

    public function contact()
    {
        return $this->belongsTo(AffiliateContact::class, 'contact_id');
    }

    public function specific()
    {
        return $this->belongsTo(AffiliateSpecific::class, 'specific_id');
    }

    public function type_management()
    {
        return $this->belongsTo(TypeManagement::class, 'type_management_id');
    }
    
    public function histories()
    {
        return $this->morphMany(ChangeHistory::class, 'entity');
    }
}
