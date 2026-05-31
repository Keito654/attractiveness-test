import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ResultHistoryList } from "@/components/ResultHistoryList";
import type { ResultHistoryEntry } from "@/lib/resultHistory";
import type { Scores } from "@/lib/scoring";

interface ResultScreenProps {
  scores: Scores;
  history: ResultHistoryEntry[];
  onReset: () => void;
}

interface ScoreItemProps {
  label: string;
  score: number;
}

function ScoreItem({ label, score }: ScoreItemProps) {
  const MAX_SCORE = 30;
  const percentage = (score / MAX_SCORE) * 100;
  const isLow = score <= 15;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <span className={`text-2xl font-bold ${isLow ? "text-red-500" : ""}`}>
          {score}
          <span className="text-sm font-normal text-muted-foreground"> / {MAX_SCORE}</span>
        </span>
      </div>
      <Progress value={percentage} />
    </div>
  );
}

export function ResultScreen({ scores, history, onReset }: ResultScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">テスト結果</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <ScoreItem label="嘘が多い" score={scores.lie} />
            <ScoreItem label="感情が幼い" score={scores.emotion} />
            <ScoreItem label="性格が悪い" score={scores.character} />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            各カテゴリは最大30点（6問 × 5点）です。
          </p>
          <ResultHistoryList history={history} />
          <Button variant="outline" className="w-full" onClick={onReset}>
            もう一度テストする
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
