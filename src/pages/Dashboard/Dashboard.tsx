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

      const response = await axios.get(
        `/api/animals/dashboard/${user.fullName}`
      );
      console.log(response);
      setIsLoading(false);
      setPets(response.data.pets);
      setTodos(response.data.todos);
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
