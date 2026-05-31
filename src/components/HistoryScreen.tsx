import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultHistoryList } from "@/components/ResultHistoryList";
import type { ResultHistoryEntry } from "@/lib/resultHistory";

interface HistoryScreenProps {
  history: ResultHistoryEntry[];
  onBack: () => void;
  onStart: () => void;
}

export function HistoryScreen({ history, onBack, onStart }: HistoryScreenProps) {
  const hasHistory = history.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">過去の結果</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {hasHistory ? (
            <ResultHistoryList history={history} />
          ) : (
            <div className="rounded-md bg-muted p-4 text-center text-sm text-muted-foreground">
              まだ保存された結果はありません。
            </div>
          )}
          <div className="space-y-3">
            <Button className="w-full" onClick={onStart}>
              テストを開始する
            </Button>
            <Button variant="outline" className="w-full" onClick={onBack}>
              トップに戻る
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
