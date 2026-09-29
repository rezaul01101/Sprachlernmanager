<?php

namespace App\Http\Resources;

use App\Models\Grammar;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Grammar */
class GrammarResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'imageUrl' => $this->image_url,
            // Detail only: the list omits the (potentially long) HTML body.
            'description' => $this->when($request->route('grammar') !== null, $this->description),
        ];
    }
}
