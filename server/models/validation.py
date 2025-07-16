from pydantic import BaseModel
from enum import Enum
from typing import List


class ValidationCategory(Enum):
    WORD_ORDER = "word_order"
    VOCABULARY = "vocabulary"
    ARTICLES = "articles"
    PREPOSITIONS = "prepositions"
    VERB_CONJUGATION = "verb_conjugation"
    CONTEXT = "context"
    LANGUAGE_LEVEL = "language_level"


class CategoryValidation(BaseModel):
    category: ValidationCategory
    score: int  # 0-5 score
    feedback: str
    icon: str  # FontAwesome icon name


class ValidationResponse(BaseModel):
    is_correct: bool
    overall_feedback: str
    categories: List[CategoryValidation]
