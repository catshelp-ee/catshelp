import { animalsApi } from '@api/animals.service.ts';
import type { AnimalSummary } from '@interfaces/animal-summary.ts';
import type { AnimalTodo, AnimalTodos } from '@interfaces/animal-todo.ts';
import { useEffect, useState } from 'react';

export function useTodos(selectedAnimalId: number | 'all', animals: AnimalSummary[]) {
    const [todos, setTodos] = useState<AnimalTodos>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    async function completeTask(todoId: number) {
        if (!todos) {
            return;
        }

        await animalsApi.completeTodo(todoId);

        let found: AnimalTodo | undefined;

        const updatedGroups = {
            today: todos.today.filter((t: AnimalTodo) => {
                if (t.id === todoId) {
                    found = t;
                    return false;
                }
                return true;
            }),
            soon: todos.soon.filter((t: AnimalTodo) => {
                if (t.id === todoId) {
                    found = t;
                    return false;
                }
                return true;
            }),
            later: todos.later.filter((t: AnimalTodo) => {
                if (t.id === todoId) {
                    found = t;
                    return false;
                }
                return true;
            }),
            completed: todos.completed,
        };

        if (found) {
            updatedGroups.completed = [
                ...todos.completed,
                {
                    ...found,
                    completed_date: new Date().toISOString(),
                },
            ];
        }

        setTodos(updatedGroups);
    }

    useEffect(() => {
        const selectedAnimals = selectedAnimalId === 'all' ? animals : [animals.find((a) => a.id === Number(selectedAnimalId))];

        if (selectedAnimals === undefined || selectedAnimals.length === 0) {
            return;
        }

        const fetchTodos = async () => {
            setLoading(true);
            setError(null);

            try {
                const allTodos: AnimalTodos = {
                    today: [],
                    soon: [],
                    later: [],
                    completed: [],
                };
                for (let i = 0; i < selectedAnimals.length; i++) {
                    const animalSummary = selectedAnimals[i];

                    if (!animalSummary) {
                        continue;
                    }

                    const todos = await animalsApi.getTodos(animalSummary.id);
                    allTodos.today.push(...todos.today);
                    allTodos.soon.push(...todos.soon);
                    allTodos.later.push(...todos.later);
                    allTodos.completed.push(...todos.completed);
                }

                setTodos(allTodos);
            } catch (e) {
                setError(e as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchTodos();
    }, [selectedAnimalId, animals]);

    return { todos, loading, error, completeTask };
}
