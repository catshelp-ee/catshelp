import { FC, useEffect, useState } from "react";
import { EditableInputProps } from "../Interfaces";
import { Input } from "@mui/material";

const EditableInput: FC<EditableInputProps> = ({
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
    <div className="flex justify-between mb-2">
      <span className="pr-12">{label}</span>
      <Input
        disabled={props.disabled}
        name={props.name}
        value={info}
        onChange={(event: any) => setInfo(event.target.value)}
      />
    </div>
  );
};

export default EditableInput;
