import { describe, expect, it } from "vite-plus/test";
import type { Scores } from "./scoring";
import {
  createResultHistoryEntry,
  HISTORY_LIMIT,
  loadResultHistory,
  saveResultHistory,
  type ResultHistoryEntry,
} from "./resultHistory";

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

class ThrowingStorage extends MemoryStorage {
  override getItem(_key: string): string | null {
    throw new Error("storage unavailable");
  }

  override setItem(_key: string, _value: string): void {
    throw new Error("storage unavailable");
  }
}

function makeScores(overrides: Partial<Scores> = {}): Scores {
  return {
    lie: 6,
    emotion: 12,
    character: 18,
    ...overrides,
  };
}

function makeEntry(id: string, completedAt = `2026-05-31T00:00:0${id}.000Z`): ResultHistoryEntry {
  return {
    id,
    completedAt,
    scores: makeScores({ lie: Number(id) }),
    answers: Array(18).fill(Number(id)) as number[],
  };
}

describe("result history", () => {
  it("creates a history entry with copied answers and a generated id", () => {
    const answers = Array(18).fill(3) as number[];
    const scores = makeScores();
    const entry = createResultHistoryEntry(answers, scores, {
      completedAt: new Date("2026-05-31T12:00:00.000Z"),
      id: "fixed-id",
    });

    answers[0] = 1;

    expect(entry).toEqual({
      id: "fixed-id",
      completedAt: "2026-05-31T12:00:00.000Z",
      scores,
      answers: Array(18).fill(3),
    });
  });

  it("saves the newest result first", () => {
    const storage = new MemoryStorage();

    const firstHistory = saveResultHistory(makeEntry("1"), storage);
    const secondHistory = saveResultHistory(makeEntry("2"), storage);

    expect(firstHistory.map((entry) => entry.id)).toEqual(["1"]);
    expect(secondHistory.map((entry) => entry.id)).toEqual(["2", "1"]);
    expect(loadResultHistory(storage).map((entry) => entry.id)).toEqual(["2", "1"]);
  });

  it("keeps only the latest three results", () => {
    const storage = new MemoryStorage();

    for (const id of ["1", "2", "3", "4"]) {
      saveResultHistory(makeEntry(id), storage);
    }

    expect(loadResultHistory(storage).map((entry) => entry.id)).toEqual(["4", "3", "2"]);
    expect(loadResultHistory(storage)).toHaveLength(HISTORY_LIMIT);
  });

  it("returns an empty history for invalid stored data", () => {
    const storage = new MemoryStorage();
    storage.setItem("attractiveness-test:result-history:v1", "{not valid json");

    expect(loadResultHistory(storage)).toEqual([]);
  });

  it("does not throw when storage is unavailable", () => {
    const storage = new ThrowingStorage();

    expect(loadResultHistory(storage)).toEqual([]);
    expect(saveResultHistory(makeEntry("1"), storage)).toEqual([]);
  });
});
