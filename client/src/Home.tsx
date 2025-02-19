import { use } from "react";
import { LanguageLevelSelector } from "./LanguageLevelSelector";
import PageLayout from "./components/PageLayout"; // Import the PageLayout component

export interface HomeProps {
  textPromise: Promise<string>;
}

export const Home = ({ textPromise }: HomeProps) => {
  const text = use(textPromise);
  return (
    <PageLayout>
      <LanguageLevelSelector />
      {/* <h1>{text}</h1> */}
    </PageLayout>
  );
};
