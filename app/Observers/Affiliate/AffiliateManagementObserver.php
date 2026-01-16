<?php

namespace App\Observers\Affiliate;

use App\Models\Affiliate\AffiliateManagement;
use App\Models\ChangeHistory;
class AffiliateManagementObserver
{
    public function created(AffiliateManagement $management)
    {
        ChangeHistory::create([
            'entity_type' => AffiliateManagement::class,
            'entity_id' => $management->id,
            'action' => 'created',
            'new_values' => $management->getAttributes(),
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function updated(AffiliateManagement $management)
    {
        ChangeHistory::create([
            'entity_type' => AffiliateManagement::class,
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
