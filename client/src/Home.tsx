import { use } from "react";
import { LanguageLevelSelector } from "./LanguageLevelSelector";
import PageLayout from "./components/PageLayout"; // Import the PageLayout component
import { useAppContext } from "./AppContext"; // Import useAppContext

export interface HomeProps {
  textPromise: Promise<string>;
}

export const Home = ({ textPromise }: HomeProps) => {
  const text = use(textPromise);
  const { level } = useAppContext(); // Get level from context

  return (
    <PageLayout>
      {!level && <LanguageLevelSelector />}
      {/* <h1>{text}</h1> */}
    </PageLayout>
  );
};
