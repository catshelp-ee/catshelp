import React from "react";
import { Button } from "@mui/material";

interface ActionButtonsProps {
  className?: string;
  onWixUpdate?: () => void;
}

const buttonStyles = {
  backgroundColor: "#007AFF",
  fontSize: "13px",
  padding: "4px 36px",
  borderRadius: "6px",
  textTransform: "none",
  marginRight: "24px",
};

export const ActionButtons: React.FC<ActionButtonsProps> = ({ className, onWixUpdate }) => (
  <div className={`flex justify-center my-8 ${className? className: ""}`}>
    <Button sx={buttonStyles} variant="contained" type="submit">
      Salvesta
    </Button>
    <Button 
      sx={buttonStyles} 
      variant="contained" 
      onClick={onWixUpdate}
      type="button"
    >
      Uuenda veebi
    </Button>
  </div>
);
