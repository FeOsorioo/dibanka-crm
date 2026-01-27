<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ManagementRequest extends FormRequest
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
            'consultation_id'   => 'required|integer|exists:consultations,id',
            'specific_id'       => 'nullable|integer|exists:specifics,id',
            'monitoring_id'     => 'nullable|integer|exists:monitoring,id',
            'type_management_id'=> 'required|integer|exists:type_management,id',

            'wolkvox_id'        => 'required|string',
            'solution_date'     => 'nullable|date',
            'comments'          => 'nullable|string',
            'sms'               => 'required|boolean',
            'solution'          => 'required|boolean',
            'wsp'               => 'required|boolean'
        ];
    }

    public function messages()
    {
        return [
            // Validaciones agentes
            'user_id.required'  => 'El agente es requerido',
            'user_id.exists'    => 'El agente seleccionado no existe',
            'user_id_.integer'  => 'El agente debe ser un numero',
            
            // Validaciones contacto/cliente
            'contact_id.required'  => 'El cliente es requerido',
            'contact_id.exists'    => 'El cliente seleccionado no existe',
            'contact_id_.integer'  => 'El cliente debe ser un numero',
            
            // Validaciones para consultas
            'consultation_id.required'  => 'La consulta es requerida',
            'consultation_id.exists'    => 'La consulta seleccionada no existe',
            'consultation_id_.integer'  => 'La consulta debe ser un numero',
            
            // Validaciones para consultas especificas
            'specific_id.exists'    => 'La consulta especifica seleccionada no existe',
            'specific_id.integer'  => 'La consulta especifica debe ser un numero',

            //Validaciones para los tipos de gestiones
            'type_management_id.required' => 'El tipo de gestión es obligatorio',
            'type_management_id.exists' => 'El tipo de gestión seleccionado no existe',
            'type_management_id.integer' => 'El tipo de gestión debe ser un numero',

            // Validaciones para el seguimiento
            'monitoring_id.exists' => 'El seguimiento seleccionado no existe',

            // Validaciones para el resto de las columnas
            'solution.required'     => 'La solucion es requerida',
            'solution.boolean'       => 'La solucion debe ser verdadero o falso',

            'comments.string'       => 'La solucion debe ser una cadena de texto',
            
            'sms.required'     => 'El campo SMS es requerido',
            'sms.boolean'       => 'El campo SMS debe ser verdadero o falso',
            
            'wsp.required'     => 'El campo Whatsap es requerido',
            'wsp.boolean'       => 'El campo Whatsap debe ser verdadero o falso',

            'wolkvox_id.required' => 'El wolkvox_id es obligatorio',
            'wolkvox_id. string' => 'El wolkvox_id tiene que ser una cadena de texto'
        ];
    }
}
