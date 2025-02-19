import { LanguageLevel, languageLevels, useAppContext } from "./AppContext";
import styles from "./LanguageLevelSelector.module.css";
import Button from "./components/Button";

export const LanguageLevelSelector = () => {
  const { level, setLevel } = useAppContext();

  return (
    <div className={styles.container}>
      {languageLevels.map((languageLevel) => (
        <Button
          key={languageLevel.id}
          isActive={level === languageLevel.id}
          onClick={() => setLevel(languageLevel.id as LanguageLevel)}
        >
          {languageLevel.name}
        </Button>
      ))}
    </div>
  );
};
