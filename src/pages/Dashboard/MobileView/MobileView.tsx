import React from 'react'
import Notifications from '../Notifications'
import FosterPetsMobile from './FosterPetsMobile'
import TodoListMobile from './TodoListMobile'

interface MobileViewProps {
    name: string,
    pets: any,
    todos: any
}

const MobileView: React.FC<MobileViewProps> = ({name, pets, todos}) => {
  console.log(todos)
  return (
    <div>
        <Notifications name={name} />
        <FosterPetsMobile pets={pets} />
        <TodoListMobile todos={todos} />
    </div>
  )
}

export default MobileView