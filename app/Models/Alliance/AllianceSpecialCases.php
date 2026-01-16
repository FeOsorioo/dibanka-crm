<?php

namespace App\Models\Alliance;

use Illuminate\Database\Eloquent\Model;
use App\Models\Alliance\AllianceContact;

class AllianceSpecialCases extends Model
{
    protected $fillable = [
        'user_id', 
        'contact_id', 
        'management_messi', 
        'id_call', 
        'id_messi', 
        'observations',
        'operator_entity_id'
    ];

    public function operatorEntity()
    {
        return $this->belongsTo(OperatorEntity::class, 'operator_entity_id');
    }

    // Relación con usuarios
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relación con contactos o clientes
    public function contact()
    {
        return $this->belongsTo(AllianceContact::class, 'contact_id');
    }
}
