import axios from "axios";
import {AnimalTodo} from "@interfaces/animal-todo";

export const animalsApi = {
    getTodos: (animalId: number): Promise<AnimalTodo[]> =>
        axios.get<AnimalTodo[]>(`/api/animals/${animalId}/todos`).then(r => r.data),
};
