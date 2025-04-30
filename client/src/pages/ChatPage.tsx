import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./ChatPage.module.css";
import Button from "../components/Button";
import { Header } from "../components/Header";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import PageLayout from "../components/PageLayout";

type Message = {
  role: "user" | "assistant";
  message: string;
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
          setChatHistory([{ role: "assistant", message: data }]);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching initial prompt:", error);
          setChatHistory([
            { role: "assistant", message: `Hello! Let's talk about ${topicParam}` },
          ]);
          setIsLoading(false);
        });
    }
  }, [levelParam, topicParam, chatHistory.length]);

  const handleSendMessage = () => {
    if (userInput.trim() && levelParam && topicParam) {
      const userMessage = userInput.trim();
      // Add user message to chat history
      setChatHistory((prev) => [
        ...prev,
        { role: "user", message: userMessage },
      ]);
      setUserInput("");
      setIsProcessing(true);

      // Prepare the updated chat history for the API call
      const updatedHistory = [
        ...chatHistory,
        { role: "user", message: userMessage }
      ];

      // Send the message to the API to continue the conversation
      fetch('/api/chat/continue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: levelParam,
          topic: topicParam,
          history: updatedHistory,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          // Add AI response to chat history
          setChatHistory((prev) => [
            ...prev,
            { role: data.role, message: data.message },
          ]);
        })
        .catch((error) => {
          console.error('Error continuing conversation:', error);
          // Add fallback message if API call fails
          setChatHistory((prev) => [
            ...prev,
            { role: "assistant", message: "I'm sorry, I'm having trouble responding right now." },
          ]);
        })
        .finally(() => {
          setIsProcessing(false);
        });
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
                  message.role === "user"
                    ? styles.userMessage
                    : styles.aiMessage
                }`}
              >
                <strong>{message.role === "user" ? "You" : "AI"}: </strong>
                {message.message}
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
