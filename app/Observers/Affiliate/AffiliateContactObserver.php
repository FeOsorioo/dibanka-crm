<?php

namespace App\Observers;

use App\Models\Contact;
use App\Models\ChangeHistory;

class ContactObserver
{
    public function created(Contact $contact)
    {
        ChangeHistory::create([
            'entity_type' => Contact::class,
            'entity_id' => $contact->id,
            'action' => 'created',
            'new_values' => $contact->getAttributes(),
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function updated(Contact $contact)
    {
        ChangeHistory::create([
            'entity_type' => Contact::class,
            'entity_id' => $contact->id,
            'action' => 'updated',
            'old_values' => $contact->getOriginal(),
            'new_values' => $contact->getChanges(),
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function deleted(Contact $contact)
    {
        ChangeHistory::create([
            'entity_type' => Contact::class,
            'entity_id' => $contact->id,
            'action' => 'deleted',
            'old_values' => $contact->getAttributes(),
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
