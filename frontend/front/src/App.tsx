import { Button } from "@/components/ui/button"
import { Link } from "react-router"

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">
          German Language Quiz
        </h1>
        <p className="text-lg text-gray-600 max-w-md">
          Practice your German language skills with interactive quizzes
        </p>
        <Link to="/quizzes">
          <Button size="lg" className="px-8 py-3 text-lg">
            View Available Quizzes
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default App
