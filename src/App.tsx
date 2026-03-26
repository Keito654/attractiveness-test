import { useState } from "react";
import { StartScreen } from "@/components/StartScreen";
import { QuizScreen } from "@/components/QuizScreen";
import { ResultScreen } from "@/components/ResultScreen";
import { calculateScores } from "@/lib/scoring";
import type { Scores } from "@/lib/scoring";

type Screen = "start" | "quiz" | "result";

function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [answers, setAnswers] = useState<number[]>(Array(18).fill(0));
  const [scores, setScores] = useState<Scores>({ lie: 0, emotion: 0, character: 0 });

  const handleStart = () => {
    setScreen("quiz");
  };

  const handleSubmit = (finalAnswers: number[]) => {
    setScores(calculateScores(finalAnswers));
    setScreen("result");
  };

  const handleReset = () => {
    setAnswers(Array(18).fill(0));
    setScores({ lie: 0, emotion: 0, character: 0 });
    setScreen("start");
  };

  if (screen === "start") {
    return <StartScreen onStart={handleStart} />;
  }

  if (screen === "quiz") {
    return <QuizScreen answers={answers} onAnswersChange={setAnswers} onSubmit={handleSubmit} />;
  }

  return <ResultScreen scores={scores} onReset={handleReset} />;
}

export default App;
