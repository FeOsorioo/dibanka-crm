<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PayrollConsultationRequest extends FormRequest
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
    public function rules()
    {
        return [
            'payroll_id' => 'required|exists:payrolls,id',
            'consultation_id' => 'required|exists:consultations,id',
        ];
    }
    
    public function messages(): array
    {
        return [
            'payroll_id.required' => 'El campo pagaduría es obligatorio.',
            'payroll_id.exists' => 'El campo pagaduría no existe.',

            'consultation_id.required' => 'El campo consulta es obligatorio.',
            'consultation_id.exists' => 'El campo consulta no existe.',
        ];
    }
}