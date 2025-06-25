from models.learning import Topics, LearningGoals
from .base_openai_service import BaseOpenAIService


class LearningService(BaseOpenAIService):
    """Service for handling learning content generation."""
    
    async def get_topics(self, level: str) -> Topics:
        """Generate topics for a given language level."""
        prompt = f"Generate 5 topics for a {level} german language learner."
        response = self.client.beta.chat.completions.parse(
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
            temperature=1.3,
            response_format=Topics
        )
        return response.choices[0].message.parsed
    
    async def get_learning_goals(self, level: str, topic: str) -> LearningGoals:
        """Generate learning goals for a given level and topic."""
        response = self.client.beta.chat.completions.parse(
            messages=[
                {
                    "role": "system",
                    "content": """
                    You are a German teacher and helpful assistant.
                    You will receive a language level and topic.
                    Please reply with 5 specific learning goals in English for the provided level and topic for a German language learner.
                    These should be concrete, actionable objectives that the student can work towards during their conversation practice.
                    Example response for A1 level and "Food" topic:
                    [
                        "Learn basic food vocabulary (10-15 words)",
                        "Practice expressing food preferences",
                        "Learn to order food in a restaurant",
                        "Describe what you ate yesterday",
                        "Practice asking about ingredients"
                    ]
                    """  
                },
                {
                    "role": "user",
                    "content": f"Generate learning goals for {level} level German learner studying {topic}"
                }
            ],
            model="gpt-4o",
            temperature=0.8,
            response_format=LearningGoals
        )
        return response.choices[0].message.parsed
