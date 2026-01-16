<?php

namespace App\Http\Requests\Affiliate;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Affiliate\Consultation;
use Illuminate\Validation\Rule;

class AffiliateConsultationRequest extends FormRequest
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
        $consultID = $this->route('affiliate_consultations') ?->id;

        return [
            'name'          => 'required|string|max:255|min:1',
            'payroll_ids'    => 'required|array|exists:payrolls,id'
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El campo motivo de consulta es obligatorio.',
            'name.string'   => 'El campo motivo de consulta debe ser una cadena de texto.',
            'name.max'      => 'El campo motivo de consulta no debe exceder los 255 caracteres.',

            'payroll_ids.required' => 'La pagaduria es obligatoria.',
            'payroll_ids.exists' => 'La pagaduria seleccionada no existe.'
        ];
    }
}
