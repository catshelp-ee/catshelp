import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@context/AuthContext";
import { useIsMobile } from "@hooks/isMobile";
import { isLoadingWrapper } from "@hooks/isLoading";
import Notifications from "./Notifications";
import FosterPets from "./FosterPets";
import TodoList from "./TodoList";
import { CircularProgress } from "@mui/material";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const [pets, setPets] = useState([]);
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getUser } = useAuth();

  useEffect(() => {
    const loadDashboardData = async () => {
      const user = await getUser();
      setName(user.fullName);

      const response = await axios.get(`/api/animals/dashboard`);
      setPets(response.data.pets);
      setTodos(response.data.todos);
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
      <h1 className="text-2xl text-center md:text-left">Tere tulemast {name}! 😺</h1>
      {renderContent()}
    </div>
  );
};

export default Dashboard;
