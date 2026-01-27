<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SpecificResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'consultation' => [
                'id' => optional($this->consultation)->id,
                'name' => optional($this->consultation)->name,
                'payrolls' => optional($this->consultation)->payrolls->map(function($payroll) {
                    return [
                        'id' => $payroll->id,
                        'name' => $payroll->name,
                    ];
                }) ?? [],
            ],
            'is_active' => $this->is_active,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}