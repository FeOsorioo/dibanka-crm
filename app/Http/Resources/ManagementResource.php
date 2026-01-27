<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ManagementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'wolkvox_id' => $this->wolkvox_id,
            'solution'  => $this->solution,            
            'comments'  => $this->comments,
            'solution_date' => $this->solution_date,
            
            'sms'       => $this->sms,
            'wsp'       => $this->wsp,

            // Usuario relacionado 
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id'    => $this->user->id,
                    'name'  => $this->user->name,
                    'email' => $this->user->email,
                    'is_active' => $this->user->is_active
                ];
            }),

            // Pagaduria relacionada
            'payroll' => $this->whenLoaded('payroll', function () {
                return [
                    'id'        => $this->payroll->id,
                    'name'      => $this->payroll->name,
                    'is_active' => $this->payroll->is_active
                ];
            }),

            // Contacto relacionado
            'contact' => $this->whenLoaded('contact', function () {
                return [
                    'id'                    => $this->contact->id,
                    'name'                  => $this->contact->name,
                    'identification_type'   => $this->contact->identification_type,
                    'identification_number' => $this->contact->identification_number,
                    'phone'                 => $this->contact->phone,
                    'update_phone'          => $this->contact->update_phone,
                    'email'                 => $this->contact->email,
                    'campaign'              => $this->contact->campaign,
                    'payroll'               => $this->contact->payroll,
                    'is_active'             => $this->contact->is_active
                ];
            }),

            // Consulta relacionada
            'consultation' => $this->whenLoaded('consultation', function () {
                return [
                    'id'        => $this->consultation->id,
                    'name'      => $this->consultation->name,
                    'is_active' => $this->consultation->is_active
                ];
            }),


            // Specific (opcional)
            'specific' => $this->whenLoaded('specific', function () {
                // Si es null, devolver null
                if (!$this->specific) {
                    return null;
                }

                return [
                    'id'        => $this->specific->id,
                    'name'      => $this->specific->name,
                    'is_active' => $this->specific->is_active,
                ];
            }),
            
            // tipo de gestion relacionada
            'type_management' => $this->whenLoaded('type_management', function () {
                return[
                    'id'                => $this->type_management->id,
                    'name'              => $this->type_management->name,
                    'is_active'         => $this->type_management->is_active
                ];
            }),

            // Seguimiento relacionada
            'monitoring' => $this->whenLoaded('monitoring', function () {
                return [
                    'id'            => $this->monitoring->id,
                    'name'          => $this->monitoring->name,
                    'is_active'     => $this->monitoring->is_active
                ];
            }),

            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
