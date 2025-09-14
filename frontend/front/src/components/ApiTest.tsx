import { useState } from 'react';
import { quizApi } from '@/api/quizApi';
import { Button } from '@/components/ui/button';

export default function ApiTest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setResult('Testing API...\n');
    
    try {
      // Test 1: Check if API is reachable
      setResult(prev => prev + 'Testing API connection...\n');
      const quizzes = await quizApi.getQuizzes();
      setResult(prev => prev + `✅ API connected! Found ${quizzes.length} quizzes\n`);
      
      if (quizzes.length > 0) {
        setResult(prev => prev + `First quiz: ${quizzes[0].title}\n`);
        
        // Test 2: Try to get a specific quiz
        setResult(prev => prev + `Testing quiz details for ID ${quizzes[0].id}...\n`);
        const quiz = await quizApi.getQuiz(quizzes[0].id);
        setResult(prev => prev + `✅ Quiz loaded! Title: ${quiz.title}\n`);
        setResult(prev => prev + `Questions: ${quiz.questions.length}\n`);
      }
      
    } catch (error) {
      setResult(prev => prev + `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>
      <Button onClick={testApi} disabled={loading} className="mb-4">
        {loading ? 'Testing...' : 'Test API Connection'}
      </Button>
      <pre className="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap text-sm">
        {result}
      </pre>
    </div>
  );
}
