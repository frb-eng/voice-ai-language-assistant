from pydantic import BaseModel


class Topics(BaseModel):
    topics: list[str]


class LearningGoals(BaseModel):
    goals: list[str]
