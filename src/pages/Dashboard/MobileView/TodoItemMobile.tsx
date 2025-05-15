import React, { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@mui/material";
import CatSvg from "@pages/Dashboard/CatSvg";

interface TodoItemProps {
  label: string;
  assignee: string;
  due: string;
  action: {
    label: string;
    redirect: string;
  };
  urgent: boolean;
  catColour: string,
}

const TodoItemMobile: React.FC<TodoItemProps> = ({
  label,
  due,
  assignee,
  action,
  urgent,
  catColour,
}) => {
  const [checked, setChecked] = useState(false);
  const dateColor = urgent ? "text-red-400" : "text-slate-500";

  console.log(catColour)

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
      <td className="flex items-end">
        <div className={`${dateColor} w-1/3 text-sm`}>{due}</div>

        <div className="flex items-center gap-4 w-1/3 text-sm text-left">
          <CatSvg width={30} height={30} colour={`${catColour}`} />
          {assignee}
        </div>

        <div className="w-1/3 px-2 ">
          <a href={action.redirect} target="_blank" rel="noopener noreferrer">
            <Button
              sx={{
                width: "100%",
                backgroundColor: "#007AFF",
                fontSize: "12px",
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
