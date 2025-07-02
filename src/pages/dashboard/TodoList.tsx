import React from "react";
import TodoItem from "./TodoItem";
import { Todo } from "./Dashboard";

interface TodoListProps {
  todos: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  return (
    <div className="p-2 md:p-4 border-solid border-2 border-slate-500 rounded-3xl">
      <h2 className="">SINU TEGEMISTE MEELESPEA</h2>

      <div className="flex flex-col gap-6 mt-6">
        {todos.map((item, index) => {
          return <TodoItem key={index} {...item} />;
        })}
      </div>
    </div>
  );
};

export default TodoList;
