<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpecialCases extends Model
{
    protected $fillable = [
        'user_id', 
        'contact_id', 
        'management_messi', 
        'id_call', 
        'id_messi', 
        'observations'
    ];

    // Relación con usuarios
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relación con contactos o clientes
    public function contact()
    {
        return $this->belongsTo(Contact::class, 'contact_id');
    }
}
