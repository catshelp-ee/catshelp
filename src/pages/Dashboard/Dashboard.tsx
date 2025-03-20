import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const { name } = useParams();

  useEffect(() => {
    const getDashboardCats = async () => {
      const response = await axios.get(`/api/animals/dashboard/${name}`);
      setPets(response.data.pets);
      setTodos(response.data.todos);
    };

    getDashboardCats();

    return () => {};
  }, []);
  return (
    <div className="flex flex-col w-full h-screen">
      <Header className="flex w-1/5 my-2 h-[113px] justify-center" />
      <div className="flex h-[calc(100vh-129px)]"> {/*Only way I could figure out how to make this CURSED FUCKING TABLE to work. 113 is the height of the header and 16 is the margin. 8 top 8 bottom */}
        <Sidebar />
        <div className="flex flex-col w-full mx-12 mb-12 flex-1">
          <Notifications name={name} />
          <FosterPets pets={pets} />
          <TodoList todos={todos} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
