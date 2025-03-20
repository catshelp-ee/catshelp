import React from "react";
import TodoItem from "./TodoItem.tsx";

interface TodoListProps {
  todos: any;
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  return (
    <section className="flex flex-col overflow-scroll px-4 my-4 rounded-3xl border border-solid border-black border-opacity-20">
      <h2 className="text-3xl font-bold text-slate-500 mb-4">
        SINU TEGEMISTE MEELESPEA
      </h2>

      <table className="w-full border-separate border-spacing-y-8">
        {todos.map((item, index) => {
          return <TodoItem key={index} {...item} />;
        })}
      </table>
    </section>
  );
};

export default TodoList;
