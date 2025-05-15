import React from "react";
import TodoItem from "@pages/Dashboard/DesktopView/TodoItem";

interface TodoListProps {
  todos: any;
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  return (
    <section className="flex flex-col h-full overflow-auto px-4 mt-4 rounded-3xl border border-solid border-black border-opacity-20">
      <h2 className="text-base text-left font-bold text-slate-500 mt-6">
        SINU TEGEMISTE MEELESPEA
      </h2>

      <table className="w-full border-separate border-spacing-y-4">
        {todos.map((item, index) => {
          return <TodoItem key={index} {...item} />;
        })}
      </table>
    </section>
  );
};

export default TodoList;
