<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            // Campaña relacionada
            'campaign' => $this->whenLoaded('campaign', function () {
                return [
                    'id'    => $this->campaign->id,
                    'name'  => $this->campaign->name,
                ];
            }),
            // Pagaduria relacionada
            'payroll' => $this->whenLoaded('payroll', function () {
                return [
                    'id'    => $this->payroll->id,
                    'name'  => $this->payroll->name,
                    'description' => $this->payroll->description,
                    'img_payroll' => $this->payroll->img_payroll 
                        ? asset('storage/' . $this->payroll->img_payroll) 
                        : null,
                    'i_title' => $this->payroll->i_title,
                    'i_description' => $this->payroll->i_description,
                    'i_phone' => $this->payroll->i_phone,
                    'i_email' => $this->payroll->i_email,
                    'is_active' => $this->payroll->is_active,
                    'created_at' => $this->payroll->created_at?->format('Y-m-d H:i:s'),
                ];
            }),
            // Entidad relacionada
            'entity' => $this->whenLoaded('entity', function () {
                return [
                    'id'    => $this->entity->id,
                    'name'  => $this->entity->name,
                ];
            }),
            'name' => $this->name,
            'identification_type' => $this->identification_type,
            'identification_number' => $this->identification_number,
            'phone' => $this->phone,
            'update_phone' => $this->update_phone,
            'email' => $this->email,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'is_active' => $this->is_active
        ];
    }
}
