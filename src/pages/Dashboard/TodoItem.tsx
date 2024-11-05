import React from "react";

interface TodoItemProps {
  label: string;
  date: string;
  assignee: string;
  action: string;
  pet: string | null;
  isCompleted: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  label,
  date,
  assignee,
  action,
  pet,
  isCompleted,
}) => {
  const petImage =
    pet === "Peemot"
      ? "https://cdn.builder.io/api/v1/image/assets/TEMP/80e8356e58c23aa5528af7719b3f8796da083b19a92fcf490fc81fbe9e28b37d?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973"
      : "https://cdn.builder.io/api/v1/image/assets/TEMP/bad705e364fcce414200230d9611c07a2a21de27e3c139acd1766a2ed473edbf?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973";
  const dateColor = date.startsWith("12/04/2022")
    ? "text-red-400"
    : "text-slate-500";

  return (
    <div className="flex flex-wrap gap-10 items-center p-3 mt-2 w-full text-sm leading-loose bg-white max-md:max-w-full">
      <div className="flex flex-1 shrink gap-4 items-center self-stretch my-auto basis-6 min-w-[240px] text-neutral-950">
        <div className="flex gap-2 items-center self-stretch my-auto min-w-[240px]">
          {isCompleted ? (
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/17fe871f0aaa15dc4991189512a8727566ae44e59268e81c00402dc34d85cb11?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973"
              alt=""
              className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
            />
          ) : (
            <div className="flex flex-col justify-center self-stretch p-1 my-auto w-6">
              <div className="flex shrink-0 w-4 h-4 bg-white rounded-sm border border-solid border-slate-300" />
            </div>
          )}
          <div className="self-stretch my-auto">{label}</div>
        </div>
      </div>
      <div className={`self-stretch my-auto ${dateColor} w-[100px]`}>
        {date}
      </div>
      <div className="flex gap-2 items-center self-stretch my-auto w-40 text-gray-700">
        <img
          loading="lazy"
          src={petImage}
          alt=""
          className="object-contain shrink-0 self-stretch my-auto w-8 aspect-square"
        />
        <div className="self-stretch my-auto">{assignee}</div>
      </div>
      <button className="gap-2.5 self-stretch px-3 py-2 my-auto text-white bg-blue-600 rounded-md min-h-[33px] w-[117px]">
        {action}
      </button>
    </div>
  );
};

export default TodoItem;
