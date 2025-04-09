import { useState } from "react";
import styles from "./ChatWindow.module.css"; // Using CSS module
import Button from "./components/Button";

export const ChatWindow = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);

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
    <div className={styles.chatWindow}>
      <div className={styles.chatSection}>
        <div className={styles.chatHistory}>
          {chatHistory.map((message, index) => (
            <div key={index} className={styles.message}>
              {message}
            </div>
          ))}
        </div>
        <div className={styles.inputSection}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            className={styles.inputBox}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
};
