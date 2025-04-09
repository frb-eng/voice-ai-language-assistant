import React from "react";
import classNames from "classnames";
import styles from "./Button.module.css";

interface ButtonProps extends React.PropsWithChildren {
  onClick: () => void;
  isActive?: boolean;
  fullWidth?: boolean;
  className?: string; // New prop
}

const Button: React.FC<ButtonProps> = ({ onClick, isActive, fullWidth, className, children }) => {
  return (
    <button
      className={classNames(styles.container, className, { [styles.active]: isActive, [styles.fullWidth]: fullWidth })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
