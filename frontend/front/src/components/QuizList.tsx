import { useState, useEffect } from 'react';
import { QuizListResponse } from '@/types/quiz';
import { quizApi } from '@/api/quizApi';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<QuizListResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading quizzes...');
      const quizList = await quizApi.getQuizzes();
      console.log('Loaded quizzes:', quizList);
      setQuizzes(quizList);
    } catch (err) {
      console.error('Error loading quizzes:', err);
      setError(err instanceof Error ? err.message : 'Error loading quizzes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadQuizzes}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Available Quizzes
          </h1>
          <p className="text-gray-600">
            Select a quiz to begin
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {quiz.title}
              </h3>
              <p className="text-blue-600 font-medium mb-2">
                Topic: {quiz.topic}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                {quiz.number_of_questions} questions
              </p>
              <p className="text-gray-500 text-xs mb-4">
                Created: {new Date(quiz.generated_at).toLocaleDateString('en-US')}
              </p>
              <Link to={`/quiz?quizId=${quiz.id}`}>
                <Button className="w-full">
                  Start Quiz
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {quizzes.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No quizzes available from API
            </p>
            <p className="text-gray-500 text-sm mt-2">
              The API might be empty or not responding
            </p>
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/api-test">
            <Button variant="outline">
              Test API Connection
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
