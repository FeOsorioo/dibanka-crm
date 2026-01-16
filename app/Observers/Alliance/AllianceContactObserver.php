<?php

namespace App\Observers\Alliance;

use App\Models\Alliance\AllianceContact;
use App\Models\ChangeHistory;

class AllianceContactObserver
{
    public function created(AllianceContact $contact)
    {
        ChangeHistory::create([
            'entity_type' => AllianceContact::class,
            'entity_id' => $contact->id,
            'action' => 'created',
            'new_values' => $contact->getAttributes(),
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function updated(AllianceContact $contact)
    {
        ChangeHistory::create([
            'entity_type' => AllianceContact::class,
            'entity_id' => $contact->id,
            'action' => 'updated',
            'old_values' => $contact->getOriginal(),
            'new_values' => $contact->getChanges(),
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function deleted(AllianceContact $contact)
    {
        ChangeHistory::create([
            'entity_type' => AllianceContact::class,
            'entity_id' => $contact->id,
            'action' => 'deleted',
            'old_values' => $contact->getAttributes(),
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
