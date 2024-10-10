import React, { FC, useEffect, useState } from "react";
import { EditableTextareaProps } from "../Interfaces";
import { TextareaAutosize } from "@mui/material";

const EditableTextarea: FC<EditableTextareaProps> = ({
  label,
  children,
  ...props
}) => {
  const [info, setInfo] = useState<string>();
  useEffect(() => {
    setInfo(children?.toString());

    return () => {};
  }, []);

  return (
    <div className="flex mb-2 inline-flex">
      <span className="pr-4">{label}</span>
      <TextareaAutosize
        disabled={props.disabled}
        name={props.name}
        value={info}
        onChange={(event: any) => setInfo(event.target.value)}
      />
    </div>
  );
};

export default EditableTextarea;
