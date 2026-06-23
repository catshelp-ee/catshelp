<?php

namespace App\DTOs\Animal;

use App\Models\Animal;
use Illuminate\Support\Facades\Storage;

readonly class AnimalSummaryDTO
{
    public function __construct(
        public int $id,
        public string $name,
        public string $profilePicture,
    ) {}

    public static function fromModel(Animal $animal): self
    {
        $profileFile = $animal->files()->where('type', 'profile')->first();
        $imageData = '';
        if ($profileFile) {
            $contents = Storage::get("images/{$profileFile->uuid}.{$profileFile->extension}");
            if ($contents !== null) {
                $imageData = "data:image/{$profileFile->extension};base64," . base64_encode($contents);
            }
        }
        return new self(
            id: $animal->id,
            name: $animal->name,
            profilePicture: $imageData,
        );
    }
}
