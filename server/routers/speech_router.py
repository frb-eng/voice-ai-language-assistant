from fastapi import APIRouter, File, UploadFile, Response
from io import BytesIO
from models.speech import TextToSpeechRequest
from services import speech_service

router = APIRouter(prefix="/api", tags=["speech"])


@router.post("/speech-to-text")
async def speech_input(audio: UploadFile = File(...)):
    """Convert speech to text."""
    audio_content = await audio.read()
    
    # Process the audio
    buffer = BytesIO(audio_content)
    text = await speech_service.transcribe_audio(buffer, audio.filename)
    
    return {"text": text}


@router.post("/text-to-speech")
async def text_to_speech(request: TextToSpeechRequest):
    """Convert text to speech."""
    try:
        audio_data = await speech_service.text_to_speech(request.text, request.voice)
        
        # Return the audio as a response with appropriate headers
        return Response(
            content=audio_data,
            media_type="audio/mpeg"
        )
    except Exception as e:
        print(f"Error generating speech: {e}")
        return {"error": str(e)}
