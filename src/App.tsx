import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { StartScreen } from "@/components/StartScreen";
import { QuizScreen } from "@/components/QuizScreen";
import { ResultScreen } from "@/components/ResultScreen";
import { HistoryScreen } from "@/components/HistoryScreen";
import { calculateScores } from "@/lib/scoring";
import type { Scores } from "@/lib/scoring";
import {
  createResultHistoryEntry,
  loadResultHistory,
  saveResultHistory,
  type ResultHistoryEntry,
} from "@/lib/resultHistory";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [answers, setAnswers] = useState<number[]>(Array(18).fill(0));
  const [scores, setScores] = useState<Scores>({ lie: 0, emotion: 0, character: 0 });
  const [history, setHistory] = useState<ResultHistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadResultHistory());
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      setAnswers(Array(18).fill(0));
      setScores({ lie: 0, emotion: 0, character: 0 });
    }
  }, [location.pathname]);

  const handleStart = () => {
    void navigate("/quiz");
  };

  const handleShowHistory = () => {
    setHistory(loadResultHistory());
    void navigate("/history");
  };

  const handleSubmit = (finalAnswers: number[]) => {
    const nextScores = calculateScores(finalAnswers);
    const nextHistoryEntry = createResultHistoryEntry(finalAnswers, nextScores);

    setScores(nextScores);
    setHistory(saveResultHistory(nextHistoryEntry));
    void navigate("/result");
  };

  const handleReset = () => {
    void navigate("/");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<StartScreen onStart={handleStart} onShowHistory={handleShowHistory} />}
      />
      <Route
        path="/quiz"
        element={
          <QuizScreen answers={answers} onAnswersChange={setAnswers} onSubmit={handleSubmit} />
        }
      />
      <Route
        path="/result"
        element={<ResultScreen scores={scores} history={history} onReset={handleReset} />}
      />
      <Route
        path="/history"
        element={<HistoryScreen history={history} onBack={handleReset} onStart={handleStart} />}
      />
    </Routes>
  );
}

export default App;
