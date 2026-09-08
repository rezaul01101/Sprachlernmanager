<?php

namespace App\Http\Resources;

use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Level */
class LevelResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'code' => $this->code,
            'title' => $this->title,
            'description' => $this->description,
            'days' => $this->days_count,
        ];
    }
}
