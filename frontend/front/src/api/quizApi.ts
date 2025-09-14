import { QuizResponse, QuizListResponse, QuizTextInput } from '@/types/quiz';

// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? '/api' : 'https://mistralaibackend-a0bzf8faakamd4gb.germanywestcentral-01.azurewebsites.net');

class QuizApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Obtener todos los quizzes con paginación
   */
  async getQuizzes(skip: number = 0, limit: number = 100): Promise<QuizListResponse[]> {
    const url = `${this.baseUrl}/quizzes?skip=${skip}&limit=${limit}`;
    console.log('Fetching quizzes from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error getting quizzes: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Quizzes data:', data);
    return data;
  }

  /**
   * Obtener un quiz específico por ID
   */
  async getQuiz(quizId: number): Promise<QuizResponse> {
    const response = await fetch(`${this.baseUrl}/quizzes/${quizId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error getting quiz ${quizId}: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Obtener quizzes por tema
   */
  async getQuizzesByTopic(topic: string): Promise<QuizListResponse[]> {
    const response = await fetch(`${this.baseUrl}/quizzes/topic/${encodeURIComponent(topic)}`);
    if (!response.ok) {
      throw new Error(`Error al obtener quizzes del tema ${topic}: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Parsear texto y crear un nuevo quiz
   */
  async parseAndCreateQuiz(text: string): Promise<{ quiz_id: number }> {
    const response = await fetch(`${this.baseUrl}/quizzes/parse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text } as QuizTextInput),
    });

    if (!response.ok) {
      throw new Error(`Error al parsear quiz: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Eliminar un quiz por ID
   */
  async deleteQuiz(quizId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/quizzes/${quizId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar quiz ${quizId}: ${response.statusText}`);
    }
  }

  /**
   * Enviar resultados del quiz
   */
  async submitQuizResults(results: any): Promise<void> {
    const resultsPath = import.meta.env.VITE_RESULTS_PATH || '/results';
    const response = await fetch(`${this.baseUrl}${resultsPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(results),
    });

    if (!response.ok) {
      throw new Error(`Error al enviar resultados: ${response.statusText}`);
    }
  }
}

// Instancia singleton del cliente API
export const quizApi = new QuizApiClient();

// Funciones de conveniencia
export const getQuizById = (id: number) => quizApi.getQuiz(id);
export const getAllQuizzes = (skip?: number, limit?: number) => quizApi.getQuizzes(skip, limit);
export const getQuizzesByTopic = (topic: string) => quizApi.getQuizzesByTopic(topic);
export const createQuizFromText = (text: string) => quizApi.parseAndCreateQuiz(text);
export const deleteQuizById = (id: number) => quizApi.deleteQuiz(id);
export const submitResults = (results: any) => quizApi.submitQuizResults(results);
