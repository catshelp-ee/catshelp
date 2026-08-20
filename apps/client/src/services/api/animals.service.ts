import { AnimalSummary } from '@interfaces/animal-summary.ts';
import type { AnimalTodo, AnimalTodos } from '@interfaces/animal-todo.ts';
import { Profile } from '@interfaces/profile.ts';
import axios from 'axios';

export const animalsApi = {
    getTodos: (animalId: number): Promise<AnimalTodos> => axios.get<AnimalTodos>(`/api/animals/${animalId}/todos`).then((r) => r.data),
    completeTodo: (todoId: number): Promise<AnimalTodo> =>
        axios
            .put(`/api/animals/todos/${todoId}`, {
                completed_date: new Date().toISOString(),
            })
            .then((r) => r.data),

    getAnimal: (animalId: number): Promise<Profile> => axios.get<Profile>(`/api/animals/${animalId}/profile`).then((r) => r.data),
    getAnimals: (): Promise<AnimalSummary[]> => axios.get<AnimalSummary[]>(`/api/animals`).then((r) => r.data),
};
