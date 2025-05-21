import { useState, useEffect } from "react";
import styles from "./TextToSpeech.module.css";

interface TextToSpeechProps {
  text: string;
  voice?: string;
  autoPlay?: boolean;
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ 
  text, 
  voice = "alloy",
  autoPlay = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [previousText, setPreviousText] = useState<string>("");

  useEffect(() => {
    // Only auto-play when text changes and autoPlay is enabled
    if (autoPlay && text && text !== previousText && !isPlaying && !isLoading) {
      setPreviousText(text);
      handleSpeak();
    }
  }, [text, autoPlay]);

  const handleSpeak = async () => {
    if (!text || isPlaying || isLoading) return;

    try {
      setIsLoading(true);

      // Call our API to generate speech from text using OpenAI
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, voice }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      // Get the audio blob from the response
      const audioBlob = await response.blob();
      
      // Create an object URL for the audio blob
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Create and set up an audio element
      const audio = new Audio(audioUrl);
      
      // Clean up previous audio element if it exists
      if (audioElement) {
        audioElement.pause();
        URL.revokeObjectURL(audioElement.src);
      }
      
      // Store the new audio element
      setAudioElement(audio);
      
      // Set up event listeners
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        console.error('Error playing audio');
      };
      
      // Play the audio
      setIsLoading(false);
      setIsPlaying(true);
      await audio.play();
    } catch (error) {
      console.error('Error generating speech:', error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const stopSpeech = () => {
    if (audioElement && isPlaying) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <button 
      className={`${styles.speakButton} ${isPlaying ? styles.speaking : ''} ${isLoading ? styles.loading : ''}`} 
      onClick={isPlaying ? stopSpeech : handleSpeak}
      disabled={isLoading}
      title={isLoading ? "Loading audio..." : isPlaying ? "Stop speaking" : "Listen to this response"}
      aria-label={isLoading ? "Loading audio" : isPlaying ? "Stop AI voice" : "Listen to AI response"}
    >
      {isLoading ? (
        <div className={styles.loadingIndicator}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      ) : isPlaying ? (
        <svg 
          className={styles.speakerIcon} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4.5 5h-2v14h2V5zm15 0h-2v14h2V5zm-12 3h-2v8h2V8zm6 0h-2v8h2V8z" />
        </svg>
      ) : (
        <svg 
          className={styles.speakerIcon} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
      )}
      {isPlaying && (
        <div className={styles.soundWave}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
    </button>
  );
};

export default TextToSpeech;