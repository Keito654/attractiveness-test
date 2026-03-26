export interface Scores {
  lie: number;
  emotion: number;
  character: number;
}

export function calculateScores(answers: number[]): Scores {
  const lie = answers.slice(0, 6).reduce((acc, val) => acc + val, 0);
  const emotion = answers.slice(6, 12).reduce((acc, val) => acc + val, 0);
  const character = answers.slice(12, 18).reduce((acc, val) => acc + val, 0);
  return { lie, emotion, character };
}
