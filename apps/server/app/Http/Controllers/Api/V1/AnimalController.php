<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\AnimalService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Enums\UserRole;

class AnimalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        if (!$user || $user->role !== UserRole::ADMIN->value) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json(AnimalService::getProfiles());
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $animal = AnimalService::getProfile($id);
        if (!$animal) {
            return response()->json(['message' => 'Animal not found'], 404);
        }
        return response()->json($animal);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        return response()->json(AnimalService::updateProfile($request->all()));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //TODO Not implemented yet
    }

    public function profileImage(int $id)
    {
        $file = AnimalService::getProfileImageFile($id);
        if (!$file) {
            return response()->json(['message' => 'Image not found'], 404);
        }

        return Storage::response(
            "images/{$file->uuid}.{$file->extension}",
            null,
            ['Cache-Control' => 'private, max-age=86400']
        );
    }

    public function todos(int $id)
    {
        return response()->json(AnimalService::getTodos($id));
    }

    public function updateTodo(Request $request, int $id){
        return response()->json(AnimalService::updateTodo($id, $request->all()));
    }

    public function findAnimal(Request $request) {
        return response()->json(AnimalService::findAnimal($request->all()));
    }
}