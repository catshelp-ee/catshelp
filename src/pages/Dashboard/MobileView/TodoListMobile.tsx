import React from "react";
import TodoItemMobile from "./TodoItemMobile.tsx";

interface TodoListProps {
  todos: any;
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  return (
    <section className="w-full px-4">
      <div className="flex flex-col h-full pl-4 overflow-auto mt-4 rounded-3xl border border-solid border-black border-opacity-20">
        <h2 className="text-base text-left font-bold text-slate-500 mt-6">
          SINU TEGEMISTE MEELESPEA
        </h2>

        <table className="w-full border-separate border-spacing-y-4">
          {todos.map((item, index) => {
            return <TodoItemMobile key={index} {...item} />;
          })}
        </table>
      </div>
    </section>
  );
};

export default TodoList;
