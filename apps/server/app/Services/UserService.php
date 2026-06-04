<?php

namespace App\Services;

use App\DTOs\UserDTO;
use App\DTOs\Animal\AnimalSummaryDTO;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserService
{
    public static function getUsers() {
        //TODO add admin check to allow fetching other users' profiles
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
        //TODO add admin check to allow fetching other users' profiles
        $user = User::find($id);
        $dto = UserDTO::fromModel($user);
        return $dto;
    }

    public static function getUserAnimals(string $id) {
        $user = User::find($id);
        if (!$user) {
            return null;
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
