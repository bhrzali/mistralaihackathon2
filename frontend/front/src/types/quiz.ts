// Tipos para la respuesta de la API (coinciden exactamente con el backend alemán)
export type QuizResponse = {
  id: number;
  title: string;
  topic: string;
  explanation: string | null;
  number_of_questions: number;
  generated_at: string; // ISO format
  questions: QuestionResponse[];
};

export type QuestionResponse = {
  id: number;
  question_number: number;
  prompt: string;
  correct_answer: string;  // "A" | "B" | "C"...
  explanation: string;
  translation: string | null;
  ai_answer: string | null;
  ai_correction: string | null;
  additional_examples: string | null;
  options: OptionResponse[];
};

export type OptionResponse = {
  id: number;
  option_letter: string;
  option_text: string;
};

// Tipos para el parseo de quizzes
export type QuizTextInput = {
  text: string;
};

export type QuizListResponse = {
  id: number;
  title: string;
  topic: string;
  number_of_questions: number;
  generated_at: string;
};

// Tipos para la UI simplificada
export type UiQuiz = {
  id: string;
  title: string;
  description?: string | null;
  topic?: string | null;
  generatedAt?: string | null;
  total: number;
  questions: Array<{
    id: string;
    number: number;
    prompt: string;
    translation?: string | null;
    choices: Array<{ id: string; label: string }>; // id = option_letter, label = option_text
    answer: string;        // correct_answer (letter)
    explanation?: string;  // explanation
  }>;
};

// Tipos para el envío de resultados
export type ResultSubmission = {
  quiz_id: number;
  answers: { [question_number: number]: string };
  score: number;
  max_score: number;
  details: Array<{
    question_id: number;
    question_number: number;
    given: string;
    expected: string;
    correct: boolean;
  }>;
  submitted_at: string; // ISO
};

// Tipo para las respuestas del usuario
export type UserAnswers = { [question_number: number]: string };
