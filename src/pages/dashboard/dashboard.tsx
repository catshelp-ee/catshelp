import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@context/auth-context";
import { useAlert } from "@context/alert-context";
import { isLoadingWrapper } from "@hooks/is-loading";
import Notifications from "./notifications";
import FosterPets from "./foster-pets";
import TodoList from "./todo-list";
import { CircularProgress } from "@mui/material";

export interface Pet {
  name: string;
  image: string;
}

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

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getUser } = useAuth();
  const { showAlert } = useAlert();

  useEffect(() => {
    const loadDashboardData = async () => {
      const user = await getUser();
      setName(user.fullName);

      try {
        const response = await axios.get(`/api/animals/dashboard`);
        setPets(response.data.pets);
        setTodos(response.data.todos);
      } catch (e) {
        showAlert('Error', "Tekkis probleem kasside laadimisega");
      }
    };

    const fetchDashboardWithLoading = async () => {
      await isLoadingWrapper(loadDashboardData, setIsLoading);
    };

    // Usage
    fetchDashboardWithLoading();

    return () => {};
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
      <h1 className="text-2xl text-center md:text-left">
        Tere tulemast {name}! 😺
      </h1>
      {renderContent()}
    </div>
  );
};

export default Dashboard;
