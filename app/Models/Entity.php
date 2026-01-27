<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entity extends Model
{
    protected $table = 'entity';

    protected $fillable = [
        'name',
        'phone',
        'email',
        'nit',
        'description',
        'is_active'
    ];  
    
    public function histories()
    {
        return $this->morphMany(ChangeHistory::class, 'entity');
    }
}
