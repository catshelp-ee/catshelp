import { useAlert } from "@context/alert-context";
import { useAuth } from "@context/auth-context";
import { isLoadingWrapper } from "@hooks/is-loading";
import { CircularProgress } from "@mui/material";
import { AvatarData } from "@server/animal/interfaces/avatar";
import axios from "axios";
import React, { useEffect, useState } from "react";
import FosterPets from "./foster-pets";
import Notifications from "./notifications";
import TodoList from "./todo-list";
import {useNavigate, useParams} from "react-router-dom";

export interface Todo {
    label: string;
    assignee: string;
    due: string;
    catColour: string;
    urgent: boolean;
    action: {
        label: string;
        redirect?: string;
    };
}

interface DashboardProps { }

const Dashboard: React.FC<DashboardProps> = () => {
    const [pets, setPets] = useState<AvatarData[]>([]);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { getUser } = useAuth();
    const { showAlert } = useAlert();
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const loadDashboardData = async () => {
            const user = await getUser();

            try {
                const response = await axios.get(`/api/users/${params.id}`);
                const user = response.data;
                setName(user.fullName);
            } catch (e) {
                navigate(`/dashboard/${user.id}`)
            }

            try {
                const response = await axios.get(`/api/animals/${params.id}/avatars`);
                setPets(response.data);
            } catch (e) {
                showAlert('Error', "Tekkis probleem kasside laadimisega");
            }

            try {
                const response = await axios.get(`/api/animals/${params.id}/todos`);
                setTodos(response.data);
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
            return <CircularProgress />;
        }
        return (
            <div className="m-4 md:m-0">
                <span className="md:flex md:mb-8">
                    <Notifications />
                    <FosterPets pets={pets} />
                </span>
                <TodoList todos={todos} />
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
