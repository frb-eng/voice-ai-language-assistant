from fastapi import FastAPI, Response, Query
from openai import OpenAI
import os

from pydantic import BaseModel

class Topics(BaseModel):
    topics: list[str]

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