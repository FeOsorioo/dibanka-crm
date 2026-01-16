<?php

namespace App\Http\Resources\Alliance;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class AllianceSpecialCasesResource extends JsonResource
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
            
            // Agentes relacionados
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id'        => $this->user->id,
                    'name'      => $this->user->name,
                    'email'     => $this->user->email,
                ];
            }),

            // Contactos relacionados
            'contact' => $this->whenLoaded('contact', function () {
                return [
                    'id'                    => $this->contact->id,
                    'campaign'              => $this->contact->campaign,
                    'payroll'               => $this->contact->payroll->name,
                    'name'                  => $this->contact->name,
                    'identification_type'   => $this->contact->identification_type,
                    'identification_number' => $this->contact->identification_number,
                    'phone'                 => $this->contact->phone,
                    'update_phone'          => $this->contact->update_phone ?? null,
                    'email'                 => $this->contact->email,
                ];
            }),

            // operador relacionada
            'operatorEntity' => $this->whenLoaded('operatorEntity', function () {
                return [
                    'id'    => $this->operatorEntity->id,
                    'name'  => $this->operatorEntity->name,
                ];
            }),
            
            'management_messi'  => $this->management_messi,
            'id_call'           => $this->id_call,
            'id_messi'          => $this->id_messi,
            'observations'      => $this->observations,
            'created_at' => $this->created_at
                    ? $this->created_at->format('Y-m-d H:i:s')
                    : null,
        ];
    }
}
