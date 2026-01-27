<?php

namespace App\Observers;

use App\Models\Entity;
use App\Models\ChangeHistory;

class EntityObserver
{
    public function created(Entity $entity)
    {
        ChangeHistory::create([
            'entity_type' => Entity::class,
            'entity_id' => $entity->id,
            'action' => 'created',
            'new_values' => $entity->getAttributes(),
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function updated(Entity $entity)
    {
        ChangeHistory::create([
            'entity_type' => Entity::class,
            'entity_id' => $entity->id,
            'action' => 'updated',
            'old_values' => $entity->getOriginal(),
            'new_values' => $entity->getChanges(),
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function deleted(Entity $entity)
    {
        ChangeHistory::create([
            'entity_type' => Entity::class,
            'entity_id' => $entity->id,
            'action' => 'deleted',
            'old_values' => $entity->getAttributes(),
            'user_id' => auth()->id(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
