import { PropsWithChildren } from "react";
import styles from "./List.module.css"; // Import the new CSS module

const List = ({ children }: PropsWithChildren) => {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
};

export default List;
