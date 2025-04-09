import { useAppContext } from "./AppContext";
import { ChatWindow } from "./ChatWindow";
import { LanguageLevelSelector } from "./LanguageLevelSelector";
import { TopicsList } from "./TopicsList";
import { Header } from "./components/Header";
import PageLayout from "./components/PageLayout";

export interface HomeProps {
  textPromise: Promise<string>;
}

export const Home = () => {
  const { level, topics, selectedTopic } = useAppContext();

  return (
    <>
      <Header />
      <PageLayout>
        {!level && <LanguageLevelSelector />}
        {level && !selectedTopic && <TopicsList topics={topics} />}
        {level && selectedTopic && <ChatWindow/>}
      </PageLayout>
    </>
  );
};
