import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./ChatPage.module.css";
import Button from "../components/Button";
import AudioRecorder from "../components/AudioRecorder";
import TextToSpeech from "../components/TextToSpeech";
import { Header } from "../components/Header";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import PageLayout from "../components/PageLayout";

type Message = {
  role: "user" | "assistant";
  message: string;
  validation?: {
    is_correct: boolean;
  };
};

export const ChatPage = () => {
  // Get level, topic, and goal from URL parameters
  const { level: levelParam, topic: topicParam, goal: goalParam } = useParams<{
    level: string;
    topic: string;
    goal: string;
  }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const [conversationStarted, setConversationStarted] = useState(false);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Initialize chat with an AI prompt when conversation is started
  useEffect(() => {
    if (levelParam && topicParam && goalParam && conversationStarted && chatHistory.length === 0) {
      setIsLoading(true);
      // Fetch initial prompt from API using URL parameters
      fetch(
        `/api/chat?level=${levelParam}&topic=${encodeURIComponent(topicParam)}&goal=${encodeURIComponent(goalParam)}`
      )
        .then((response) => response.text())
        .then((data) => {
          setChatHistory([{ role: "assistant", message: data }]);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching initial prompt:", error);
          setChatHistory([
            { role: "assistant", message: `Hello! Let's talk about ${topicParam} focusing on ${goalParam}` },
          ]);
          setIsLoading(false);
        });
    }
  }, [levelParam, topicParam, goalParam, conversationStarted, chatHistory.length]);

  const handleSendMessage = (message: string = userInput.trim()) => {
    if (message && levelParam && topicParam && goalParam) {
      // Add user message to chat history
      setChatHistory((prev) => [
        ...prev,
        { role: "user", message: message },
      ]);
      setUserInput(""); // Clear the input field
      setIsProcessing(true);

      // Prepare the updated chat history for the API call
      const updatedHistory = [
        ...chatHistory,
        { role: "user", message: message }
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
          goal: goalParam,
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
          // Add AI response to chat history with validation if present
          setChatHistory((prev) => [
            ...prev,
            { 
              role: data.role, 
              message: data.message,
              validation: data.validation // Include validation data if available
            },
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

  // Handle speech input from the audio recorder
  const handleTranscriptionResult = (transcript: string) => {
    if (transcript) {
      setUserInput(transcript); // Set the transcript to the input field
      // Send the message with a small delay to allow users to see what was transcribed
      setTimeout(() => {
        handleSendMessage(transcript);
      }, 500);
    }
  };

  const handleButtonClick = () => {
    if (userInput.trim()) {
      handleSendMessage();
    }
  };

  const startConversation = () => {
    setConversationStarted(true);
  };

  return (
    <>
      <Header />
      <PageLayout>
        {!conversationStarted ? (
          <div className={styles.startContainer}>
            <h2>Start a conversation in German</h2>
            <p>Practice your {levelParam} level German with a conversation about {topicParam}, focusing on {goalParam}</p>
            <Button onClick={startConversation}>Start Conversation</Button>
          </div>
        ) : (
          <>
            <div className={styles.chatHistory} ref={chatHistoryRef}>
              {isLoading ? (
                <div className={styles.loadingIndicator}>
                  <LoadingSkeleton />
                  <span>AI is thinking...</span>
                </div>
              ) : (
                chatHistory.map((message, index) => {
                  // Show validation as a single red bubble (no nested bubbles) if incorrect
                  const isValidationError = message.role === "assistant" && message.validation && !message.validation.is_correct;
                  if (isValidationError && message.validation) {
                    return (
                      <div
                        key={index}
                        className={`${styles.message} ${styles.aiMessage} ${styles.validationIncorrect}`}
                        style={{ borderLeft: '3px solid #FF3860', background: '#2a0d13' }}
                      >
                        <div className={styles.messageContent}>
                          <strong>AI: </strong>
                          {message.message}
                        </div>
                        <div className={styles.messageActions}>
                          <TextToSpeech text={message.message} />
                        </div>
                      </div>
                    );
                  }
                  // Default bubble rendering
                  return (
                    <div
                      key={index}
                      className={`${styles.message} ${
                        message.role === "user"
                          ? styles.userMessage
                          : styles.aiMessage
                      }`}
                    >
                      <div className={styles.messageContent}>
                        <strong>{message.role === "user" ? "You" : "AI"}: </strong>
                        {message.message}
                      </div>
                      {message.role === "assistant" && (
                        <div className={styles.messageActions}>
                          <TextToSpeech text={message.message} />
                        </div>
                      )}
                    </div>
                  );
                })
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
                  if (e.key === "Enter" && !isLoading && !isProcessing && userInput.trim()) {
                    handleButtonClick();
                  }
                }}
              />
              <Button
                onClick={handleButtonClick}
                disabled={isLoading || isProcessing || !userInput.trim()}
              >
                Send
              </Button>
              <AudioRecorder 
                onTranscriptionResult={handleTranscriptionResult}
                disabled={isLoading || isProcessing}
              />
            </div>
          </>
        )}
      </PageLayout>
    </>
  );
};
