import { useAppContext } from "./AppContext";
import Button from "./components/Button";
import List from "./components/List";

interface TopicsListProps {
  topics: string[];
}

export const TopicsList = ({ topics }: TopicsListProps) => {
  const { selectedTopic, setSelectedTopic } = useAppContext();

  return (
    <>
      <h2>Topics</h2>
      <List>
        {topics.map((topic, index) => (
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
