from fastapi import APIRouter, Query
from models.chat import ChatRequest
from services import conversation_service

router = APIRouter(prefix="/api", tags=["chat"])


@router.get("/chat")
async def get_conversation(
    level: str = Query(..., regex="^(A1|A2|B1|B2|C1|C2)$"), 
    topic: str = Query(...), 
    goal: str = Query(...)
):
    """Start a new conversation."""
    initial_message = await conversation_service.start_conversation(level, topic, goal)
    return initial_message


@router.post("/chat/continue")
async def continue_conversation(chat_request: ChatRequest):
    """Continue an existing conversation."""
    # Always validate if there's at least one user message in history
    if chat_request.history and any(msg.role == "user" for msg in chat_request.history):
        # Get the latest user message
        latest_user_message = next(
            (msg for msg in reversed(chat_request.history) if msg.role == "user"), 
            None
        )
        
        if latest_user_message:
            # Get validation from AI
            validation_result = await conversation_service.validate_response(
                chat_request, 
                latest_user_message.message
            )
            
            # If the response is incorrect, return feedback instead of continuing conversation
            if not validation_result.is_correct:
                return {
                    "message": validation_result.feedback,
                    "role": "assistant",
                    "validation": {
                        "is_correct": False,
                    }
                }
    
    # Continue the conversation
    response_message = await conversation_service.continue_conversation(chat_request)
    
    # Always return validation data for correct responses
    return {
        "message": response_message,
        "role": "assistant",
        "validation": {
            "is_correct": True,
            "feedback": "Very good! Your German sounds natural.",
            "explanation": "Your response was correct and appropriate for the topic and language level."
        }
    }
