from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OptionCreate(BaseModel):
    option_letter: str
    option_text: str

class OptionResponse(BaseModel):
    id: int
    option_letter: str
    option_text: str
    
    class Config:
        from_attributes = True

class QuestionCreate(BaseModel):
    question_number: int
    prompt: str
    correct_answer: str
    explanation: str
    translation: Optional[str] = None
    ai_answer: Optional[str] = None
    ai_correction: Optional[str] = None
    additional_examples: Optional[str] = None
    options: List[OptionCreate]

class QuestionResponse(BaseModel):
    id: int
    question_number: int
    prompt: str
    correct_answer: str
    explanation: str
    translation: Optional[str] = None
    ai_answer: Optional[str] = None
    ai_correction: Optional[str] = None
    additional_examples: Optional[str] = None
    options: List[OptionResponse]
    
    class Config:
        from_attributes = True

class QuizCreate(BaseModel):
    title: str
    topic: str
    explanation: Optional[str] = None
    number_of_questions: int
    questions: List[QuestionCreate]

class QuizResponse(BaseModel):
    id: int
    title: str
    topic: str
    explanation: Optional[str] = None
    number_of_questions: int
    generated_at: datetime
    questions: List[QuestionResponse]
    
    class Config:
        from_attributes = True

class QuizListResponse(BaseModel):
    id: int
    title: str
    topic: str
    number_of_questions: int
    generated_at: datetime
    
    class Config:
        from_attributes = True

class QuizTextInput(BaseModel):
    text: str
