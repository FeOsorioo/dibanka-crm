<?php

namespace App\Models\Alliance;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Alliance\AllianceContact;
use App\Models\Alliance\AllianceSpecific;
use App\Models\Alliance\AllianceConsultation;
use App\Models\TypeManagement;
use App\Models\Monitoring;
use App\Models\ChangeHistory;

class AllianceManagement extends Model
{
    use HasFactory;

    protected $table = 'alliance_management';

    protected $fillable = [
        'user_id',
        'contact_id',
        'payroll_management_id',
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
        return $this->belongsTo(AllianceConsultation::class, 'consultation_id');
    }

    public function contact()
    {
        return $this->belongsTo(AllianceContact::class, 'contact_id');
    }

    public function payroll()
    {
        return $this->belongsTo(Payroll::class, 'payroll_management_id');
    }

    public function specific()
    {
        return $this->belongsTo(AllianceSpecific::class, 'specific_id');
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
