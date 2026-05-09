import type { AnimalTodo } from '@interfaces/animal-todo.ts';
import axios from 'axios';

export const animalsApi = {
  getTodos: (animalId: number): Promise<AnimalTodo[]> =>
    axios
      .get<AnimalTodo[]>(`/api/animals/${animalId}/todos`)
      .then((r) => r.data),
};
