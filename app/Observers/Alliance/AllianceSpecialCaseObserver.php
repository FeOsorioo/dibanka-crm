<?php

namespace App\Observers\Alliance;

use App\Models\Alliance\AllianceSpecialCases;
use App\Models\ChangeHistory;

class AllianceSpecialCaseObserver
{
    public function created(AllianceSpecialCases $specialCases)
    {
        ChangeHistory::create([
            'entity_type' => AllianceSpecialCases::class,
            'entity_id' => $specialCases->id,
            'action' => 'created',
            'new_values' => $specialCases->getAttributes(),
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
