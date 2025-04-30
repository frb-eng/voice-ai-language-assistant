from fastapi import FastAPI, Response, Query
from openai import OpenAI
import os

from pydantic import BaseModel

class Topics(BaseModel):
    topics: list[str]

class ChatMessage(BaseModel):
    message: str
    role: str

class ChatRequest(BaseModel):
    level: str
    topic: str
    history: list[ChatMessage] = []

client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPEN_API_TOKEN"),
)

app = FastAPI()

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
    temperature=0.1,
    response_format=Topics
    )
    topics = response.choices[0].message.parsed
    return topics

@app.get("/api/chat")
async def get_conversation(level: str = Query(..., regex="^(A1|A2|B1|B2|C1|C2)$"),topic: str = Query(...)):
    prompt = f"Initiate a conversation for {topic} for a {level} german language learner."
    response = client.chat.completions.create(
    messages=[
        {
          "role": "system",
        "content": """
        You are a German teacher and helpful assistant.
        You will receive the selected topic and user language level
        Please reply with a conversation starting single question.
        """  
        },
        {
            "role": "user",
            "content": prompt
        }
    ],
    model="gpt-4o",
    temperature=0.1,
    )
    topics = response.choices[0].message.content
    return topics

@app.post("/api/chat/continue")
async def continue_conversation(chat_request: ChatRequest):
    # Convert the chat history to the format expected by OpenAI API
    messages = [
        {
            "role": "system",
            "content": f"""
            You are a German teacher and helpful assistant.
            You are having a conversation with a {chat_request.level} level German language learner about '{chat_request.topic}'.
            Respond in a way that's appropriate for their level. Include some German phrases or words.
            Keep responses concise, clear, and encouraging.
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
        temperature=0.7,
    )
    
    return {"message": response.choices[0].message.content, "role": "assistant"}