import React from "react";
import Header from "../../Header";
import Notifications from "../Notifications";
import FosterPetsMobile from "./FosterPetsMobile";
import TodoListMobile from "./TodoListMobile";
import HamburgerMenu from "../DesktopView/HamburgerMenu";

interface MobileViewProps {
  name: string;
  pets: any;
  todos: any;
}

const MobileView: React.FC<MobileViewProps> = ({ name, pets, todos }) => {
  console.log(todos);
  return (
    <div className="flex flex-col h-full items-center">
      <Header />
      <HamburgerMenu />
      <Notifications name={name} />
      <FosterPetsMobile pets={pets} />
      <TodoListMobile todos={todos} />
    </div>
  );
};

export default MobileView;
