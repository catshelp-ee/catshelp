import {AnimalSummary} from "@interfaces/animal-summary";
import axios from "axios";
import {UserResponse} from "@interfaces/user-response";

export const usersApi = {
    getUser: (userId: number): Promise<UserResponse> =>
        axios.get<UserResponse>(`/api/users/${userId}`).then(r => r.data),

    getUserAnimals: (userId: number): Promise<AnimalSummary[]> =>
        axios.get<AnimalSummary[]>(`/api/users/${userId}/animals`).then(r => r.data),
};
