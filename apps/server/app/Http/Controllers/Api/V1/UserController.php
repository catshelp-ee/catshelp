<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\UserService;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(UserService::getUsers());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //Not implemented yet
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json(UserService::getUser($id));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //Not implemented yet
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //Not implemented yet
    }

    /**
     * Display a listing of the user's animals.
     */
    public function getUserAnimals(string $id)
    {
        return response()->json(UserService::getUserAnimals($id));
    }
}
