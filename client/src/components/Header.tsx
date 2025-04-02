import React from "react";
import { useAppContext } from "../AppContext"; // Import useAppContext
import styles from "./Header.module.css"; // Import CSS module

export const Header = () => {
  const { level, selectedTopic } = useAppContext(); // Get level and selectedTopic from context

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <svg
          className={styles.logo}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          role="img"
          aria-label="Quassle Logo"
        >
          <circle cx="50" cy="50" r="45" fill="#4CAF50" />
          <text
            x="50"
            y="55"
            textAnchor="middle"
            fontSize="20"
            fill="#ffffff"
            fontFamily="Arial, sans-serif"
          >
            QA
          </text>
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
