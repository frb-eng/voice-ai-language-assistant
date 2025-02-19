import React from "react";
import classNames from "classnames";
import styles from "./Button.module.css";

interface ButtonProps extends React.PropsWithChildren {
  onClick: () => void;
  isActive: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, isActive, children }) => {
  return (
    <button
      className={classNames(styles.container, { [styles.active]: isActive })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
