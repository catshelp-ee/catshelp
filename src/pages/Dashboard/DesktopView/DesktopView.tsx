import React, { useEffect, useState } from "react";
import Notifications from "@pages/Dashboard/Notifications";
import FosterPets from "@pages/Dashboard/FosterPets";
import TodoList from "@pages/Dashboard/DesktopView/TodoList";

interface DesktopViewProps {
  name: string;
  pets: any;
  todos: any;
}

const DesktopView: React.FC<DesktopViewProps> = ({ name, pets, todos }) => {
  return (
        <div className="flex flex-col w-full mx-12 mb-4 flex-1">
          <Notifications name={name} />
          <FosterPets pets={pets} />
          <TodoList todos={todos} />
        </div>
  )
}

export default DesktopView;
