import React, { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import MyButton from "src/Components/Button";
import CatSvg from "@assets/CatSvg";

interface TodoItemProps {
  label: string;
  assignee: string;
  due: string;
  action: {
    label: string;
    redirect: string;
  };
  urgent: boolean;
  catColour: string;
}

const TodoItem: React.FC<TodoItemProps> = ({
  label,
  due,
  assignee,
  action,
  urgent,
  catColour,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const dateColor = urgent ? "text-red-400" : "text-slate-500";

  return (
    <div className="md:flex">
      <div className="flex items-center md:w-1/2">
        <Checkbox
          sx={{ padding: 0 }}
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <span
          className={`text-sm ${isChecked ? "line-through text-gray-400" : ""}`}
        >
          {label}
        </span>
      </div>
      <div className="flex-1 grid grid-cols-3 mt-1 items-center">
        <span className={`${dateColor}`}>{due}</span>
        <span className="flex gap-4 items-center">
          <CatSvg width={30} height={30} colour={`${catColour}`} />
          {assignee}
        </span>
        <span>
          <MyButton>{action.label}</MyButton>
        </span>
      </div>
    </div>
  );
};

export default TodoItem;
