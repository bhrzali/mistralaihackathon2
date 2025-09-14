from sqlalchemy.orm import Session
from . import models, schemas
from typing import List, Optional

def create_quiz(db: Session, quiz: schemas.QuizCreate) -> models.Quiz:
    """Create a new quiz with all its questions and options"""
    
    # Create the quiz
    db_quiz = models.Quiz(
        title=quiz.title,
        topic=quiz.topic,
        explanation=quiz.explanation,
        number_of_questions=quiz.number_of_questions
    )
    db.add(db_quiz)
    db.flush()  # Get the quiz ID
    
    # Create questions and options
    for question_data in quiz.questions:
        db_question = models.Question(
            quiz_id=db_quiz.id,
            question_number=question_data.question_number,
            prompt=question_data.prompt,
            correct_answer=question_data.correct_answer,
            explanation=question_data.explanation,
            translation=question_data.translation,
            ai_answer=question_data.ai_answer,
            ai_correction=question_data.ai_correction,
            additional_examples=question_data.additional_examples
        )
        db.add(db_question)
        db.flush()  # Get the question ID
        
        # Create options for this question
        for option_data in question_data.options:
            db_option = models.Option(
                question_id=db_question.id,
                option_letter=option_data.option_letter,
                option_text=option_data.option_text
            )
            db.add(db_option)
    
    db.commit()
    db.refresh(db_quiz)
    return db_quiz

def get_quiz(db: Session, quiz_id: int) -> Optional[models.Quiz]:
    """Get a quiz by ID with all questions and options"""
    return db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()

def get_quizzes(db: Session, skip: int = 0, limit: int = 100) -> List[models.Quiz]:
    """Get all quizzes with pagination"""
    return db.query(models.Quiz).offset(skip).limit(limit).all()

def get_quiz_by_topic(db: Session, topic: str) -> List[models.Quiz]:
    """Get quizzes by topic"""
    return db.query(models.Quiz).filter(models.Quiz.topic.ilike(f"%{topic}%")).all()

def delete_quiz(db: Session, quiz_id: int) -> bool:
    """Delete a quiz by ID"""
    quiz = db.query(models.Quiz).filter(models.Quiz.id == quiz_id).first()
    if quiz:
        db.delete(quiz)
        db.commit()
        return True
    return False
