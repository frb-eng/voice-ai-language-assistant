import { use } from "react";
import { LanguageLevelSelector } from "./LanguageLevelSelector";
import PageLayout from "./components/PageLayout"; // Import the PageLayout component
import { useAppContext } from "./AppContext"; // Import useAppContext
import { TopicsList } from "./TopicsList"; // Import TopicsList component
import { Header } from "./components/Header"; // Import Header component
import { LoadingSkeleton } from "./components/LoadingSkeleton"; // Update import

export interface HomeProps {
  textPromise: Promise<string>;
}

export const Home = ({ textPromise }: HomeProps) => {
  const text = use(textPromise);
  const { level, topics, loading } = useAppContext(); // Get level, topics, and loading state from context

  return (
    <>      
    <Header /> {/* Add Header component */}
    <PageLayout>
      {!level && <LanguageLevelSelector />}
      {level && loading && <LoadingSkeleton />} {/* Show loading skeleton while fetching */}
      {level && !loading && <TopicsList topics={topics} />}
      {/* <h1>{text}</h1> */}
    </PageLayout>
    </>
  );
};
