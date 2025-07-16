from typing import List
import asyncio
from models.validation import ValidationCategory, CategoryValidation, ValidationResponse
from .base_openai_service import BaseOpenAIService


class ValidationService(BaseOpenAIService):
    def __init__(self):
        super().__init__()
        self.category_icons = {
            ValidationCategory.WORD_ORDER: "fa-arrows-alt-h",
            ValidationCategory.VOCABULARY: "fa-book",
            ValidationCategory.ARTICLES: "fa-font",
            ValidationCategory.PREPOSITIONS: "fa-map-signs",
            ValidationCategory.VERB_CONJUGATION: "fa-sync",
            ValidationCategory.CONTEXT: "fa-comments",
            ValidationCategory.LANGUAGE_LEVEL: "fa-layer-group",
        }

    async def validate_category(self, message: str, category: ValidationCategory, context: dict) -> CategoryValidation:
        # Prepare a specific prompt for each category
        prompts = {
            ValidationCategory.WORD_ORDER: "Evaluate the German word order. Consider main and subordinate clauses, verb position. Rate from 0-5 and provide brief feedback.",
            ValidationCategory.VOCABULARY: "Evaluate word choice and vocabulary usage. Are appropriate German words used? Rate from 0-5 and provide brief feedback.",
            ValidationCategory.ARTICLES: "Evaluate article usage (der, die, das). Check gender and case. Rate from 0-5 and provide brief feedback.",
            ValidationCategory.PREPOSITIONS: "Evaluate preposition usage. Are correct prepositions used with proper cases? Rate from 0-5 and provide brief feedback.",
            ValidationCategory.VERB_CONJUGATION: "Evaluate verb conjugation. Check tense, person, and number. Rate from 0-5 and provide brief feedback.",
            ValidationCategory.CONTEXT: "Evaluate contextual appropriateness. Is the response relevant? Rate from 0-5 and provide brief feedback.",
            ValidationCategory.LANGUAGE_LEVEL: f"For language level {context.get('language_level', 'A1')}, evaluate appropriateness. Rate from 0-5 and provide brief feedback.",
        }

        # Add conversation history context if available
        conversation_context = ""
        if "conversation_history" in context and context["conversation_history"]:
            history = context["conversation_history"]
            conversation_context = "Previous conversation:\n" + "\n".join(
                f"{'Bot' if msg.role == 'assistant' else 'User'}: {msg.message}"
                for msg in history
            ) + "\n\n"

        prompt = f"{prompts[category]}\n\n{conversation_context}Message to evaluate:\n{message}\n\nProvide response in format: 'Score: X\nFeedback: brief feedback'"
        
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a German language expert. Evaluate strictly and provide concise feedback."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=100
        )

        # Parse the response
        content = response.choices[0].message.content
        score_line = content.split('\n')[0]
        feedback_line = content.split('\n')[1] if len(content.split('\n')) > 1 else "No feedback provided"
        
        score = int(score_line.split(':')[1].strip()) if 'Score:' in score_line else 0
        feedback = feedback_line.split(':')[1].strip() if 'Feedback:' in feedback_line else feedback_line

        return CategoryValidation(
            category=category,
            score=score,
            feedback=feedback,
            icon=self.category_icons[category]
        )

    async def validate_message(self, message: str, context: dict) -> ValidationResponse:
        # Create category-specific contexts
        validation_tasks = []
        
        for category in ValidationCategory:
            # Define which context elements each category needs
            category_context = {}
            
            # Basic language level info is needed for LANGUAGE_LEVEL and some others
            if category in [ValidationCategory.LANGUAGE_LEVEL, ValidationCategory.VOCABULARY, 
                           ValidationCategory.VERB_CONJUGATION]:
                if "language_level" in context:
                    category_context["language_level"] = context.get("language_level")
            
            # Conversation history is only needed for CONTEXT validation
            if category == ValidationCategory.CONTEXT:
                if "conversation_history" in context:
                    category_context["conversation_history"] = context.get("conversation_history")
            
            # Add task with tailored context
            validation_tasks.append(self.validate_category(message, category, category_context))
        
        # Run all validations in parallel
        validations = await asyncio.gather(*validation_tasks)

        # Calculate if the response is correct (average score > 3)
        average_score = sum(v.score for v in validations) / len(validations)
        is_correct = average_score > 3

        # Generate overall feedback
        weak_categories = [v.category.value for v in validations if v.score <= 2]
        if weak_categories:
            overall_feedback = f"Areas needing improvement: {', '.join(weak_categories)}"
        else:
            overall_feedback = "Good job! All aspects are well handled"

        return ValidationResponse(
            is_correct=is_correct,
            overall_feedback=overall_feedback,
            categories=validations
        )
