<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\AnimalService;

class AnimalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(["profiles" => AnimalService::getProfiles()]);
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
}
