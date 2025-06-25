from .learning_service import LearningService
from .conversation_service import ConversationService
from .speech_service import SpeechService

# Service instances
learning_service = LearningService()
conversation_service = ConversationService()
speech_service = SpeechService()

__all__ = ["learning_service", "conversation_service", "speech_service"]
