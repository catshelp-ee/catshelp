import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomButton = styled(Button)(({ theme }) => ({
  width: "100%",
  backgroundColor: "#007AFF",
  "&:hover": { backgroundColor: "#3897FF" }, // Hover effect
  fontSize: "13px",
  padding: "8px 12px",
  borderRadius: "6px",
  textTransform: "none",
}));

const MyButton: React.FC<ButtonProps> = ({
  children,
  variant = "contained",
  ...props
}) => {
  return (
    <CustomButton variant={variant} {...props}>
      {children}
    </CustomButton>
  );
};

export default MyButton;
