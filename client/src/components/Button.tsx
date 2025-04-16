import React from "react";
import classNames from "classnames";
import styles from "./Button.module.css";

interface ButtonProps extends React.PropsWithChildren {
  onClick: () => void;
  isActive?: boolean;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean; // Added disabled prop
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  isActive, 
  fullWidth, 
  className, 
  disabled = false, // Default to false
  children 
}) => {
  return (
    <button
      className={classNames(
        styles.container, 
        className, 
        { 
          [styles.active]: isActive, 
          [styles.fullWidth]: fullWidth,
          [styles.disabled]: disabled // Add disabled class when button is disabled
        }
      )}
      onClick={onClick}
      disabled={disabled} // Add disabled attribute
    >
      {children}
    </button>
  );
};

export default Button;
