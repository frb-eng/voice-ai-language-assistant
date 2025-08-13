import json
from typing import List
import asyncio
from models.validation import ValidationCategory, CategoryValidation, ValidationResponse
from .base_openai_service import BaseOpenAIService


class ValidationService(BaseOpenAIService):
    def __init__(self):
        super().__init__()

    async def validate_category(self, message: str, category: ValidationCategory, context: dict) -> CategoryValidation:
        # Common instruction for categories that might have missing elements
        missing_elements_instruction = "IMPORTANT: If elements for evaluation are missing (e.g., no articles to evaluate), DO NOT include a score in your response and provide feedback about what's missing."
        
        # Prepare a specific prompt for each category
        prompts = {
            ValidationCategory.WORD_ORDER: "ONLY evaluate the German word order. Consider main and subordinate clauses, verb position. Do NOT evaluate vocabulary, articles, prepositions, verb conjugation or context.",
            ValidationCategory.VOCABULARY: "ONLY evaluate word choice and vocabulary usage. Are appropriate German words used? If the language is not German, return a score of 1. Do NOT evaluate word order, articles, prepositions, verb conjugation or context.",
            ValidationCategory.ARTICLES: f"ONLY evaluate article usage (der, die, das). Check gender and case. Do NOT evaluate word order, vocabulary, prepositions, verb conjugation or context. {missing_elements_instruction}",
            ValidationCategory.PREPOSITIONS: f"ONLY evaluate preposition usage. Are correct prepositions used with proper cases? Do NOT evaluate word order, vocabulary, articles, verb conjugation or context. {missing_elements_instruction}",
            ValidationCategory.VERB_CONJUGATION: f"ONLY evaluate verb conjugation. Check tense, person, and number. Do NOT evaluate word order, vocabulary, articles, prepositions or context. {missing_elements_instruction}",
            ValidationCategory.CONTEXT: "ONLY evaluate contextual appropriateness. Is the response relevant? Do NOT evaluate word order, vocabulary, articles, prepositions or verb conjugation.",
            ValidationCategory.LANGUAGE_LEVEL: f"ONLY for language level {context.get('language_level', 'A1')}, evaluate appropriateness. Is the language complexity appropriate for this level? Do NOT evaluate word order, vocabulary, articles, prepositions, verb conjugation or context separately.",
        }

        # Add conversation history context if available
        conversation_context = ""
        if "conversation_history" in context and context["conversation_history"]:
            history = context["conversation_history"]
            conversation_context = "Previous conversation:\n" + "\n".join(
                f"{'Bot' if msg.role == 'assistant' else 'User'}: {msg.message}"
                for msg in history
            ) + "\n\n"

        prompt = f"""
        {prompts[category]}
        
        {conversation_context}Message to evaluate:
        {message}
        """
        
        response = self.client.beta.chat.completions.parse(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a German language expert. Evaluate strictly and provide concise feedback. IMPORTANT: Score must be between 1-5 or null/None only. Return your evaluation as a valid JSON object."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format=CategoryValidation
        )

        # Parse the JSON response
        result = json.loads(response.choices[0].message.content)
        
        # Check if score is present in the response
        score = result.get("score") if "score" in result else None
        
        return CategoryValidation(
            category=category,
            score=score,
            feedback=result.get("feedback", "No feedback provided")
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

        # Separate context validation from other categories
        context_validation = next((v for v in validations if v.category == ValidationCategory.CONTEXT), None)
        other_validations = [v for v in validations if v.category != ValidationCategory.CONTEXT]
        
        # Calculate average scores separately, handling null scores
        context_score = context_validation.score if context_validation and context_validation.score is not None else 0
        
        # Only include validations with non-null scores in the average calculation
        valid_scores = [v.score for v in other_validations if v.score is not None]
        language_average_score = sum(valid_scores) / len(valid_scores) if valid_scores else 0
        
        # Consider both scores when determining if response is correct
        # If no valid scores are available, default to checking only context
        if valid_scores:
            is_correct = language_average_score > 3 and context_score >= 4
        else:
            is_correct = context_score >= 4

        # Generate overall feedback
        weak_categories = [v.category.value for v in validations if v.score is not None and v.score <= 2]
        if weak_categories:
            overall_feedback = f"Areas needing improvement: {', '.join(weak_categories)}"
        else:
            overall_feedback = "Good job! All aspects are well handled"

        return ValidationResponse(
            is_correct=is_correct,
            overall_feedback=overall_feedback,
            categories=validations
        )
