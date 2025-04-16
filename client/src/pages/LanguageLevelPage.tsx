import { Link } from "react-router-dom";
import { languageLevels } from "../AppContext";
import { Header } from "../components/Header";
import PageLayout from "../components/PageLayout";
import List from "../components/List";
import styles from "./LanguageLevelPage.module.css";

export const LanguageLevelPage = () => {
  return (
    <>
      <Header />
      <PageLayout>
        <h2>Select Your Language Level</h2>
        <List>
          {languageLevels.map((languageLevel) => (
            <Link
              key={languageLevel.id}
              to={`/level/${languageLevel.id}/topic`}
              className={styles.levelLink}
            >
              {languageLevel.name}
            </Link>
          ))}
        </List>
      </PageLayout>
    </>
  );
};
