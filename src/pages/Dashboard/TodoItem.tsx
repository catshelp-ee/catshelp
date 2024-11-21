import React from "react";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@mui/material";

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
  const labels = { inputProps: { "aria-label": "Checkbox demo" } };
  return (
    <tr>
      <td>
        <Checkbox {...labels} />
      </td>
      <td>{label}</td>
      <td>
        <table>
          <tr>
            <td className={`${dateColor}`}>{date}</td>
            <td>
              <img
                loading="lazy"
                src={petImage}
                alt=""
                className="object-contain shrink-0 self-stretch my-auto w-8 aspect-square"
              />
            </td>
            <td className={`${dateColor}`}>{assignee}</td>
          </tr>
        </table>
      </td>
      <td>
        <Button>{action}</Button>
      </td>
    </tr>
  );
};

export default TodoItem;

/*

    <div className="flex text-xs gap-8">
      <div className="flex my-auto gap-2 w-3/5">
        <Checkbox {...labels} />
        <div className="my-auto">{label}</div>
      </div>
      <div className="flex">
        <span className={`my-auto ${dateColor}`}>{date}</span>
        <img
          loading="lazy"
          src={petImage}
          alt=""
          className="object-contain shrink-0 self-stretch my-auto w-8 aspect-square"
        />
        <span className={`my-auto ${dateColor}`}>{assignee}</span>
      </div>
      <button className="text-white bg-blue-600 rounded-md">{action}</button>
*/
