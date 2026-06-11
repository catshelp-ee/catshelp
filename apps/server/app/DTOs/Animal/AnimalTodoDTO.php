<?php

namespace App\DTOs\Animal;

use App\Models\Animal;

readonly class AnimalTodoDTO
{
    public function __construct(
        public string $label,
        public string $assignee,
        public \DateTime $due,
        public bool $completed,
    ) {}

    public static function fromModel(Animal $animal, string $profilePicture): self
    {
        //TODO 
        return new self(
            label: '',
            assignee: '',
            due: new \DateTime(),
            completed: false,
        );
    }
}