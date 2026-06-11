<?php

namespace App\DTOs;

use App\Models\User;

readonly class UserDTO
{
    public function __construct(
        public int $id,
        public string $full_name,
        public string $email,
        public ?string $identity_code,
        public ?string $citizenship,
        public string $role,
        public string $created_at,
    ) {}

    public static function fromModel(User $user): self
    {
        return new self(
            id: $user->id,
            full_name: $user->full_name,
            email: $user->email,
            identity_code: $user->identity_code,
            citizenship: $user->citizenship,
            role: $user->role,
            created_at: $user->created_at,
        );
    }
}