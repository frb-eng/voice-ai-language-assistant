from models.chat import ChatRequest
from models.validation import ValidationResponse
from .base_openai_service import BaseOpenAIService


class ConversationService(BaseOpenAIService):
    """Service for handling conversation management and validation."""
    
    async def start_conversation(self, level: str, topic: str, goal: str) -> str:
        """Start a conversation with an initial question."""
        response = self.client.chat.completions.create(
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
                    IMPORTANT: Ask your question in a way that encourages the user to respond with complete sentences, not just one word answers. Include phrases like "Bitte erkläre..." or "Erzähl mir..." to encourage detailed responses.
                    Example response:
                    "Was ist dein Lieblingsessen und warum magst du es? Bitte erkläre mir deine Antwort in ganzen Sätzen."
                    """  
                }
            ],
            model="gpt-4o",
            temperature=1.3,
        )
        return response.choices[0].message.content
    
    async def validate_response(self, chat_request: ChatRequest, user_message: str) -> ValidationResponse:
        """Validate a user's response."""
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
                "content": f"Student response: {user_message}\nPlease evaluate this response."
            }
        ]
        
        validation_response = self.client.beta.chat.completions.parse(
            messages=validation_messages,
            model="gpt-4o",
            response_format=ValidationResponse,
            temperature=1.3,
        )
        
        return validation_response.choices[0].message.parsed
    
    async def continue_conversation(self, chat_request: ChatRequest) -> str:
        """Continue the conversation based on chat history."""
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
                IMPORTANT: When asking follow-up questions, encourage the user to respond with complete sentences rather than one-word answers. Use phrases like "Kannst du mir mehr darüber erzählen?", "Bitte erkläre deine Antwort", or "Was denkst du darüber und warum?" to promote detailed responses.
                """
            }
        ]
        
        # Add conversation history
        for message in chat_request.history:
            messages.append({
                "role": message.role,
                "content": message.message
            })
        
        response = self.client.chat.completions.create(
            messages=messages,
            model="gpt-4o",
            temperature=1.3,
        )
        
        return response.choices[0].message.content
