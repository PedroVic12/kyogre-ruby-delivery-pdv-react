import React from "react";
import Button from "@mui/material/Button";

const buttonVariants = {
  // Define your button styles here
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  // Add other variants...
};

interface CustomButtonProps {
  variant?: "text" | "outlined" | "contained"; // MUI variants
  size?: "small" | "medium" | "large"; // MUI sizes
  onClick?: () => void;
  children: React.ReactNode;
  className?: string; // Additional class names
}

const CustomButton: React.FC<CustomButtonProps> = ({
  variant = "contained",
  size = "medium",
  onClick,
  children,
  className,
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={`${buttonVariants.default} ${className}`} // Combine styles directly
    >
      {children}
    </Button>
  );
};

export default CustomButton;