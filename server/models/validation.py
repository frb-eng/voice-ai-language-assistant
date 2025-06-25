from pydantic import BaseModel


class ValidationResponse(BaseModel):
    is_correct: bool
    feedback: str
    explanation: str
