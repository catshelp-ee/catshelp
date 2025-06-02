import React from "react";
import Select, { SelectProps } from "@mui/material/Select";
import { useIsMobile } from "@/hooks/isMobile";

interface ResponsiveMultiSelectProps extends Omit<SelectProps, "children"> {
  children: React.ReactNode;
}

const ResponsiveMultiSelect: React.FC<ResponsiveMultiSelectProps> = ({
  children,
  ...selectProps
}) => {
  const isMobile = useIsMobile();
  const maxHeight = isMobile ? 300 : 500;

  return (
    <Select
      MenuProps={{
        PaperProps: {
          sx: { maxHeight },
        },
      }}
      {...selectProps}
    >
      {children}
    </Select>
  );
};

export default ResponsiveMultiSelect;
