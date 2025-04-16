import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./ChatPage.module.css";
import Button from "../components/Button";
import { Header } from "../components/Header";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import PageLayout from "../components/PageLayout";

type Message = {
  sender: "user" | "ai";
  text: string;
};

export const ChatPage = () => {
  // Get level and topic from URL parameters
  const { level: levelParam, topic: topicParam } = useParams<{
    level: string;
    topic: string;
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Initialize chat with an AI prompt
  useEffect(() => {
    if (levelParam && topicParam && chatHistory.length === 0) {
      setIsLoading(true);
      // Fetch initial prompt from API using URL parameters
      fetch(
        `/api/chat?level=${levelParam}&topic=${encodeURIComponent(topicParam)}`
      )
        .then((response) => response.text())
        .then((data) => {
          setChatHistory([{ sender: "ai", text: data }]);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching initial prompt:", error);
          setChatHistory([
            { sender: "ai", text: `Hello! Let's talk about ${topicParam}` },
          ]);
          setIsLoading(false);
        });
    }
  }, [levelParam, topicParam, chatHistory.length]);

  const handleSendMessage = () => {
    if (userInput.trim()) {
      const userMessage = userInput.trim();
      setChatHistory((prev) => [
        ...prev,
        { sender: "user", text: userMessage },
      ]);
      setUserInput("");
      setIsProcessing(true);

      // Simulate AI response
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          { sender: "ai", text: `Response to "${userMessage}"` },
        ]);
        setIsProcessing(false);
      }, 1000);
    }
  };

  return (
    <>
      <Header />
      <PageLayout>
        <div className={styles.chatHistory} ref={chatHistoryRef}>
          {isLoading ? (
            <div className={styles.loadingIndicator}>
              <LoadingSkeleton />
              <span>AI is thinking...</span>
            </div>
          ) : (
            chatHistory.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  message.sender === "user"
                    ? styles.userMessage
                    : styles.aiMessage
                }`}
              >
                <strong>{message.sender === "user" ? "You" : "AI"}: </strong>
                {message.text}
              </div>
            ))
          )}
          {isProcessing && (
            <div className={styles.loadingIndicator}>
              <LoadingSkeleton />
              <span>AI is thinking...</span>
            </div>
          )}
        </div>
        <div className={styles.inputSection}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            className={styles.inputBox}
            disabled={isLoading || isProcessing}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading && !isProcessing) {
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || isProcessing || !userInput.trim()}
          >
            Send
          </Button>
        </div>
      </PageLayout>
    </>
  );
};
