import { animalsApi } from '@api/animals.service.ts';
import type { AnimalTodo, AnimalTodos } from '@interfaces/animal-todo.ts';
import { observer } from 'mobx-react-lite';

import Todos from './todos.tsx';
import { useTranslation } from '@hooks/use-translation.tsx';
import { AnimalCard } from './animal-card.tsx';
import { useEffect, useMemo, useState } from 'react';
import AuthStore from '@stores/AuthStore.ts';
import { AnimalSummary } from '@interfaces/animal-summary.ts';
import { useAlert } from '@context/alert-context.tsx';
import { usersApi } from '@api/users.service.ts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select.tsx';

const Dashboard = () => {
    const { t } = useTranslation();
    const { user } = AuthStore;
    const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');
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
        if (!user) {
            return;
        }

        const getTodos = async () => {
            try {
                setTodos(await usersApi.getUserTodos(user.id));
            } catch (e) {
                console.error(e);
            }
        };

        getTodos();
    }, [user]);

    const filteredTodos = useMemo<AnimalTodos | undefined>(() => {
        if (!todos || selectedCatFilter === 'all') {
            return todos;
        }

        const animalId = Number(selectedCatFilter);
        const byAnimal = (todo: AnimalTodo) => todo.animal_id === animalId;

        return {
            today: todos.today.filter(byAnimal),
            soon: todos.soon.filter(byAnimal),
            later: todos.later.filter(byAnimal),
            completed: todos.completed.filter(byAnimal),
        };
    }, [todos, selectedCatFilter]);

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Welcome message */}
            <div className="py-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
                    {t('dashboard.title')}
                </h1>
            </div>


            {/* My foster cats */}
            <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {t('dashboard.myCats')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    {animals && animals.map((cat) => (
                        <AnimalCard key={cat.id} animalSummary={cat} />
                    ))}
                </div>
            </section>

            {/* Next to-dos */}
            <section>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {t('dashboard.nextTodos')}
                    </h2>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Select value={selectedCatFilter} onValueChange={setSelectedCatFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    {t('dashboard.allCats')}
                                </SelectItem>
                                {animals && animals.map((cat) => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {filteredTodos && <Todos completeTask={completeTask} todos={filteredTodos} />}
            </section>
        </div>
    );
};

export default observer(Dashboard);
