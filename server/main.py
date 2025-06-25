from fastapi import FastAPI, Query, File, UploadFile, Response
from openai import OpenAI
from langsmith.wrappers import wrap_openai
from langsmith import traceable
import os
from io import BytesIO
from tempfile import NamedTemporaryFile
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

class Topics(BaseModel):
    topics: list[str]

class LearningGoals(BaseModel):
    goals: list[str]

class ChatMessage(BaseModel):
    message: str
    role: str

class ChatRequest(BaseModel):
    level: str
    topic: str
    goal: str = ""
    history: list[ChatMessage] = []

class TextToSpeechRequest(BaseModel):
    text: str
    voice: str = "alloy"  # Default voice

class ValidationResponse(BaseModel):
    is_correct: bool
    feedback: str
    explanation: str

client = wrap_openai(OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
))

app = FastAPI()

# Add CORS middleware to allow requests from the client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/topics")
async def get_topics(level: str = Query(..., regex="^(A1|A2|B1|B2|C1|C2)$")):
    prompt = f"Generate 5 topics for a {level} german language learner."
    response = client.beta.chat.completions.parse(
    messages=[
        {
          "role": "system",
        "content": """
        You are a German teacher and helpful assistant.
        You will receive language level
        Please reply with 5 topics in English for provided level for German language learner.
        Example response:
        [
            "Greetings",
            "Weather",
            "Food",
            "Family",
            "Travel"
        ]
        """  
        },
        {
            "role": "user",
            "content": prompt
        }
    ],
    model="gpt-4o",
    temperature=1.3,
    response_format=Topics
    )
    topics = response.choices[0].message.parsed
    return topics

@app.get("/api/learning-goals")
async def get_learning_goals(level: str = Query(..., regex="^(A1|A2|B1|B2|C1|C2)$"), topic: str = Query(...)):
    response = client.beta.chat.completions.parse(
    messages=[
        {
          "role": "system",
        "content": """
        You are a German teacher and helpful assistant.
        You will receive a language level and topic.
        Please reply with 5 specific learning goals in English for the provided level and topic for a German language learner.
        These should be concrete, actionable objectives that the student can work towards during their conversation practice.
        Example response for A1 level and "Food" topic:
        [
            "Learn basic food vocabulary (10-15 words)",
            "Practice expressing food preferences",
            "Learn to order food in a restaurant",
            "Describe what you ate yesterday",
            "Practice asking about ingredients"
        ]
        """  
        },
        {
            "role": "user",
            "content": f"Generate learning goals for {level} level German learner studying {topic}"
        }
    ],
    model="gpt-4o",
    temperature=0.8,
    response_format=LearningGoals
    )
    goals = response.choices[0].message.parsed
    return goals

@app.get("/api/chat")
async def get_conversation(level: str = Query(..., regex="^(A1|A2|B1|B2|C1|C2)$"), topic: str = Query(...), goal: str = Query(...)):
    response = client.chat.completions.create(
    messages=[
        {
          "role": "system",
        "content": f"""
        You are a German teacher and helpful assistant.
        You will receive the selected topic, user language level, and learning goal.
        Please reply with a conversation starting single question in German.
        The topic today is "{topic}".
        The learning goal is "{goal}".
        The user is a {level} level German language learner.
        Your task is to initiate a conversation with the user that helps them achieve their learning goal.
        Respond only in German and keep it appropriate for {level} level.
        Example response:
        "Was ist dein Lieblingsessen und warum magst du es?"
        """  
        }
    ],
    model="gpt-4o",
    temperature=1.3,
    )
    initial_message = response.choices[0].message.content
    return initial_message

@app.post("/api/chat/continue")
async def continue_conversation(chat_request: ChatRequest):
    # Always validate if there's at least one user message in history
    if chat_request.history and any(msg.role == "user" for msg in chat_request.history):
        # Get the latest user message
        latest_user_message = next((msg for msg in reversed(chat_request.history) if msg.role == "user"), None)
        
        if latest_user_message:
            # Prepare validation request
            validation_messages = [
                {
                    "role": "system",
                    "content": f"""
                    You are a German language teacher evaluating a student's response.
                    The student is at {chat_request.level} level and the conversation topic is '{chat_request.topic}'.
                    The learning goal is '{chat_request.goal}'.
                    
                    Evaluate the student's response for:
                    1. Language correctness (grammar, vocabulary, sentence structure)
                    2. Topic relevance (stays on topic)
                    3. Progress towards the learning goal
                    
                    Return a JSON object with:
                    - is_correct: boolean (true if the answer is generally correct, false otherwise)
                    - feedback: string (concise and brief feedback in German using first-person language, as if you are speaking directly to the student)
                    
                    Examples of first-person feedback:
                    - "Ich verstehe was du meinst, aber ich würde sagen..."
                    - "Das hast du gut gemacht! Ich mag wie du..."
                    """
                },
                {
                    "role": "user",
                    "content": f"Student response: {latest_user_message.message}\nPlease evaluate this response."
                }
            ]
            
            # Get validation from AI
            validation_response = client.beta.chat.completions.parse(
                messages=validation_messages,
                model="gpt-4o",
                response_format=ValidationResponse,
                temperature=1.3,
            )
            
            validation_result = validation_response.choices[0].message.parsed
            
            # If the response is incorrect, return feedback instead of continuing conversation
            if not validation_result.is_correct:
                                return {
                                    "message": validation_result.feedback,
                    "role": "assistant",
                    "validation": {
                        "is_correct": False,
                    }
                }
    
    # Convert the chat history to the format expected by OpenAI API
    messages = [
        {
            "role": "system",
            "content": f"""
            You are a German teacher and helpful assistant.
            The topic today is "{chat_request.topic}".
            The learning goal is "{chat_request.goal}".
            The user is a {chat_request.level} level German language learner.
            Your task is to continue the conversation based on the user's last message while helping them achieve their learning goal.
            Respond in German in a way that's appropriate for their level.
            Keep responses concise, clear, and encouraging.
            Guide the conversation to help the student practice towards their learning goal.
            """
        }
    ]
    
    # Add conversation history
    for message in chat_request.history:
        messages.append({
            "role": message.role,
            "content": message.message
        })
    
    response = client.chat.completions.create(
        messages=messages,
        model="gpt-4o",
        temperature=1.3,
    )
    
    # Always return validation data for correct responses
    return {
        "message": response.choices[0].message.content,
        "role": "assistant",
        "validation": {
            "is_correct": True,
            "feedback": "Very good! Your German sounds natural.",
            "explanation": "Your response was correct and appropriate for the topic and language level."
        }
    }

@app.post("/api/speech-to-text")
async def speech_input(audio: UploadFile = File(...)):
    audio_content = await audio.read()
    
    # Process the audio as before
    buffer = BytesIO(audio_content)
    buffer.name = audio.filename
    response = client.audio.transcriptions.create(
        model="whisper-1",
        file=buffer
    )
    
    return {
        "text": response.text
    }

@app.post("/api/text-to-speech")
async def text_to_speech(request: TextToSpeechRequest):
    try:
        response = client.audio.speech.create(
            model="tts-1",
            voice=request.voice,
            input=request.text
        )
        
        # Get audio data as bytes
        audio_data = response.content
        
        # Return the audio as a response with appropriate headers
        return Response(
            content=audio_data,
            media_type="audio/mpeg"
        )
    except Exception as e:
        print(f"Error generating speech: {e}")
        return {"error": str(e)}
