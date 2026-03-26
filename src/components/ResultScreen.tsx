import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Scores } from "@/lib/scoring";

interface ResultScreenProps {
  scores: Scores;
  onReset: () => void;
}

interface ScoreItemProps {
  label: string;
  score: number;
}

function ScoreItem({ label, score }: ScoreItemProps) {
  const MAX_SCORE = 30;
  const percentage = (score / MAX_SCORE) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-2xl font-bold">
          {score}
          <span className="text-sm font-normal text-muted-foreground"> / {MAX_SCORE}</span>
        </span>
      </div>
      <Progress value={percentage} />
    </div>
  );
}

export function ResultScreen({ scores, onReset }: ResultScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
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
          <Button variant="outline" className="w-full" onClick={onReset}>
            もう一度テストする
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
