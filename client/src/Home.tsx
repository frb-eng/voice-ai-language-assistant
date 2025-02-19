import { use } from "react";
import { LanguageLevelSelector } from "./LanguageLevelSelector"; // Import the selector

export interface HomeProps {
  textPromise: Promise<string>;
}

export const Home = ({ textPromise }: HomeProps) => {
  const text = use(textPromise);
  return (
    <div>
      <LanguageLevelSelector />
      {/* <h1>{text}</h1> */}
    </div>
  );
};
