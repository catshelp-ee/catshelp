import React from 'react'
import Notifications from '@pages/Dashboard/Notifications'
import FosterPetsMobile from '@pages/Dashboard/MobileView/FosterPetsMobile'
import TodoListMobile from '@pages/Dashboard/MobileView/TodoListMobile'

interface MobileViewProps {
  name: string;
  pets: any;
  todos: any;
}

const MobileView: React.FC<MobileViewProps> = ({ name, pets, todos }) => {
  console.log(todos);
  return (
    <div>
        <Notifications name={name} />
        <FosterPetsMobile pets={pets} />
        <TodoListMobile todos={todos} />
    </div>
  );
};

export default MobileView;
