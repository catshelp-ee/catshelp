import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@mui/material";
import CatSvg from "./CatSvg";


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
  const [checked, setChecked] = useState(false);
  const dateColor = urgent ? "text-red-400" : "text-slate-500";

  return (
    <tr className="h-11">
      <td className="w-1/2 text-sm whitespace">
        <div className="flex items-center gap-2">
          <Checkbox
            sx={{ padding: 0 }}
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <span className={`${checked ? "line-through text-gray-400" : ""}`}>
            {label}
          </span>
        </div>
      </td>
      <td className={`text-left w-1/6 ${dateColor}`}>{due}</td>
      <td className="text-left w-1/5">
        <div className="flex items-center gap-4">
          <CatSvg width={30} height={30} colour={`${catColour}`} />
          {assignee}
        </div>
      </td>
      <td className="text-right h-full">
        <a href={action.redirect} target="_blank" rel="noopener noreferrer">
          <Button
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "#007AFF",
              fontSize: "13px",
              padding: "4px 12px",
              borderRadius: "6px",
              textTransform: "none",
            }}
            variant="contained"
          >
            {action.label}
          </Button>
        </a>
      </td>
    </tr>
  );
};

export default TodoItem;
