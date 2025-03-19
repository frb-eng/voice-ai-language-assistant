import React from "react";
import classNames from "classnames";
import styles from "./Button.module.css";

interface ButtonProps extends React.PropsWithChildren {
  onClick: () => void;
  isActive: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, isActive, fullWidth, children }) => {
  return (
    <button
      className={classNames(styles.container, { [styles.active]: isActive, [styles.fullWidth]: fullWidth })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
