import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";
import { StartScreen } from "./StartScreen";

describe("StartScreen", () => {
  it("過去の結果を振り返るボタンを表示する", () => {
    const html = renderToStaticMarkup(
      <StartScreen onStart={() => undefined} onShowHistory={() => undefined} />,
    );

    expect(html).toContain("過去の結果を振り返る");
  });
});
