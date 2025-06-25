import os
from openai import OpenAI
from langsmith.wrappers import wrap_openai


class BaseOpenAIService:
    """Base service that provides the OpenAI client to other services."""
    
    def __init__(self):
        self.client = wrap_openai(OpenAI(
            api_key=os.environ.get("OPENAI_API_KEY"),
        ))
    
    def get_client(self) -> OpenAI:
        """Get the OpenAI client instance."""
        return self.client
