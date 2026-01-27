<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConsultationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                    => $this->id,
            'name'                  => $this->name,
            'payrolls'  => $this->payrolls->map(function ($payroll) {
                return [
                    'id'   => $payroll->id,
                    'name' => $payroll->name,
                ];
            }),            
            'is_active'             => $this->is_active,
            'created_at'            => $this->created_at->format('Y-m-d H:i:s')
        ];
    }
}