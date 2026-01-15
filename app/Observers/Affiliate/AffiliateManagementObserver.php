<?php

namespace App\Observers;

use App\Models\Afiliados\Management;
use App\Models\ChangeHistory;
class ManagementAfiliadoObserver
{
    public function created(Management $management)
    {
        ChangeHistory::create([
            'entity_type' => Management::class,
            'entity_id' => $management->id,
            'action' => 'created',
            'new_values' => $management->getAttributes(),
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function updated(Management $management)
    {
        ChangeHistory::create([
            'entity_type' => Management::class,
            'entity_id' => $management->id,
            'action' => 'updated',
            'old_values' => $management->getOriginal(),
            'new_values' => $management->getChanges(),
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
