<?php

namespace App\Observers;

use App\Models\SpecialCases;
use App\Models\ChangeHistory;

class SpecialCaseObserver
{
    public function created(SpecialCases $specialCases)
    {
        ChangeHistory::create([
            'entity_type' => SpecialCases::class,
            'entity_id' => $specialCases->id,
            'action' => 'created',
            'new_values' => $specialCases->getAttributes(),
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
