<?php

namespace App\Models\Affiliate;

use Illuminate\Database\Eloquent\Model;
use App\Models\Affiliate\AffiliateContact;

class AffiliateSpecialCases extends Model
{
    protected $fillable = ['user_id', 'contact_id', 'management_messi', 'id_call', 'id_messi', 'observations'];

    // Relación con usuarios
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relación con contactos o clientes
    public function contact()
    {
        return $this->belongsTo(AffiliateContact::class, 'contact_id');
    }
}
