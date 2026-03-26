import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { StartScreen } from "@/components/StartScreen";
import { QuizScreen } from "@/components/QuizScreen";
import { ResultScreen } from "@/components/ResultScreen";
import { calculateScores } from "@/lib/scoring";
import type { Scores } from "@/lib/scoring";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [answers, setAnswers] = useState<number[]>(Array(18).fill(0));
  const [scores, setScores] = useState<Scores>({ lie: 0, emotion: 0, character: 0 });

  useEffect(() => {
    if (location.pathname === "/") {
      setAnswers(Array(18).fill(0));
      setScores({ lie: 0, emotion: 0, character: 0 });
    }
  }, [location.pathname]);

  const handleStart = () => {
    void navigate("/quiz");
  };

  const handleSubmit = (finalAnswers: number[]) => {
    setScores(calculateScores(finalAnswers));
    void navigate("/result");
  };

  const handleReset = () => {
    void navigate("/");
  };

  return (
    <Routes>
      <Route path="/" element={<StartScreen onStart={handleStart} />} />
      <Route
        path="/quiz"
        element={
          <QuizScreen answers={answers} onAnswersChange={setAnswers} onSubmit={handleSubmit} />
        }
      />
      <Route path="/result" element={<ResultScreen scores={scores} onReset={handleReset} />} />
    </Routes>
  );
}

export default App;
