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
            'consultation' => $this->consultation ? [
                'id' => $this->consultation->id,
                'name' => $this->consultation->name,
                'campaign' => $this->consultation->campaign->map(function($campaign) {
                    return [
                        'id' => $campaign->id,
                        'name' => $campaign->name,
                    ];
                }),
                'payrolls' => $this->consultation->payrolls->map(function($payroll) {
                    return [
                        'id' => $payroll->id,
                        'name' => $payroll->name,
                    ];
                }),
            ] : null,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}