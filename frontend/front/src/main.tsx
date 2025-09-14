import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App.tsx'
import XTailwindLayout from './pages/TailwindXLayout.tsx';
import Layout from './pages/tailwind/layout.tsx';
import QuizPage from './components/QuizPage.tsx';
import QuizList from './components/QuizList.tsx';
import ApiTest from './components/ApiTest.tsx';

createRoot(document.getElementById('root')!).render(
  // TODO: change this 
  <BrowserRouter basename="/myQuizApp">
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/quizzes" element={<QuizList />} />
      <Route path="/api-test" element={<ApiTest />} />
      <Route path="tailwindx" element={<XTailwindLayout />}>
        <Route path="layout" element={<Layout />} />
      </Route>
    </Routes>

  </BrowserRouter>,
)
