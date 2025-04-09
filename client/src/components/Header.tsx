import { useAppContext } from "../AppContext"; // Import useAppContext
import styles from "./Header.module.css"; // Import CSS module

export const Header = () => {
  const { level, selectedTopic } = useAppContext(); // Get level and selectedTopic from context

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <circle cx="30" cy="30" r="10" fill="#00D1B2" />
          <circle cx="30" cy="30" r="5" fill="#1E1E2F" />
        </svg>

        <span className={styles.appName}>Quassle</span>
      </div>
      <div className={styles.tags}>
        {level && <span className={styles.tag}>{level}</span>}
        {selectedTopic && <span className={styles.tag}>{selectedTopic}</span>}
      </div>
    </header>
  );
};
