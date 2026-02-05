import {useAlert} from "@context/alert-context";
import {useAuth} from "@context/auth-context";
import {isLoadingWrapper} from "@hooks/is-loading";
import {CircularProgress} from "@mui/material";
import {AnimalSummary} from "@interfaces/animal-summary";
import axios from "axios";
import React, {useEffect, useState} from "react";
import FosterPets from "./foster-pets";
import Notifications from "./notifications";
import TodoList from "./todo-list";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {AnimalTodo} from "@interfaces/animal-todo";
import {animalsApi} from "@api/animals.service";
import {usersApi} from "@api/users.service";

interface DashboardProps { }

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
        const loadDashboardData = async () => {
            const user = await getUser();

            const userId: number = url.pathname === "/users" ? user.id : Number(params.userId);

            try {
                const user = await usersApi.getUser(userId);
                setName(user.fullName);
            } catch (e) {
                navigate(`/users/${user.id}`)
            }

            try {
                const animalSummaries = await usersApi.getUserAnimals(userId);
                setPets(animalSummaries);

                const userTodos: AnimalTodo[] = [];
                for (let i = 0; i < animalSummaries.length; i++) {
                    const animalSummary = animalSummaries[i];

                    const todos = await animalsApi.getTodos(animalSummary.id);
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

        return () => { };
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return <CircularProgress/>;
        }
        return (
            <div className="flex flex-col md:m-0">
                <div className="mx-auto sm:mx-0">
                    <h1 className="font-medium text-4xl my-6">
                        Tere tulemast <span className="block sm:inline">{name}! 😺</span>
                    </h1>
                    <FosterPets pets={pets} />
                </div>
                <TodoList todos={todos} />
            </div>
        );
    };

    return (
        <div className="md:mx-12 flex flex-col flex-1">
            {renderContent()}
        </div>
    );
};

export default Dashboard;
