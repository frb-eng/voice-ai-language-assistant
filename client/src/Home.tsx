import { use } from "react";
import { LanguageLevelSelector } from "./LanguageLevelSelector";
import PageLayout from "./components/PageLayout"; // Import the PageLayout component
import { useAppContext } from "./AppContext"; // Import useAppContext
import { TopicsList } from "./TopicsList"; // Import TopicsList component

export interface HomeProps {
  textPromise: Promise<string>;
}

export const Home = ({ textPromise }: HomeProps) => {
  const text = use(textPromise);
  const { level, topics } = useAppContext(); // Get level and topics from context

  return (
    <PageLayout>
      {!level && <LanguageLevelSelector />}
      {level && <TopicsList topics={topics} />}
      {/* <h1>{text}</h1> */}
    </PageLayout>
  );
};
