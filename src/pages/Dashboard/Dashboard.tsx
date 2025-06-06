import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import DesktopView from "@pages/Dashboard/DesktopView/DesktopView";
import MobileView from "@pages/Dashboard/MobileView/MobileView";
import { useIsMobile } from "@hooks/isMobile";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const [pets, setPets] = useState([]);
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const { getUser } = useAuth();

  useEffect(() => {
    const getDashboardCats = async () => {
      const user = await getUser();
      setName(user.fullName);

      const localStorageTodos = localStorage.getItem("todos");
      console.log(localStorageTodos);
      
      if (localStorageTodos){
        const todos = JSON.parse(localStorageTodos);
        setIsLoading(false);
        setTodos(todos);
        const pets = JSON.parse(localStorage.getItem("pets")!);
        setPets(pets.map((name) => ({
          name,
          image: `Temp/${user.fullName}/${name}.png`,
        })))
        return;
      }

      const response = await axios.get(
        `/api/animals/dashboard`
      );
      setIsLoading(false);
      setPets(response.data.pets);
      setTodos(response.data.todos);
      localStorage.setItem("todos", JSON.stringify(response.data.todos));
      localStorage.setItem("pets", JSON.stringify(response.data.pets.map(pet => pet.name)));
    };

    getDashboardCats();

    return () => {};
  }, []);
  return isMobile ? (
    <MobileView isLoading={isLoading} name={name} pets={pets} todos={todos} />
  ) : (
    <DesktopView isLoading={isLoading} name={name} pets={pets} todos={todos} />
  );
};

export default Dashboard;
