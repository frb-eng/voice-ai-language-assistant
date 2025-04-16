import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ChatPage.module.css";
import Button from "../components/Button";
import { Header } from "../components/Header";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import PageLayout from "../components/PageLayout";

export const ChatPage = () => {
  // Get level and topic from URL parameters
  const { level: levelParam, topic: topicParam } = useParams<{ level: string; topic: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  // Initialize chat with an AI prompt
  useEffect(() => {
    if (levelParam && topicParam && chatHistory.length === 0) {
      setIsLoading(true);
      // Fetch initial prompt from API using URL parameters
      fetch(`/api/chat?level=${levelParam}&topic=${encodeURIComponent(topicParam)}`)
        .then(response => response.text())
        .then(data => {
          setChatHistory([`AI: ${data}`]);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error fetching initial prompt:", error);
          setChatHistory(["AI: Hello! Let's talk about " + topicParam]);
          setIsLoading(false);
        });
    }
  }, [levelParam, topicParam, chatHistory.length]);

  const handleSendMessage = () => {
    if (userInput.trim()) {
      setChatHistory((prev) => [...prev, `User: ${userInput}`]);
      setUserInput("");
      // Simulate AI response
      setTimeout(() => {
        setChatHistory((prev) => [...prev, `AI: Response to "${userInput}"`]);
      }, 500);
    }
  };

  return (
    <>
      <Header />
      <PageLayout>
        <div className={styles.chatWindow}>
          <div className={styles.chatSection}>
            <div className={styles.chatHistory}>
              {chatHistory.map((message, index) => (
                <div key={index} className={styles.message}>
                  {message}
                </div>
              ))}
              {isLoading && <LoadingSkeleton />}
            </div>
            <div className={styles.inputSection}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message..."
                className={styles.inputBox}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};
