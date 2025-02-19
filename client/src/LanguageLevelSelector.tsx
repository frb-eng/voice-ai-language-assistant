import { LanguageLevel, languageLevels, useAppContext } from "./AppContext";

export const LanguageLevelSelector = () => {
  const { level, setLevel } = useAppContext();

  return (
    <div>
      <label>
        Select Language Level:
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as LanguageLevel)}
        >
          {languageLevels.map((languageLevel) => (
            <option key={languageLevel.id} value={languageLevel.id}>
              {languageLevel.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};
