import React from "react";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

interface TodoItemProps {
  label: string;
  assignee: string;
  due: string;
  action: {
    label: string;
    redirect: string;
  };
  urgent: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  label,
  due,
  assignee,
  action,
  urgent,
}) => {
  const dateColor = urgent ? "text-red-400" : "text-slate-500";
  const labels = { inputProps: { "aria-label": "Checkbox demo" } };
  return (
    <tr>
      <td>
        <Checkbox {...labels} />
        {urgent && <WarningIcon className={`${dateColor}`} />}
      </td>
      <td className={`${dateColor}`}>{label}</td>
      <td>
        <table>
          <tr>
            <td>{due}</td>
            <td>|||</td>
            <td>{assignee}</td>
          </tr>
        </table>
      </td>
      <td>
        <a href={action.redirect} target="_blank">
          <Button>{action.label}</Button>
        </a>
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
