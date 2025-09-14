# German Quiz Backend API

A FastAPI backend application for managing German language quizzes with PostgreSQL database.

## Features

- Parse quiz text and automatically populate database
- RESTful API endpoints for quiz management
- PostgreSQL database with Docker Compose setup
- Automatic database schema creation
- Support for multiple choice questions with explanations

## Setup

### Prerequisites

- Python 3.8+
- Docker and Docker Compose
- pip

### Installation

1. Clone the repository and navigate to the project directory:
```bash
cd /Users/bhrz/Documents/mistralai/mistralaiappbackend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp env.example .env
```

Edit the `.env` file with your database credentials:
```
DATABASE_URL=postgresql://quiz_user:quiz_password@localhost:5432/german_quiz_db
POSTGRES_USER=quiz_user
POSTGRES_PASSWORD=quiz_password
POSTGRES_DB=german_quiz_db
```

5. Start PostgreSQL with Docker Compose:
```bash
docker-compose up -d
```

6. Run the FastAPI application:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Parse and Create Quiz
- **POST** `/quizzes/parse`
- **Body**: `{"text": "quiz text content"}`
- **Description**: Parses quiz text and creates a new quiz in the database

### Get All Quizzes
- **GET** `/quizzes?skip=0&limit=100`
- **Description**: Retrieves all quizzes with pagination

### Get Quiz by ID
- **GET** `/quizzes/{quiz_id}`
- **Description**: Retrieves a specific quiz with all questions and options

### Get Quizzes by Topic
- **GET** `/quizzes/topic/{topic}`
- **Description**: Retrieves quizzes filtered by topic

### Delete Quiz
- **DELETE** `/quizzes/{quiz_id}`
- **Description**: Deletes a quiz by ID

## API Documentation

Once the server is running, you can access:
- Interactive API docs: `http://localhost:8000/docs`
- ReDoc documentation: `http://localhost:8000/redoc`

## Database Schema

The application uses three main tables:

- **quizzes**: Stores quiz metadata (title, topic, explanation, etc.)
- **questions**: Stores individual questions with prompts and correct answers
- **options**: Stores multiple choice options for each question

## Example Usage

### Parsing Quiz Text

Send a POST request to `/quizzes/parse` with the quiz text in the request body:

```python
import requests

quiz_text = """
German Quiz Generated on: 2025-09-13 14:22:54
Number of Questions: 20
Content Source: Perfekt – Perfect Tense in German Grammar
...
"""

response = requests.post(
    "http://localhost:8000/quizzes/parse",
    json={"text": quiz_text}
)
```

### Retrieving Quizzes

```python
# Get all quizzes
response = requests.get("http://localhost:8000/quizzes")

# Get a specific quiz
response = requests.get("http://localhost:8000/quizzes/1")

# Get quizzes by topic
response = requests.get("http://localhost:8000/quizzes/topic/Perfekt")
```

## Development

To run in development mode with auto-reload:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Deployment

For production deployment, make sure to:
1. Set secure database credentials in environment variables
2. Use a production-grade ASGI server like Gunicorn
3. Set up proper database backups
4. Configure reverse proxy (nginx) if needed
