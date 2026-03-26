import { describe, expect, it } from "vite-plus/test";
import { calculateScores } from "./scoring";

describe("calculateScores", () => {
  it("全問5点の場合、各カテゴリは30点", () => {
    const answers = Array(18).fill(5) as number[];
    const result = calculateScores(answers);
    expect(result.lie).toBe(30);
    expect(result.emotion).toBe(30);
    expect(result.character).toBe(30);
  });

  it("全問1点の場合、各カテゴリは6点", () => {
    const answers = Array(18).fill(1) as number[];
    const result = calculateScores(answers);
    expect(result.lie).toBe(6);
    expect(result.emotion).toBe(6);
    expect(result.character).toBe(6);
  });

  it("嘘が多い (Q1-6) のみ計算する", () => {
    const answers = [5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    const result = calculateScores(answers);
    expect(result.lie).toBe(30);
    expect(result.emotion).toBe(6);
    expect(result.character).toBe(6);
  });

  it("感情が幼い (Q7-12) のみ計算する", () => {
    const answers = [1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1];
    const result = calculateScores(answers);
    expect(result.lie).toBe(6);
    expect(result.emotion).toBe(30);
    expect(result.character).toBe(6);
  });

  it("性格が悪い (Q13-18) のみ計算する", () => {
    const answers = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5];
    const result = calculateScores(answers);
    expect(result.lie).toBe(6);
    expect(result.emotion).toBe(6);
    expect(result.character).toBe(30);
  });

  it("バラバラの点数でも正しく計算する", () => {
    const answers = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3];
    const result = calculateScores(answers);
    expect(result.lie).toBe(16); // 1+2+3+4+5+1
    expect(result.emotion).toBe(17); // 2+3+4+5+1+2
    expect(result.character).toBe(18); // 3+4+5+1+2+3
  });
});
