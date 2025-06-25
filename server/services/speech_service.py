from io import BytesIO
from .base_openai_service import BaseOpenAIService


class SpeechService(BaseOpenAIService):
    """Service for handling speech-to-text and text-to-speech operations."""
    
    async def transcribe_audio(self, audio_buffer: BytesIO, filename: str) -> str:
        """Transcribe audio to text."""
        audio_buffer.name = filename
        response = self.client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_buffer
        )
        return response.text
    
    async def text_to_speech(self, text: str, voice: str = "alloy") -> bytes:
        """Convert text to speech."""
        response = self.client.audio.speech.create(
            model="tts-1",
            voice=voice,
            input=text
        )
        return response.content
