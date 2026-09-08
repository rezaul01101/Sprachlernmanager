<?php

namespace App\Http\Requests\Admin;

use App\Models\Day;
use App\Models\Level;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDayRequest extends FormRequest
{
    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        /** @var Level $level */
        $level = $this->route('level');
        /** @var Day $day */
        $day = $this->route('day');

        return [
            'day_number' => [
                'required',
                'integer',
                'min:1',
                Rule::unique(Day::class)->where('level_id', $level->id)->ignore($day->id),
            ],
            'focus_text' => ['required', 'string'],
            'is_published' => ['boolean'],
        ];
    }
}
