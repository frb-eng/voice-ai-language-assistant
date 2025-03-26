import { LanguageLevel, languageLevels, useAppContext } from "./AppContext";
import Button from "./components/Button";
import List from "./components/List";

export const LanguageLevelSelector = () => {
  const { level, setLevel } = useAppContext();

  return (
    <>
      <h2>Language level</h2>
      <List>
        {languageLevels.map((languageLevel) => (
          <Button
            key={languageLevel.id}
            isActive={level === languageLevel.id}
            onClick={() => setLevel(languageLevel.id as LanguageLevel)}
          >
            {languageLevel.name}
          </Button>
        ))}
      </List>
    </>
  );
};
