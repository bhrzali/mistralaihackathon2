from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uvicorn
import os

from . import crud, models, schemas, parser
from .database import SessionLocal, engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
frontend_url = "https://alexprena.github.io/myQuizApp/quiz?quizId="

app = FastAPI(
    title="German Quiz API",
    description="API for managing German language quizzes",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
async def root():
    return {"message": "German Quiz API is running!"}

@app.post("/quizzes/parse")
async def parse_and_create_quiz(
    quiz_input: schemas.QuizTextInput,
    db: Session = Depends(get_db)
):
    """
    Parse quiz text and create a new quiz in the database
    Returns the quiz ID for the created quiz
    """
    try:
        # Parse the text
        quiz_parser = parser.QuizTextParser()
        parsed_quiz = quiz_parser.parse_quiz_text(quiz_input.text)
        
        # Create the quiz in the database
        db_quiz = crud.create_quiz(db=db, quiz=parsed_quiz)
        
        return {"quiz_id": db_quiz.id, "message": "Quiz created successfully", "frontend_url": f"{frontend_url}{db_quiz.id}"}
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error parsing quiz text: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@app.get("/quizzes", response_model=List[schemas.QuizListResponse])
async def get_quizzes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all quizzes with pagination
    """
    quizzes = crud.get_quizzes(db=db, skip=skip, limit=limit)
    return quizzes

@app.get("/quizzes/{quiz_id}", response_model=schemas.QuizResponse)
async def get_quiz(
    quiz_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific quiz by ID with all questions and options
    """
    quiz = crud.get_quiz(db=db, quiz_id=quiz_id)
    if quiz is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    return quiz

@app.get("/quizzes/topic/{topic}", response_model=List[schemas.QuizListResponse])
async def get_quizzes_by_topic(
    topic: str,
    db: Session = Depends(get_db)
):
    """
    Get quizzes by topic
    """
    quizzes = crud.get_quiz_by_topic(db=db, topic=topic)
    return quizzes

@app.delete("/quizzes/{quiz_id}")
async def delete_quiz(
    quiz_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a quiz by ID
    """
    success = crud.delete_quiz(db=db, quiz_id=quiz_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz not found"
        )
    return {"message": "Quiz deleted successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
