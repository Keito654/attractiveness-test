import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">魅力度テスト</CardTitle>
          <CardDescription className="text-base mt-2">
            「最強のコミュ力のつくりかた」より
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            18個の質問に答えてください。それぞれの質問に対して、あなた自身にどの程度当てはまるかを1〜5の数字で選んでください。
          </p>
          <div className="bg-muted rounded-md p-4 space-y-1">
            <p>
              <span className="font-medium text-foreground">1</span> — まったく当てはまらない
            </p>
            <p>
              <span className="font-medium text-foreground">2</span> — 当てはまらない
            </p>
            <p>
              <span className="font-medium text-foreground">3</span> — どちらとも言えない
            </p>
            <p>
              <span className="font-medium text-foreground">4</span> — 当てはまる
            </p>
            <p>
              <span className="font-medium text-foreground">5</span> — 完全に当てはまる
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" onClick={onStart}>
            テストを開始する
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
