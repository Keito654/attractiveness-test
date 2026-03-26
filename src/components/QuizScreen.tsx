import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { questions } from "@/data/questions";

interface QuizScreenProps {
  answers: number[];
  onAnswersChange: (answers: number[]) => void;
  onSubmit: (answers: number[]) => void;
}

const SCALE_LABELS: Record<number, string> = {
  1: "まったく当てはまらない",
  2: "当てはまらない",
  3: "どちらとも言えない",
  4: "当てはまる",
  5: "完全に当てはまる",
};

export function QuizScreen({ answers, onAnswersChange, onSubmit }: QuizScreenProps) {
  const answeredCount = answers.filter((a) => a > 0).length;
  const allAnswered = answeredCount === questions.length;
  const progress = (answeredCount / questions.length) * 100;

  const handleChange = (index: number, value: number) => {
    const next = [...answers];
    next[index] = value;
    onAnswersChange(next);
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>進捗</span>
            <span>
              {answeredCount} / {questions.length}
            </span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <p className="text-sm font-medium mb-4">
                  <span className="text-muted-foreground mr-2">Q{index + 1}.</span>
                  {question}
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label key={value} className="flex flex-col items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={value}
                        checked={answers[index] === value}
                        onChange={() => {
                          handleChange(index, value);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary border-border hover:border-primary cursor-pointer">
                        {value}
                      </div>
                      <Label className="text-xs text-center text-muted-foreground hidden sm:block leading-tight">
                        {SCALE_LABELS[value]}
                      </Label>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button className="w-full" size="lg" disabled={!allAnswered} onClick={handleSubmit}>
          {allAnswered ? "結果を見る" : `あと${questions.length - answeredCount}問回答してください`}
        </Button>
      </div>
    </div>
  );
}
