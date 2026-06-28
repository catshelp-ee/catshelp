<?php

namespace App\Services;

use App\DTOs\Animal\AnimalProfileDTO;
use App\DTOs\Animal\AnimalProfileImageDTO;
use App\DTOs\Animal\AnimalSummaryDTO;
use App\DTOs\TodoDTO;
use App\Models\Animal;
use App\Models\AnimalCharacteristic;
use App\Models\File;
use App\Models\Todo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Carbon\Carbon;


class AnimalService
{
    public static function getProfiles()
    {
        //TODO vajab ümber tegemist. See peaks tagastama kõik loomad. Oleks vaja panna FE kasutama teist õigemat otsa.
        return self::getUserProfiles();
    }

    public static function getUserProfiles()
    {
        $user = Auth::user();
        $animals = $user->fosterHome ? $user->fosterHome->animals : [];

        $dtos = [];
        foreach ($animals as $animal) {
            $dtos[] = AnimalSummaryDTO::fromModel($animal);
        }
        return $dtos;
    }

    public static function getProfile(int $id)
    {
        $animal = Animal::find($id);
        if (!$animal) {
            return null;
        }
        return AnimalProfileDTO::fromModel($animal, self::getImages($animal));
    }

    private static function getImages(Animal $animal): array
    {
        $result = [];
        foreach ($animal->files()->get() as $file) {
            $contents = Storage::get("images/{$file->uuid}.{$file->extension}");
            if ($contents === null) {
                continue;
            }
            $imageData = "data:image/{$file->extension};base64," . base64_encode($contents);
            $result[] = new AnimalProfileImageDTO(
                id: $file->id,
                data: $imageData,
                type: $file->type ?? 'image',
            );
        }
        return $result;
    }

    public static function updateProfile(array $data)
    {
        $animal = Animal::find($data['animalId']);
        if (!$animal) {
            throw new \Exception('Animal not found');
        }

        $animal->name = $data['mainInfo']['name'];
        $animal->birthday = $data['mainInfo']['birthDate'];
        $animal->profile_title = $data['mainInfo']['name'];
        $animal->status = $data['mainInfo']['status'];
        $animal->chip_number = $data['mainInfo']['microchip'];
        $animal->chip_registered_with_us = $data['mainInfo']['chipRegisteredWithUs'];
        $animal->description = $data['mainInfo']['description'];
        $animal->requirements_for_new_family = $data['mainInfo']['specialRequirementsForNewFamily'];
        $animal->additional_notes = $data['mainInfo']['additionalNotes'];
        $animal->chronic_conditions = $data['mainInfo']['chronicConditions'];

        $animal->update($data);

        $personalityTraits = [
            'bold',
            'shy',
            'active',
            'veryActive',
            'calm',
            'friendly',
            'grumpy',
            'vocal',
            'dislikesTouching',
            'sociable',
            'aloof',
            'goodAppetite',
            'curious',
            'playful',
            'stressed',
            'sensitive',
            'peaceful',
            'selfish',
            'hisses',
            'sleepsCuddling',
            'likesPetting',
            'likesAttention',
            'likesPlayingWithPeople',
            'likesPlayingAlone',
            'usesLitterbox',
            'usesScratchingpost',
            'selectiveWithFood',
            'adaptable',
            'scratchesFurniture',
            'trusting',
            'attitudeTowardsCats',
            'attitudeTowardsDogs',
            'attitudeTowardsChildren',
            'attitudeTowardsChildren',
            'suitabilityForIndoorOrOutdoor',
        ];

        foreach ($personalityTraits as $trait) {
            AnimalCharacteristic::updateOrCreate(
                ['animal_id' => $animal->id, 'type' => $trait],
                ['value' => $data['personalityInfo'][$trait] ?? null]
            );
        }

        $mainInfoTraits = ['coatColour', 'coatLength', 'gender', 'spayedOrNeutered'];

        foreach ($mainInfoTraits as $trait) {
            AnimalCharacteristic::updateOrCreate(
                ['animal_id' => $animal->id, 'type' => $trait],
                ['value' => $data['mainInfo'][$trait] ?? null]
            );
        }

        self::saveImages($animal, $data['images'] ?? []);

        return AnimalProfileDTO::fromModel($animal);
    }

    private static function saveImages(Animal $animal, array $images): void
    {
        $existingFiles = $animal->files()->get();
        $existingIds = $existingFiles->pluck('id')->toArray();
        $updatedIds = collect($images)->pluck('id')->filter()->toArray();

        self::updateProfileImage($existingFiles, $images);

        $newImages = array_filter($images, fn($img) => !in_array($img['id'] ?? 0, $existingIds));
        self::saveNewImages($newImages, $animal->id);

        $removedFiles = $existingFiles->filter(fn($file) => !in_array($file->id, $updatedIds));
        self::deleteRemovedImages($removedFiles);
    }

    private static function saveNewImages(array $newImages, int $animalId): void
    {
        foreach ($newImages as $image) {
            $base64 = preg_replace('/^data:image\/\w+;base64,/', '', $image['data']);
            if (!preg_match('/^[-A-Za-z0-9+\/]*={0,3}$/', $base64)) {
                throw new \InvalidArgumentException('Invalid base64 image data');
            }
            $uuid = (string) Str::uuid();
            Storage::put("images/{$uuid}.jpg", base64_decode($base64));

            File::create([
                'animal_id' => $animalId,
                'uuid' => $uuid,
                'extension' => 'jpg',
                'type' => $image['type'] ?? 'image',
            ]);
        }
    }

    private static function updateProfileImage(\Illuminate\Support\Collection $existingFiles, array $newImages): void
    {
        $oldProfileFile = $existingFiles->firstWhere('type', 'profile');
        $newProfileImage = collect($newImages)->firstWhere('type', 'profile');

        if ($oldProfileFile && (!$newProfileImage || $oldProfileFile->id !== ($newProfileImage['id'] ?? null))) {
            $oldProfileFile->type = 'image';
            $oldProfileFile->save();
        }

        if ($newProfileImage && ($newProfileImage['id'] ?? 0) !== 0 && (!$oldProfileFile || $oldProfileFile->id !== $newProfileImage['id'])) {
            $newProfileFile = $existingFiles->firstWhere('id', $newProfileImage['id']);
            if ($newProfileFile) {
                $newProfileFile->type = 'profile';
                $newProfileFile->save();
            }
        }
    }

    private static function deleteRemovedImages(\Illuminate\Support\Collection $removedFiles): void
    {
        foreach ($removedFiles as $file) {
            Storage::delete("images/{$file->uuid}.jpg");
            $file->delete();
        }
    }

    public static function findAnimal(array $criteria)
    {
        $query = Animal::query();

        if (!empty($criteria['name'])) {
            $query->where('name', 'like', '%' . $criteria['name'] . '%');
        }

        if (!empty($criteria['chip_number'])) {
            $query->where('chip_number', $criteria['chip_number']);
        }

        $animal = $query->first();
        if ($animal)
        {
            return AnimalProfileDTO::fromModel($animal);
        }
        return null;
    }

    public static function getTodos(int $id)
    {
        $todos = Todo::where('animal_id', $id)->get();

        $now = Carbon::now()->startOfDay();

        $grouped = [
            'today' => [],
            'soon' => [],
            'later' => [],
            'completed' => [],
        ];

        $animalName = Animal::find($id)->name;
        foreach ($todos as $todo) {

            $model = TodoDTO::fromModel($todo, $animalName);
            $twoWeeksAgo = Carbon::parse($todo->due_date)->subWeeks(2)->startOfDay();


            if ($model == null){
                continue;
            }

            // completed always wins
            if (!empty($todo->completed_date)) {
                $grouped['completed'][] = $model;
                continue;
            }

            $date = Carbon::parse($todo->due_date);

            // today or past → today
            if ($date <= $now) {
                $grouped['today'][] = $model;
                continue;
            }

            // within 2 weeks → soon
            if ($twoWeeksAgo <= $now && $now <= $date ) {
                $grouped['soon'][] = $model;
                continue;
            }

            // more than 2 weeks → later
            $grouped['later'][] = $model;
        }

        return $grouped;
    }

    public static function updateTodo(int $id, array $data)
    {
        $todo = Todo::findOrFail($id);

        // If marking as completed, auto-set timestamp if not provided
        if (isset($data['completed_date']) && !$data['completed_date']) {
            $data['completed_date'] = Carbon::now();
        }

        // Optional: enforce completion logic
        if (!empty($data['completed_date']) && !$todo->completed_date) {
            $data['completed_date'] = Carbon::now();
        }

        $todo->update($data);

        return $todo->fresh();
    }

}
