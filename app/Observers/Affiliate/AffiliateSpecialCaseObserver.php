<?php

namespace App\Observers\Affiliate;

use App\Models\Affiliate\AffiliateSpecialCases;
use App\Models\ChangeHistory;

class AffiliateSpecialCaseObserver
{
    public function created(AffiliateSpecialCases $specialCases)
    {
        ChangeHistory::create([
            'entity_type' => AffiliateSpecialCases::class,
            'entity_id' => $specialCases->id,
            'action' => 'created',
            'new_values' => $specialCases->getAttributes(),
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
