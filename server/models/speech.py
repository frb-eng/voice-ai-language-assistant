from pydantic import BaseModel


class TextToSpeechRequest(BaseModel):
    text: str
    voice: str = "alloy"  # Default voice
