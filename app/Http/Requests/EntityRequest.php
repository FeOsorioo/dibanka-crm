<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EntityRequest extends FormRequest
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
            'name' => 'required',
            'phone' => 'numeric',
            'email' => 'email',
            'nit' => 'string',
            'description' => 'string',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'phone.numeric' => 'El teléfono debe ser un número.',
            'email.email' => 'El correo electrónico debe ser válido.',
            'nit.string' => 'El NIT debe ser una cadena de texto.',
            'description.string' => 'La descripción debe ser una cadena de texto.',
        ];
    }
}
