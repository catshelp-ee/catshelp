import React, { useEffect, useState } from "react";
import Notifications from "@pages/Dashboard/Notifications";
import FosterPets from "@pages/Dashboard/FosterPets";
import TodoList from "@pages/Dashboard/DesktopView/TodoList";
import { CircularProgress } from "@mui/material";

interface DesktopViewProps {
  name: string;
  pets: any;
  todos: any;
  isLoading: boolean;
}

const DesktopView: React.FC<DesktopViewProps> = ({
  name,
  pets,
  todos,
  isLoading,
}) => {
  if (isLoading)
    return (
      <div className="flex flex-col w-full mx-12 mb-4 flex-1">
        <Notifications name={name} />
        <CircularProgress />
      </div>
    );
  return (
    <div className="flex flex-col w-full mx-12 mb-4 flex-1">
      <Notifications name={name} />
      <FosterPets pets={pets} />
      <TodoList todos={todos} />
    </div>
  );
};

export default DesktopView;
