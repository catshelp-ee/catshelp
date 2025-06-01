import React from "react";
import Notifications from "@pages/Dashboard/Notifications";
import FosterPetsMobile from "@pages/Dashboard/MobileView/FosterPetsMobile";
import TodoListMobile from "@pages/Dashboard/MobileView/TodoListMobile";
import { CircularProgress } from "@mui/material";

interface MobileViewProps {
  name: string;
  pets: any;
  todos: any;
  isLoading: boolean;
}

const MobileView: React.FC<MobileViewProps> = ({
  name,
  pets,
  todos,
  isLoading,
}) => {
  if (isLoading)
    return (
      <div className="flex flex-col items-center pt-8">
        <Notifications name={name} />
        <CircularProgress />
      </div>
    );
  return (
    <div className="items-center pt-8">
      <Notifications className="justify-center" name={name} />
      <FosterPetsMobile pets={pets} />
      <TodoListMobile todos={todos} />
    </div>
  );
};

export default MobileView;
