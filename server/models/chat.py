from pydantic import BaseModel


class ChatMessage(BaseModel):
    message: str
    role: str


class ChatRequest(BaseModel):
    level: str
    topic: str
    goal: str = ""
    history: list[ChatMessage] = []
