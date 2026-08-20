<?php

namespace App\Services;

use App\DTOs\UserDTO;
use App\DTOs\Animal\AnimalSummaryDTO;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Enums\UserRole;

class UserService
{
    public static function getUsers() {
        $users = User::all();
        $dtos = [];
        foreach ($users as $user) {
            $dtos[] = UserDTO::fromModel($user);
        }
        return $dtos;
    }

    public static function getUser(string $id)
    {
        if ($id === 'NaN') {
            //TODO remove hack
            return self::getCurrentUser();
        }

        if ($id === 'me') {
            return self::getCurrentUser();
        }

        $user = User::find($id);
        $dto = UserDTO::fromModel($user);
        return $dto;
    }

    public static function getUserAnimals(string $id) {
        $currentUser = Auth::user();
        if ($currentUser->id != $id && $currentUser->role !== UserRole::ADMIN->value) {
            return [];
        }
        
        $user = null;
        if ($currentUser->id === $id) {
            $user = $currentUser;
        } else {
            $user = User::find($id);
            if (!$user) {
                return [];
            }
        }

        $animals = $user->fosterHome ? $user->fosterHome->animals : [];
        $dtos = [];
        foreach ($animals as $animal) {
            $dtos[] = AnimalSummaryDTO::fromModel($animal);
        }
        return $dtos;
    }

    public static function getCurrentUser() {
        $user = Auth::user();
        if (!$user) {
            return null;
        }
        return UserDTO::fromModel($user);
    }
}
