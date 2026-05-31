import { questions } from "@/data/questions";
import type { ResultHistoryEntry } from "@/lib/resultHistory";
import type { Scores } from "@/lib/scoring";

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

export function ResultHistoryList({ history }: { history: ResultHistoryEntry[] }) {
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
