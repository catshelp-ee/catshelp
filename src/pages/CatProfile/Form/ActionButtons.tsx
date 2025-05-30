import React from "react";
import { Button } from "@mui/material";

interface ActionButtonsProps {
  className?: string;
}

const buttonStyles = {
  backgroundColor: "#007AFF",
  fontSize: "13px",
  padding: "4px 36px",
  borderRadius: "6px",
  textTransform: "none",
  marginRight: "24px",
};

export const ActionButtons: React.FC<ActionButtonsProps> = ({ className }) => (
  <div className={`flex justify-end mt-8 ${className}`}>
    <Button sx={buttonStyles} variant="contained" type="submit">
      Salvesta
    </Button>
    <Button sx={buttonStyles} variant="contained" type="submit">
      Uuenda veebi (IGNORE)
    </Button>
  </div>
);
