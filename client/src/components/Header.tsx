import { Link, useParams } from "react-router-dom"; 
import styles from "./Header.module.css";

export const Header = () => {
  const { level, topic } = useParams<{ level?: string; topic?: string }>();

  return (
    <header className={styles.header}>
      <Link 
        to="/"
        className={styles.logoContainer}
      >
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
      </Link>
      <div className={styles.tags}>
        {level && (
          <Link 
            to="/level"
            className={styles.tag}
          >
            {level}
          </Link>
        )}
        {topic && level && (
          <Link 
            to={`/level/${level}/topic`}
            className={styles.tag}
          >
            {topic}
          </Link>
        )}
      </div>
    </header>
  );
};
