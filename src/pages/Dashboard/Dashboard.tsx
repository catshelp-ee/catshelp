import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import DesktopView from "@pages/Dashboard/DesktopView/DesktopView";
import MobileView from "@pages/Dashboard/MobileView/MobileView";
import { useIsMobile } from "@hooks/isMobile"

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const [pets, setPets] = useState([]);
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState("")
  const isMobile = useIsMobile();
  const { getUser } = useAuth();


  useEffect(() => {
    const getDashboardCats = async () => {
      const user = await getUser();
      setName(user.fullName);

      const response = await axios.get(`/api/animals/dashboard/${user.fullName}`);
      setPets(response.data.pets);
      setTodos(response.data.todos);
    };

    getDashboardCats();

    return () => {};
  }, []);
  return isMobile ? <MobileView name={name} pets={pets} todos={todos} /> : <DesktopView name={name} pets={pets} todos={todos}/>
};

export default Dashboard;
