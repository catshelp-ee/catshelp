import React from "react";
import TodoItem from "./TodoItem.tsx";

interface TodoListProps {}

const TodoList: React.FC<TodoListProps> = () => {
  const todoItems = [
    {
      label: "Täida hoiukoduankeet ja nõustu tingimustega",
      date: "28/03/2022",
      assignee: "Sina ise",
      action: "Täida ankeet",
      pet: null,
      isCompleted: true,
    },
    {
      label: "Anna vähemalt 2 nädalat enne vaktsineerimist ussirohi",
      date: "12/04/2022",
      assignee: "Peemot",
      action: "Vaata juhendit",
      pet: "Peemot",
      isCompleted: true,
    },
    {
      label: "Broneeri veterinaari juures vaktsineerimise aeg",
      date: "04/11/2024",
      assignee: "Peemot",
      action: "Broneeri aeg",
      pet: "Peemot",
      isCompleted: false,
    },
    {
      label: "Kinnita vaktsineerimist ja laadi üles foto hoiulooma passist",
      date: "24/11/2024",
      assignee: "Peemot",
      action: "Laadi pilt üles",
      pet: "Peemot",
      isCompleted: false,
    },
    {
      label: "Anna vähemalt 2 nädalat enne vaktsineerimist ussirohi",
      date: "12/04/2022",
      assignee: "Postikana",
      action: "Vaata juhendit",
      pet: "Postikana",
      isCompleted: false,
    },
    {
      label: "Broneeri veterinaari juures vaktsineerimise aeg",
      date: "04/11/2024",
      assignee: "Postikana",
      action: "Broneeri aeg",
      pet: "Postikana",
      isCompleted: false,
    },
    {
      label: "Kinnita vaktsineerimist ja laadi üles foto hoiulooma passist",
      date: "24/11/2024",
      assignee: "Postikana",
      action: "Laadi pilt üles",
      pet: "Postikana",
      isCompleted: false,
    },
  ];

  return (
    <section className="flex overflow-hidden flex-col px-4 pt-5 pb-44 mt-3.5 w-full bg-white rounded-3xl border border-solid border-black border-opacity-20 min-h-[679px] max-md:pb-24 max-md:max-w-full">
      <div className="flex flex-wrap gap-5 justify-between w-full max-w-[895px] max-md:max-w-full">
        <h2 className="text-base font-bold leading-relaxed text-center text-slate-500">
          SINU TEGEMISTE MEELESPEA
        </h2>
        <button className="flex overflow-hidden gap-2 items-center text-sm leading-loose text-sky-500">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4d65f86a5dcb5ed36d41a155498be55ab3d7df6f53b00b88e215349379582896?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973"
            alt=""
            className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
          />
          <span className="self-stretch my-auto">Lisa meelespea</span>
        </button>
      </div>
      <table>
        {todoItems.map((item, index) => (
          <TodoItem key={index} {...item} />
        ))}
      </table>
    </section>
  );
};

export default TodoList;
