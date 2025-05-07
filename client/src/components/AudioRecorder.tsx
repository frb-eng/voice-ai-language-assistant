import React, { useState, useRef } from "react";
import styles from "./AudioRecorder.module.css";

interface AudioRecorderProps {
  onTranscriptionResult: (transcript: string) => void;
  disabled?: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onTranscriptionResult,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    if (disabled || isProcessing) return;

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm; codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);
      
      mediaRecorder.onstart = () => {
        audioChunksRef.current = [];
        setIsRecording(true);
        setIsProcessing(false);
      }
      
      mediaRecorder.onstop = async () => {
        // Process the recorded audio
        await processAudio();
        
        // Stop all tracks in the stream to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsProcessing(true);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access your microphone. Please make sure you've granted permission.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudio = async () => {
    try {
      // Create a blob from the audio chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Create a FormData object to send to the server
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      // Send the audio to the server for transcription
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Call the callback with the transcription result
      if (data.text && data.text.trim()) {
        onTranscriptionResult(data.text);
      } else {
        alert("Could not recognize speech. Please try again.");
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("There was an error processing your speech. Please try again.");
    } finally {
      setIsProcessing(false);
      audioChunksRef.current = [];
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      className={`${styles.audioRecorder} ${isRecording ? styles.recording : ''} ${isProcessing ? styles.processing : ''} ${disabled ? styles.disabled : ''}`}
      onClick={handleToggleRecording}
      disabled={disabled || isProcessing}
      title={isRecording ? "Stop Recording" : isProcessing ? "Processing..." : "Start Speaking (German)"}
    >
      <svg 
        className={styles.microphoneIcon} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
        <path d="M19 11h-1.7c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72z" />
      </svg>
      {isProcessing && (
        <div className={styles.spinner}></div>
      )}
      {isRecording && <span className={styles.recordingIndicator}></span>}
    </button>
  );
};

export default AudioRecorder;