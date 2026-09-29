<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreGrammarRequest extends FormRequest
{
    /**
     * Tags the rich-text editor can produce. Anything else is stripped.
     */
    private const ALLOWED_TAGS = '<p><br><strong><em><u><s><h2><h3><ul><ol><li><blockquote>';

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:65535'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'remove_image' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Sanitised copy of the validated input: the description is reduced to the
     * editor's tag allowlist with all attributes removed, so stored HTML can't
     * carry scripts or event handlers, and an empty editor ("<p></p>") is null.
     *
     * @return array{title: string, description: string|null}
     */
    public function grammarData(): array
    {
        $data = $this->validated();

        $html = strip_tags((string) ($data['description'] ?? ''), self::ALLOWED_TAGS);
        $html = preg_replace('/<([a-z0-9]+)\b[^>]*>/i', '<$1>', $html) ?? '';

        return [
            'title' => $data['title'],
            'description' => trim(strip_tags($html)) === '' && ! preg_match('/<(ul|ol)>/i', $html) ? null : $html,
        ];
    }
}
