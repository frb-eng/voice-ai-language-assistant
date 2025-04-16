import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import PageLayout from "../components/PageLayout";
import styles from "./HomePage.module.css";

export const HomePage = () => {
  return (
    <>
      <Header />
      <PageLayout>
        <div className={styles.container}>
          <h1>Welcome to Quassle</h1>
          <p>
            An interactive tool designed to enhance German language learning by providing
            tailored experiences for users at different skill levels.
          </p>
          <Link to="/level" className={`${styles.startButton} ${styles.linkButton}`}>
            Get Started
          </Link>
        </div>
      </PageLayout>
    </>
  );
};
