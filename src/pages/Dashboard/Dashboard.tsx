import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar.tsx";
import Header from "../Header.tsx";
import Notifications from "./Notifications.tsx";
import FosterPets from "./FosterPets.tsx";
import TodoList from "./TodoList.tsx";
import axios from "axios";
import "./todo.css";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const [pets, setPets] = useState([]);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const getDashboardCats = async () => {
      const response = await axios.get("/api/animals/dashboard");
      setPets(response.data.pets);
      setTodos(response.data.todos);
    };

    getDashboardCats();

    return () => {};
  }, []);
  return (
    <div className="flex flex-col w-full h-full">
      <Header />
      <div className="mt-6 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <Sidebar />
          <main className="flex flex-col ml-5 w-[74%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col w-full max-md:mt-10 max-md:max-w-full">
              <Notifications />
              <FosterPets pets={pets} />
              <TodoList todos={todos} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
