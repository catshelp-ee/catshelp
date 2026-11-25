<?php

namespace App\Console\Commands;

use App\Console\TransactionalCommand;
use App\Models\Animal;
use App\Models\Todo;
use App\Models\Treatment;
use Carbon\Carbon;

class CreateTodosFromTreatments extends TransactionalCommand
{
    protected $signature = 'command:todos:create-from-treatments';
    protected $description = 'Create todos for treatments whose next visit date is approaching or that are missing';

    /**
     * treatment_name => [todo type, how long before next_visit_date the todo is created].
     */
    private const TREATMENT_TODOS = [
        'COMPLEX_VACCINE'      => ['type' => 'VAC',        'lead' => '1 month'],
        'RABIES_VACCINE'       => ['type' => 'RABIES-VAC', 'lead' => '1 month'],
        'DEWORMING_MEDICATION' => ['type' => 'DEWORM',     'lead' => '1 month'],
    ];

    private int $created = 0;
    private int $renewed = 0;

    public function handle(): int
    {
        $now = Carbon::now();

        $animals = Animal::with(['treatments' => fn ($query) => $query
            ->where('active', true)
            ->whereNotNull('next_visit_date')
            ->whereIn('treatment_name', array_keys(self::TREATMENT_TODOS)),
        ])->get();

        foreach ($animals as $animal) {
            foreach (self::TREATMENT_TODOS as $treatmentName => $config) {
                /** @var Treatment|null $treatment */
                $treatment = $animal->treatments->firstWhere('treatment_name', $treatmentName);

                if ($treatment === null) {
                    $this->createMissingTreatmentTodo($animal->id, $config['type'], $now);
                    continue;
                }

                $dueDate = Carbon::parse($treatment->next_visit_date);

                if ($now->lt($dueDate->copy()->sub($config['lead']))) {
                    continue;
                }

                $this->upsertTodo($animal->id, $config['type'], $dueDate);
            }
        }

        $this->info("Todos: {$this->created} created, {$this->renewed} renewed.");

        return self::SUCCESS;
    }

    /**
     * The animal has no known treatment of this type: it is due now.
     * An existing todo is left untouched so its due date doesn't move forward on every run.
     */
    private function createMissingTreatmentTodo(int $animalId, string $type, Carbon $now): void
    {
        $todo = Todo::firstOrCreate(
            ['animal_id' => $animalId, 'type' => $type],
            ['due_date' => $now->copy()->startOfDay()],
        );

        if ($todo->wasRecentlyCreated) {
            $this->created++;
        }
    }

    private function upsertTodo(int $animalId, string $type, Carbon $dueDate): void
    {
        // todos are unique per (animal_id, type), so one row is reused across cycles.
        $todo = Todo::firstOrNew(['animal_id' => $animalId, 'type' => $type]);

        if (!$todo->exists) {
            $todo->due_date = $dueDate;
            $todo->save();
            $this->created++;
            return;
        }

        // Same cycle: keep the todo as is (including its completion state).
        if ($todo->due_date && $todo->due_date->eq($dueDate)) {
            return;
        }

        // A new visit moved the next visit date: start a new cycle.
        $todo->due_date = $dueDate;
        $todo->completed_date = null;
        $todo->save();
        $this->renewed++;
    }
}
