<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Specific;
use Illuminate\Validation\Rule;

class SpecificRequest extends FormRequest
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
        $specificConsultID = $this->route('specifics') ?->id;
        return [
            'name'              => 'required|string|max:255',
            'consultation_id'   => 'required|integer|exists:consultations,id'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El motivo especifico es obligatorio.',
            'name.string'   => 'El motivo especifico debe ser una cadena de texto.',
            'name.max'      => 'El motivo especifico no debe exceder los 255 caracteres.',

            'consultation_id.required' => 'La consulta es requerida',
            'consultation_id.exists' => 'La consulta seleccionada no existe'
        ];
    }
}
