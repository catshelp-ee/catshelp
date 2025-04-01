import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar.tsx";
import Header from "../Header.tsx";
import Notifications from "./Notifications.tsx";
import FosterPets from "./FosterPets.tsx";
import TodoList from "./TodoList.tsx";

interface DesktopViewProps {
    name: string,
    pets: any,
    todos: any
}

const DesktopView: React.FC<DesktopViewProps> = ({name, pets, todos}) => {
  return (
    <div className="flex flex-col w-full h-screen">
      <Header className="flex w-1/5 my-2 h-[113px] justify-center" />
      <div className="flex h-[calc(100vh-129px)]">
        <Sidebar />
        <div className="flex flex-col w-full mx-12 mb-4 flex-1">
          <Notifications name={name} />
          <FosterPets pets={pets} />
          <TodoList todos={todos} />
        </div>
      </div>
    </div>
  )
}

export default DesktopView