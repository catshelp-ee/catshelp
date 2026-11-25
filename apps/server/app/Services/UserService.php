<?php

namespace App\Services;

use App\DTOs\UserDTO;
use App\DTOs\Animal\AnimalSummaryDTO;
use App\Models\User;
use App\Models\Todo;
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

    /**
     * Resolve the user whose data is being requested, or null if the
     * current user is not allowed to access it / it does not exist.
     */
    private static function resolveAccessibleUser(string $id): ?User
    {
        $currentUser = Auth::user();
        if (!$currentUser) {
            return null;
        }

        if ($currentUser->id != $id && $currentUser->role !== UserRole::ADMIN->value) {
            return null;
        }

        if ($currentUser->id == $id) {
            return $currentUser;
        }

        return User::find($id);
    }

    public static function getUserAnimals(string $id) {
        $user = self::resolveAccessibleUser($id);
        if (!$user) {
            return [];
        }

        $animals = $user->fosterHome ? $user->fosterHome->animals : [];
        $dtos = [];
        foreach ($animals as $animal) {
            $dtos[] = AnimalSummaryDTO::fromModel($animal);
        }
        return $dtos;
    }

    /**
     * Get the todos of all animals in the user's foster home, grouped
     * into today / soon / later / completed.
     */
    public static function getUserTodos(string $id) {
        $user = self::resolveAccessibleUser($id);
        $animalIds = $user?->fosterHome
            ? $user->fosterHome->animals()->pluck('animals.id')
            : collect();

        $todos = Todo::with('animal')
            ->whereIn('animal_id', $animalIds)
            ->get();

        return AnimalService::groupTodos($todos);
    }

    public static function getCurrentUser() {
        $user = Auth::user();
        if (!$user) {
            return null;
        }
        return UserDTO::fromModel($user);
    }
}
