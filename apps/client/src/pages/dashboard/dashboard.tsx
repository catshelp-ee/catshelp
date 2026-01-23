import {useAlert} from "@context/alert-context";
import {useAuth} from "@context/auth-context";
import {isLoadingWrapper} from "@hooks/is-loading";
import {CircularProgress} from "@mui/material";
import {AnimalSummary} from "@pages/dashboard/interfaces/animal-summary";
import axios from "axios";
import React, {useEffect, useState} from "react";
import FosterPets from "./foster-pets";
import Notifications from "./notifications";
import TodoList from "./todo-list";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {AnimalTodo} from "@pages/dashboard/interfaces/animal-todo";

interface DashboardProps {
}

const Dashboard: React.FC<DashboardProps> = () => {
    const [pets, setPets] = useState<AnimalSummary[]>([]);
    const [todos, setTodos] = useState<AnimalTodo[]>([]);
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {getUser} = useAuth();
    const {showAlert} = useAlert();
    const params = useParams();
    const navigate = useNavigate();
    const url = useLocation();

    useEffect(() => {

        const getUserAnimalSummaries = async (userId): Promise<AnimalSummary[]> => {
            const response = await axios.get(`/api/users/${userId}/animals`);

            return response.data;
        }

        const getAnimalTodos = async (animalId): Promise<AnimalTodo[]> => {
            const response = await axios.get(`/api/animals/${animalId}/todos`);

            return response.data;
        }

        const loadDashboardData = async () => {
            const user = await getUser();

            const userId = url.pathname === "/users" ? user.id : params.userId;

            try {
                const response = await axios.get(`/api/users/${userId}`);
                const user = response.data;
                setName(user.fullName);
            } catch (e) {
                navigate(`/users/${user.id}`)
            }

            try {
                const animalSummaries = await getUserAnimalSummaries(userId);
                setPets(animalSummaries);

                const userTodos: AnimalTodo[] = [];
                for (let i = 0; i < animalSummaries.length; i++) {
                    const animalSummary = animalSummaries[i];

                    const todos = await getAnimalTodos(animalSummary.id);
                    userTodos.push(...todos);
                }
                setTodos(userTodos);

            } catch (e) {
                showAlert('Error', "Tekkis probleem kasside laadimisega");
            }

        };

        //TODO SEE MANUAALNE LOADING ASI TULEB ÜMBER TEHA
        const fetchDashboardWithLoading = async () => {
            await isLoadingWrapper(loadDashboardData, setIsLoading);
        };

        // Usage
        fetchDashboardWithLoading();

        return () => {
        };
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return <CircularProgress/>;
        }
        return (
            <div className="m-4 md:m-0">
                <span className="md:flex md:mb-8">
                    <Notifications/>
                    <FosterPets pets={pets}/>
                </span>
                <TodoList todos={todos}/>
            </div>
        );
    };

    return (
        <div className="md:mx-12 flex-1">
            <h1 className="page-heading">
                Tere tulemast {name}! 😺
            </h1>
            {renderContent()}
        </div>
    );
};

export default Dashboard;
