from fastapi import APIRouter, Query
from models.chat import ChatRequest
from services import conversation_service
from services.validation_service import ValidationService

router = APIRouter(prefix="/api", tags=["chat"])
validation_service = ValidationService()


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
    validation_result = None
    
    # Always validate if there's at least one user message in history
    if chat_request.history and any(msg.role == "user" for msg in chat_request.history):
        # Get the latest user message
        latest_user_message = next(
            (msg for msg in reversed(chat_request.history) if msg.role == "user"), 
            None
        )
        
        if latest_user_message:
            # Get detailed validation from AI
            # Get the last 3 messages for context
            conversation_history = []
            if chat_request.history:
                history_list = list(chat_request.history)
                current_msg_index = next(
                    (i for i, msg in enumerate(history_list) if msg == latest_user_message),
                    len(history_list)
                )
                start_index = max(0, current_msg_index - 3)
                conversation_history = history_list[start_index:current_msg_index]

            validation_result = await validation_service.validate_message(
                latest_user_message.message,
                {
                    "language_level": chat_request.level,
                    "learning_goal": chat_request.goal,
                    "conversation_history": conversation_history
                }
            )
            
            # If the response is incorrect, return feedback instead of continuing conversation
            if not validation_result.is_correct:
                return {
                    "message": validation_result.overall_feedback,
                    "role": "assistant",
                    "validation": validation_result
                }
    
    # Continue the conversation
    response_message = await conversation_service.continue_conversation(chat_request)
    
    return {
        "message": response_message,
        "role": "assistant",
        "validation": validation_result
    }
