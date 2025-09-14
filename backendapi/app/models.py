from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Quiz(Base):
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    topic = Column(String(255), nullable=False)
    explanation = Column(Text, nullable=True)
    number_of_questions = Column(Integer, nullable=False)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    question_number = Column(Integer, nullable=False)
    prompt = Column(Text, nullable=False)
    correct_answer = Column(String(1), nullable=False)  # A, B, C, or D
    explanation = Column(Text, nullable=False)
    translation = Column(Text, nullable=True)
    ai_answer = Column(String(255), nullable=True)
    ai_correction = Column(Text, nullable=True)
    additional_examples = Column(Text, nullable=True)
    
    quiz = relationship("Quiz", back_populates="questions")
    options = relationship("Option", back_populates="question", cascade="all, delete-orphan")

class Option(Base):
    __tablename__ = "options"
    
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    option_letter = Column(String(1), nullable=False)  # A, B, C, or D
    option_text = Column(Text, nullable=False)
    
    question = relationship("Question", back_populates="options")
