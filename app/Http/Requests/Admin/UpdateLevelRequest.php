<?php

namespace App\Http\Requests\Admin;

use App\Models\Level;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLevelRequest extends FormRequest
{
    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        /** @var Level $level */
        $level = $this->route('level');

        return [
            'code' => ['required', 'string', 'max:10', Rule::unique(Level::class)->ignore($level->id)],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'sort_order' => ['required', 'integer', 'min:1', Rule::unique(Level::class)->ignore($level->id)],
            'is_published' => ['boolean'],
        ];
    }
}
