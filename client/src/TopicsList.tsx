import { useAppContext } from "./AppContext";
import Button from "./components/Button";
import List from "./components/List";
import { LoadingSkeleton } from "./components/LoadingSkeleton";

interface TopicsListProps {
  topics: string[];
}

export const TopicsList = ({ topics }: TopicsListProps) => {
  const { selectedTopic, setSelectedTopic, loading } = useAppContext();

  return (
    <>
      <h2>Topics</h2>
      <List>
        {loading
          ? [...Array(5)].map(() => <LoadingSkeleton />)
          : topics.map((topic, index) => (
              <Button
                key={index}
                onClick={() => setSelectedTopic(topic)}
                isActive={selectedTopic === topic}
              >
                {topic}
              </Button>
            ))}
      </List>
    </>
  );
};
