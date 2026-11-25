import type { AnimalSummary } from '@interfaces/animal-summary.ts';
import type { AnimalTodos } from '@interfaces/animal-todo.ts';
import type { UserResponse } from '@interfaces/user-response.ts';
import axios from 'axios';

export const usersApi = {
    getUser: (userId: number): Promise<UserResponse> => axios.get<UserResponse>(`/api/users/${userId}`).then((r) => r.data),

    getUserAnimals: (userId: number): Promise<AnimalSummary[]> => axios.get<AnimalSummary[]>(`/api/users/${userId}/animals`).then((r) => r.data),

    getUserTodos: (userId: number): Promise<AnimalTodos> => axios.get<AnimalTodos>(`/api/users/${userId}/todos`).then((r) => r.data),
};
