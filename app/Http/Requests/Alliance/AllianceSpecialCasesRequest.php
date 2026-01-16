<?php

namespace App\Http\Requests\Alliance;

use Illuminate\Foundation\Http\FormRequest;

class AllianceSpecialCasesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id'           => 'required|integer|exists:users,id',
            'contact_id'        => 'required|integer|exists:contacts,id',
            'management_messi'  => 'required|string|max:255',
            'operator_entity_id' => 'integer|exists:operator_entities,id',
            'id_call'           => 'required|string|max:255',
            'id_messi'          => 'required|string|max:255'
        ];
    }

    public function messages()
    {
        return [
            'user_id.required'          => 'El campo de agente es obligatorio',
            'user_id.integer'           => 'El campo de agente debe ser un numero',
            'user_id.exists'            => 'El agente seleccionado no existe en la base de datos',

            'contact_id.required'       => 'El cliente es requerido',
            'contact_id.integer'        => 'El cliente seleccionado debe ser un número',
            'contact_id.exists'         => 'El cliente seleccionado no existe en la base de datos',

            'management_messi.required' => 'La gestión de messi es obligatoria',

            'operator_entity_id.exists' => 'La entidad seleccionada no existe',
            'operator_entity_id.integer' => 'La entidad debe ser un numero',
            
            'id_call.required'          => 'El ID de la llamada es obligatorio',

            'id_messi.required'         => 'El ID de messi es obligatorio'
        ];
    }
}
