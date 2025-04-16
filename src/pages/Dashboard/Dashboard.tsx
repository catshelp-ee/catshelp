import React, { useEffect, useState } from "react";
import Sidebar from "./DesktopView/Sidebar.tsx";
import Header from "../Header.tsx";
import Notifications from "./Notifications.tsx";
import FosterPets from "./FosterPets.tsx";
import TodoList from "../TodoList.tsx";
import axios from "axios";
import { useAuth } from "../../authContext.tsx";
import DesktopView from "./DesktopView/DesktopView.tsx";
import MobileView from "./MobileView/MobileView.tsx";

interface DashboardProps {}

function useMediaQuery(query: any) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}


const Dashboard: React.FC<DashboardProps> = () => {
  const [pets, setPets] = useState([]);
  const [todos, setTodos] = useState([]);
  const [name, setName] = useState("")
  const isMobile = useMediaQuery("(max-width: 768px)");
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
