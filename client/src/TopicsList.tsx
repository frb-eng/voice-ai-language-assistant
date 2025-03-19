import React from "react";
import { useAppContext } from "./AppContext";
import Button from "./components/Button";
import "./TopicsList.css"; // Import the CSS file

interface TopicsListProps {
  topics: string[];
}

export const TopicsList = ({ topics }: TopicsListProps) => {
  const { selectedTopic, setSelectedTopic } = useAppContext();

  return (
    <div>
      <h2>Topics</h2>
      <ul className="topics-list">
        {topics.map((topic, index) => (
          <li key={index} className="topics-list-item">
            <Button
              onClick={() => setSelectedTopic(topic)}
              isActive={selectedTopic === topic}
            >
              {topic}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
