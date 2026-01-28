<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Contact;

class ContactRequest extends FormRequest
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
        // Si la ruta es de actualización (PUT)
        if ($this->isMethod('put')) {
            return [
                'email' => 'required|email|max:255',
            ];
        }

        $contactID = $this->route('contacts')?->id;
        return [
            'campaign_id'      => 'required',
            'payroll_id'    => 'required|numeric',
            'payroll_id.*'  => 'integer|exists:payrolls,id',
            'entity_id'     => 'numeric|exists:entities,id|nullable',
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|max:255',
            'phone'         => 'required|digits:10',
            'update_phone'  => 'required|digits:10',
            'identification_type'   => 'required|string',
            'identification_number' => ['required','numeric', Rule::unique(Contact::class)->ignore($contactID)], 
        ];
    }

    public function messages()
    {
        return [
            'campaign_id.required'     => 'El campo campaña es obligatorio.',

            'payroll_id.required'   => 'Debe seleccionar al menos una pagaduría',
            'payroll_id.*.exists'   => 'La pagaduría seleccionada no existe',
            'payroll_id.numeric'     => 'El campo pagaduría es erroneo',

            'entity_id.exists'       => 'La entidad seleccionada no existe',
            'entity_id.numeric'      => 'El campo entidad es erroneo',

            'name.required'         => 'El campo nombre es obligatorio.',
            'name.string'           => 'El campo nombre debe ser una cadena de texto.',
            'name.max'              => 'El campo nombre no debe exceder los 255 caracteres.',

            'email.required'        => 'El campo correo electrónico es obligatorio.',
            'email.email'           => 'El campo correo electrónico debe ser una dirección de correo válida.',
            'email.max'             => 'El campo correo electrónico no debe exceder los 255 caracteres.',

            'phone.digits'          => 'El campo teléfono debe tener exactamente 10 dígitos.',
            'phone.required'        => 'El campo teléfono es obligatorio.',

            'update_phone.digits'   => 'El campo celular actualizado debe tener exactamente 10 dígitos.',
            'update_phone.required' => 'El campo celular actualizado es obligatorio',

            'identification_type.required'  => 'El campo tipo de identificación es obligatorio.',

            'identification_number.required'=> 'El campo número de identificación es obligatorio.',
            'identification_number.numeric'  => 'El campo número de identificación debe ser numérico.',
            'identification_number.unique'  => 'El número de identificación ya está en uso. Por favor, elige otro.',
        ];
    }
}
