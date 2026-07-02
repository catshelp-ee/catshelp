import { animalsApi } from '@api/animals.service.ts';
import { usersApi } from '@api/users.service.ts';
import { useAlert } from '@context/alert-context.tsx';
import { useTranslation } from '@hooks/use-translation.tsx';
import type { AnimalSummary } from '@interfaces/animal-summary.ts';
import type { AnimalTodo, AnimalTodos } from '@interfaces/animal-todo.ts';
import { MenuItem, Select } from '@mui/material';
import AuthStore from '@stores/AuthStore.ts';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import Todos from './todos.tsx';

const Dashboard = () => {
    const { t } = useTranslation();
    const { user } = AuthStore;
    const [selectedAnimalId, setSelectedAnimalId] = useState<number | 'all'>('all');
    const [animals, setAnimals] = useState<AnimalSummary[]>([]);
    const { showAlert } = useAlert();

    const [todos, setTodos] = useState<AnimalTodos>();

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
        if (!user) {
            return;
        }

        const getAnimals = async () => {
            try {
                const animalSummaries = await usersApi.getUserAnimals(user.id);
                setAnimals(animalSummaries);
            } catch (e) {
                console.error('Unexpected error in fetchAnimals:', e);
                showAlert('Error', 'Tekkis probleem kasside laadimisega');
            }
        };

        getAnimals();
    }, [user, showAlert]);

    useEffect(() => {
        const selectedAnimals = selectedAnimalId === 'all' ? animals : [animals.find((a) => a.id === Number(selectedAnimalId))];

        if (selectedAnimals === undefined || selectedAnimals.length === 0) {
            return;
        }

        async function getTodos() {
            const allTodos: AnimalTodos = {
                today: [],
                soon: [],
                later: [],
                completed: [],
            };

            try {
                const todoResults = await Promise.all(
                    selectedAnimals.filter((animal): animal is AnimalSummary => animal !== undefined).map((animal) => animalsApi.getTodos(animal.id)),
                );

                for (const todos of todoResults) {
                    allTodos.today.push(...todos.today);
                    allTodos.soon.push(...todos.soon);
                    allTodos.later.push(...todos.later);
                    allTodos.completed.push(...todos.completed);
                }

                setTodos(allTodos);
            } catch (e) {
                console.error(e);
            }
        }

        getTodos();
    }, [showAlert, selectedAnimalId, animals]);

    return (
        <div className="flex flex-col flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{t('nextTodos')}</h2>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <Select value={selectedAnimalId} onChange={(e) => setSelectedAnimalId(e.target.value)}>
                        <MenuItem value="all">Kõik kassid</MenuItem>
                        {animals.map((a) => (
                            <MenuItem key={a.id} value={a.id}>
                                {a.name}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
            </div>

            {todos === undefined ? <div></div> : <Todos completeTask={completeTask} todos={todos} />}
        </div>
    );
};

export default observer(Dashboard);
