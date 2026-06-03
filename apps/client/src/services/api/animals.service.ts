import type { AnimalTodo, AnimalTodos } from '@interfaces/animal-todo.ts';
import axios from 'axios';

export const animalsApi = {
    getTodos: (animalId: number): Promise<AnimalTodos> => axios.get<AnimalTodos>(`/api/animals/${animalId}/todos`).then((r) => r.data),
};
