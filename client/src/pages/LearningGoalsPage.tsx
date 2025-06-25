import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAppContext } from "../AppContext";
import { Header } from "../components/Header";
import PageLayout from "../components/PageLayout";
import List from "../components/List";
import Link from "../components/Link";
import { LoadingSkeleton } from "../components/LoadingSkeleton";

export const LearningGoalsPage = () => {
  // Get level and topic from URL parameters
  const { level, topic } = useParams<{ level: string; topic: string }>();
  const [learningGoals, setLearningGoals] = useState<string[]>([]);
  const { loading, setLoading } = useAppContext();

  // Redirect to home if no level or topic
  if (!level || !topic) {
    return <Navigate to="/" replace />;
  }

  // Fetch learning goals when level and topic change
  useEffect(() => {
    if (level && topic) {
      setLoading(true);
      fetch(`/api/learning-goals?level=${level}&topic=${encodeURIComponent(topic)}`)
        .then(response => response.json())
        .then(data => setLearningGoals(data.goals))
        .catch(error => console.error("Error fetching learning goals:", error))
        .finally(() => setLoading(false));
    }
  }, [level, topic, setLoading]);

  return (
    <>
      <Header />
      <PageLayout>
        <h2>Select Your Learning Goal</h2>
        <p>What would you like to focus on during this session?</p>
        <List>
          {loading
            ? [...Array(5)].map((_, index) => <LoadingSkeleton key={index} />)
            : learningGoals.map((goal, index) => (
                <Link
                  key={`goal-${index}`}
                  to={`/level/${level}/topic/${encodeURIComponent(topic)}/goal/${encodeURIComponent(goal)}`}
                >
                  {goal}
                </Link>
              ))}
        </List>
      </PageLayout>
    </>
  );
};
