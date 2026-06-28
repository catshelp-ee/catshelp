<?php

namespace App\DTOs;

use Carbon\Carbon;
use App\Models\Todo;

readonly class TodoDTO
{
    public function __construct(
        public int $id,
        public string $message,
        public string $assignee,
        public ?\DateTime $completed_date,
        public \DateTime $due_date,
        public string $action_label,
        public string $action_redirect,
    ) {}

    public static function vaccinationModel(Todo $todo, string $animalName): ?self
    {
        $date = Carbon::parse($todo->due_date);

        if (Carbon::now() <= $date->subYear()) {
            return null;
        }

        return new self(
            id: $todo->id,
            assignee: $animalName,
            message: "Broneeri veterinaari juures vaktsineerimise aeg",
            completed_date: $todo->completed_date,
            due_date: $todo->due_date,
            action_label: "Broneeri aeg",
            action_redirect: "https://www.petcity.ee",
        );
    }

    public static function dewormingModel(Todo $todo, string $animalName): ?self
    {
        $date = Carbon::parse($todo->due_date);

        if (Carbon::now() <= $date->subMonths(2)) {
            return null;
        }

        return new self(
            id: $todo->id,
            assignee: $animalName,
            message: "Anna 2 nädalat enne vaktsineerimist ussirohi",
            completed_date: $todo->completed_date,
            due_date: $todo->due_date,
            action_label: "Juhend",
            action_redirect: "https://docs.google.com/document/d/1fJeYtNlLr8Bw_XJ18tr0bQcuupCYtaQAtK2Yfs7LhQo/edit?usp=sharing",
        );
    }


    public static function rabiesVaccinationModel(Todo $todo, string $animalName): ?self
    {
        $date = Carbon::parse($todo->due_date);

        if (Carbon::now() <= $date->subYear()) {
            return null;
        }

        return new self(
            id: $todo->id,
            assignee: $animalName,
            message: "Broneeri veterinaari juures marutaudi vaktsineerimise aeg",
            completed_date: $todo->completed_date,
            due_date: $todo->due_date,
            action_label: "Broneeri aeg",
            action_redirect: "https://www.petcity.ee",
        );
    }


    public static function fromModel(Todo $todo, string $animalName): ?self
    {
        $date = Carbon::parse($todo->due_date);

        if ($todo->completed_date != null && Carbon::now() >= Carbon::parse($todo->completed_date)->addWeeks(2)) {
            return null;
        }

        switch ($todo->type) {
            case 'VAC':
                return self::vaccinationModel($todo, $animalName);
            case 'RABIES-VAC':
                return self::rabiesVaccinationModel($todo, $animalName);
            case 'DEWORM':
                return self::dewormingModel($todo, $animalName);
        }
        return null;
    }
}
