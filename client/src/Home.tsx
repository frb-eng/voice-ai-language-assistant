import { useAppContext } from "./AppContext";
import { LanguageLevelSelector } from "./LanguageLevelSelector";
import { TopicsList } from "./TopicsList";
import { Header } from "./components/Header";
import PageLayout from "./components/PageLayout";

export interface HomeProps {
  textPromise: Promise<string>;
}

export const Home = () => {
  const { level, topics } = useAppContext();

  return (
    <>
      <Header />
      <PageLayout>
        {!level && <LanguageLevelSelector />}
        {level && <TopicsList topics={topics} />}
      </PageLayout>
    </>
  );
};
