<?php

namespace App\Observers\Alliance;

use App\Models\Alliance\AllianceManagement;
use App\Models\ChangeHistory;
class AllianceManagementObserver
{
    public function created(AllianceManagement $management)
    {
        ChangeHistory::create([
            'entity_type' => AllianceManagement::class,
            'entity_id' => $management->id,
            'action' => 'created',
            'new_values' => $management->getAttributes(),
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function updated(AllianceManagement $management)
    {
        ChangeHistory::create([
            'entity_type' => AllianceManagement::class,
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
