import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@mui/material";

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

const TodoItemMobile: React.FC<TodoItemProps> = ({
  label,
  due,
  assignee,
  action,
  urgent,
}) => {
  const [checked, setChecked] = useState(false);
  const dateColor = urgent ? "text-red-400" : "text-slate-500";

  return (
    <tr className="flex flex-col mb-8">
      <td className="text-sm">
        <div className="flex gap-2 text-left">
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
      <td className="flex justify-between items-end">
        <div className={`${dateColor}`}>{due}</div>

        <div className="flex items-center gap-4">
          <object data="/cat.svg" width="30" height="30"></object>
          {assignee}
        </div>

        <div className="text-right h-full">
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
      </div>
      </td>
    </tr>
  );
};

export default TodoItemMobile;
