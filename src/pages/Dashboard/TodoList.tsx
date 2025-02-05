import React from "react";
import TodoItem from "./TodoItem.tsx";

interface TodoListProps {
  todos: any;
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  console.log(todos);

  return (
    <section className="flex overflow-hidden flex-col px-4 pt-5 pb-44 mt-3.5 w-full bg-white rounded-3xl border border-solid border-black border-opacity-20 min-h-[679px] max-md:pb-24 max-md:max-w-full">
      <div className="flex flex-col items-baseline">
        <h2 className="text-3xl font-bold text-slate-500 mb-4">
          SINU TEGEMISTE MEELESPEA
        </h2>
        <table className="w-full">
          {todos.map((item, index) => {
            console.log(item);
            return <TodoItem key={index} {...item} />;
          })}
        </table>
      </div>
    </section>
  );
};

export default TodoList;
