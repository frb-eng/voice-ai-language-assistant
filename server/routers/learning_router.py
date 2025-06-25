from fastapi import APIRouter, Query
from services import learning_service

router = APIRouter(prefix="/api", tags=["learning"])


@router.get("/topics")
async def get_topics(level: str = Query(..., regex="^(A1|A2|B1|B2|C1|C2)$")):
    """Get topics for a specific language level."""
    topics = await learning_service.get_topics(level)
    return topics


@router.get("/learning-goals")
async def get_learning_goals(
    level: str = Query(..., regex="^(A1|A2|B1|B2|C1|C2)$"), 
    topic: str = Query(...)
):
    """Get learning goals for a specific level and topic."""
    goals = await learning_service.get_learning_goals(level, topic)
    return goals
