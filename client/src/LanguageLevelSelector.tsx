import { LanguageLevel, languageLevels, useAppContext } from "./AppContext";
import styles from "./LanguageLevelSelector.module.css";

export const LanguageLevelSelector = () => {
  const { level, setLevel } = useAppContext();

  return <div className={styles.container}>
  {languageLevels.map((languageLevel) => (
    <button
      key={languageLevel.id}
      className={`${styles.levelButton} ${level === languageLevel.id ? styles.active : ""}`}
      onClick={() => setLevel(languageLevel.id as LanguageLevel)}
    >
      {languageLevel.name}
    </button>
  ))}
</div>
};
