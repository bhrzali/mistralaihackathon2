import { QuizResponse, UiQuiz } from '@/types/quiz';

/**
 * Transforma los datos de la API a un formato simplificado para la UI
 */
export function fromApiQuiz(api: QuizResponse): UiQuiz {
  return {
    id: String(api.id),
    title: api.title,
    description: api.explanation,
    topic: api.topic,
    generatedAt: api.generated_at,
    total: api.number_of_questions,
    questions: api.questions.map(q => ({
      id: String(q.id),
      number: q.question_number,
      prompt: q.prompt,
      translation: q.translation,
      choices: q.options.map(o => ({
        id: o.option_letter,
        label: o.option_text
      })),
      answer: q.correct_answer,
      explanation: q.explanation
    }))
  };
}
