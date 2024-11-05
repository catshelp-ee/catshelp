import React from "react";
import Sidebar from "./Sidebar.tsx";
import Header from "./Header.tsx";
import Notifications from "./Notifications.tsx";
import FosterPets from "./FosterPets.tsx";
import TodoList from "./TodoList.tsx";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  return (
    <div className="flex overflow-hidden flex-col pt-8 pr-20 bg-white max-md:pr-5">
      <Header />
      <div className="mt-6 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <Sidebar />
          <main className="flex flex-col ml-5 w-[74%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col w-full max-md:mt-10 max-md:max-w-full">
              <Notifications />
              <FosterPets />
              <TodoList />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
