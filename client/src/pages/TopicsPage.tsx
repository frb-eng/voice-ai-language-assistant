import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../AppContext";
import { Header } from "../components/Header";
import PageLayout from "../components/PageLayout";
import List from "../components/List";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import styles from "./TopicsPage.module.css";

export const TopicsPage = () => {
  // Get level from URL parameters
  const { level } = useParams<{ level: string }>();
  const [topics, setTopics] = useState<string[]>([]);
  const { loading, setLoading } = useAppContext();

  // Fetch topics when level changes
  useEffect(() => {
    if (level) {
      setLoading(true);
      fetch(`/api/topics?level=${level}`)
        .then(response => response.json())
        .then(data => setTopics(data.topics))
        .catch(error => console.error("Error fetching topics:", error))
        .finally(() => setLoading(false));
    }
  }, [level, setLoading]);

  return (
    <>
      <Header />
      <PageLayout>
        <h2>Select a Topic</h2>
        <List>
          {loading
            ? [...Array(5)].map((_, index) => <LoadingSkeleton key={index} />)
            : topics.map((topic, index) => (
                <Link
                  key={index}
                  to={`/level/${level}/topic/${encodeURIComponent(topic)}`}
                  className={styles.topicLink}
                >
                  {topic}
                </Link>
              ))}
        </List>
      </PageLayout>
    </>
  );
};
