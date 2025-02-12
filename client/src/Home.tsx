import { use } from "react";

export interface HomeProps {
  textPromise: Promise<string>;
}

export const Home = ({ textPromise }: HomeProps) => {
  const text = use(textPromise);
  return (
    <div>
      <h1>{text} </h1>
    </div>
  );
};
