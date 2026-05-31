import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { questions } from "@/data/questions";
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

const SCORE_LABELS: Array<{ key: keyof Scores; label: string }> = [
  { key: "lie", label: "嘘が多い" },
  { key: "emotion", label: "感情が幼い" },
  { key: "character", label: "性格が悪い" },
];

const ANSWER_LABELS: Record<number, string> = {
  1: "まったく当てはまらない",
  2: "当てはまらない",
  3: "どちらとも言えない",
  4: "当てはまる",
  5: "完全に当てはまる",
};

function formatCompletedAt(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function HistoryScores({ scores }: { scores: Scores }) {
  return (
    <div className="grid grid-cols-3 gap-2 text-center">
      {SCORE_LABELS.map(({ key, label }) => (
        <div key={key} className="rounded-md bg-muted px-2 py-2">
          <div className="text-[11px] text-muted-foreground">{label}</div>
          <div className="text-sm font-semibold">{scores[key]}</div>
        </div>
      ))}
    </div>
  );
}

function HistoryEntry({ entry }: { entry: ResultHistoryEntry }) {
  return (
    <details className="rounded-md border bg-background px-4 py-3">
      <summary className="cursor-pointer list-none space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">{formatCompletedAt(entry.completedAt)}</span>
          <span className="text-xs text-muted-foreground">回答を見る</span>
        </div>
        <HistoryScores scores={entry.scores} />
      </summary>
      <ol className="mt-4 space-y-3 border-t pt-4">
        {questions.map((question, index) => {
          const answer = entry.answers[index];
          return (
            <li key={question} className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">Q{index + 1}</div>
              <div className="text-sm">{question}</div>
              <div className="text-sm font-medium">
                {answer}: {ANSWER_LABELS[answer]}
              </div>
            </li>
          );
        })}
      </ol>
    </details>
  );
}

function ResultHistory({ history }: { history: ResultHistoryEntry[] }) {
  if (history.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-base font-semibold">保存された結果</h2>
        <p className="text-xs text-muted-foreground">直近3回分をこのブラウザに保存しています。</p>
      </div>
      <div className="space-y-3">
        {history.map((entry) => (
          <HistoryEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
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
          <ResultHistory history={history} />
          <Button variant="outline" className="w-full" onClick={onReset}>
            もう一度テストする
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
