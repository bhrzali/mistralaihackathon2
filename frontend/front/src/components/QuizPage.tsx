import { useState, useEffect } from 'react';
import { QuizResponse, UiQuiz, UserAnswers, ResultSubmission } from '@/types/quiz';
import { fromApiQuiz } from '@/utils/quizTransformer';
import { quizApi } from '@/api/quizApi';
import { Button } from '@/components/ui/button';

interface QuizPageProps {
  quiz?: QuizResponse;
  quizId?: number;
  topic?: string;
}

interface QuizResult {
  score: number;
  maxScore: number;
  details: Array<{
    question_id: number;
    question_number: number;
    given: string;
    expected: string;
    correct: boolean;
  }>;
}

export default function QuizPage({ quiz: propQuiz, quizId, topic }: QuizPageProps) {
  const [quiz, setQuiz] = useState<UiQuiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  // Function to load quiz from static file
  const loadStaticQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      // Try different paths for the quiz.json file
      const possiblePaths = [
        './quiz.json',
        '/quiz.json',
        '/ishowspeed-template/quiz.json'
      ];
      
      let response: Response | null = null;
      let lastError: Error | null = null;
      
      for (const path of possiblePaths) {
        try {
          response = await fetch(path);
          if (response.ok) {
            break;
          }
        } catch (err) {
          lastError = err instanceof Error ? err : new Error('Unknown error');
        }
      }
      
      if (!response || !response.ok) {
        throw lastError || new Error('Could not load quiz from any path');
      }
      
      const quizData: QuizResponse = await response.json();
      setQuiz(fromApiQuiz(quizData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Function to load quiz from URL
  const loadQuizFromUrl = async (url: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Could not load quiz from URL');
      }
      const quizData: QuizResponse = await response.json();
      setQuiz(fromApiQuiz(quizData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Function to load quiz from API by ID
  const loadQuizFromApi = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const quizData = await quizApi.getQuiz(id);
      setQuiz(fromApiQuiz(quizData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading quiz from API');
    } finally {
      setLoading(false);
    }
  };

  // Function to load quiz by topic
  const loadQuizByTopic = async (topicName: string) => {
    try {
      setLoading(true);
      setError(null);
      const quizzes = await quizApi.getQuizzesByTopic(topicName);
      if (quizzes.length > 0) {
        // Take the first quiz from the topic
        const quizData = await quizApi.getQuiz(quizzes[0].id);
        setQuiz(fromApiQuiz(quizData));
      } else {
        setError(`No quizzes found for topic: ${topicName}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading quiz by topic');
    } finally {
      setLoading(false);
    }
  };

  // Effect to load initial data
  useEffect(() => {
    if (propQuiz) {
      // Prop/state mode - use provided data
      setQuiz(fromApiQuiz(propQuiz));
    } else if (quizId) {
      // Load quiz by ID from API
      loadQuizFromApi(quizId);
    } else if (topic) {
      // Load quiz by topic from API
      loadQuizByTopic(topic);
    } else {
      // Check URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const urlQuizId = urlParams.get('quizId');
      const urlTopic = urlParams.get('topic');
      const quizUrl = urlParams.get('quizUrl');
      
      if (urlQuizId) {
        loadQuizFromApi(parseInt(urlQuizId));
      } else if (urlTopic) {
        loadQuizByTopic(urlTopic);
      } else if (quizUrl) {
        loadQuizFromUrl(quizUrl);
      } else {
        // By default, try to load the static quiz
        loadStaticQuiz();
      }
    }
  }, [propQuiz, quizId, topic]);

  // Function to handle answer selection
  const handleAnswerChange = (questionNumber: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionNumber]: answer
    }));
  };

  // Function to calculate results
  const calculateResults = (): QuizResult => {
    if (!quiz) throw new Error('No quiz loaded');

    let score = 0;
    const details = quiz.questions.map(question => {
      const given = answers[question.number] || '';
      const expected = question.answer;
      const correct = given === expected;
      
      if (correct) score++;
      
      return {
        question_id: parseInt(question.id),
        question_number: question.number,
        given,
        expected,
        correct
      };
    });

    return {
      score,
      maxScore: quiz.total,
      details
    };
  };

  // Function to submit results
  const submitResults = async (resultData: QuizResult) => {
    if (!quiz) return;

    const submission: ResultSubmission = {
      quiz_id: parseInt(quiz.id),
      answers,
      score: resultData.score,
      max_score: resultData.maxScore,
      details: resultData.details,
      submitted_at: new Date().toISOString()
    };

    // Try to send to API if configured
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    if (apiBaseUrl) {
      try {
        await quizApi.submitQuizResults(submission);
        console.log('Results sent successfully to API');
      } catch (err) {
        console.error('Error sending results to API:', err);
        // Continue showing results locally even if sending fails
      }
    }

    // Show results on screen
    console.log('Quiz results:', submission);
  };

  // Function to handle submission
  const handleSubmit = () => {
    if (!quiz) return;

    const resultData = calculateResults();
    setResult(resultData);
    setSubmitted(true);
    submitResults(resultData);
  };

  // Function to retry
  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
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
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No quiz available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
          {quiz.topic && (
            <p className="text-lg text-blue-600 mb-2">Topic: {quiz.topic}</p>
          )}
          {quiz.generatedAt && (
            <p className="text-sm text-gray-500 mb-2">
              Generated: {new Date(quiz.generatedAt).toLocaleDateString('en-US')}
            </p>
          )}
          {quiz.description && (
            <p className="text-gray-700">{quiz.description}</p>
          )}
        </div>

        {!submitted ? (
          /* Questions */
          <div className="space-y-6">
            {quiz.questions.map((question) => (
              <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Question {question.number}: {question.prompt}
                </h3>
                
                {question.translation && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
                    <p className="text-blue-800 text-sm font-medium mb-1">English Translation:</p>
                    <p className="text-blue-700 italic">{question.translation}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {question.choices.map((choice) => (
                    <label
                      key={choice.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`question-${question.number}`}
                        value={choice.id}
                        checked={answers[question.number] === choice.id}
                        onChange={() => handleAnswerChange(question.number, choice.id)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="font-medium">{choice.id}.</span>
                      <span>{choice.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="text-center">
              <Button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== quiz.total}
                className="px-8 py-3 text-lg"
              >
                Submit Answers
              </Button>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-center mb-6">Quiz Results</h2>
            
            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {result?.score} / {result?.maxScore}
              </div>
              <p className="text-gray-600">
                {result && Math.round((result.score / result.maxScore) * 100)}% correct answers
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {result?.details.map((detail) => (
                <div
                  key={detail.question_number}
                  className={`p-4 rounded-lg border-l-4 ${
                    detail.correct
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">
                      Question {detail.question_number}
                    </span>
                    <span className={`text-sm font-medium ${
                      detail.correct ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {detail.correct ? '✅ Correct' : '❌ Incorrect'}
                    </span>
                  </div>
                  
                  {!detail.correct && (
                    <div className="text-sm text-gray-600">
                      <p>Your answer: <strong>{detail.given || 'Not answered'}</strong></p>
                      <p>Correct answer: <strong>{detail.expected}</strong></p>
                      {quiz.questions.find(q => q.number === detail.question_number)?.explanation && (
                        <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-3">
                          <p className="text-blue-800 text-sm font-medium mb-1">Explanation:</p>
                          <p className="text-blue-700 text-sm">
                            {quiz.questions.find(q => q.number === detail.question_number)?.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button onClick={handleRetry} variant="outline" className="px-6 py-2">
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
