import type { Scores } from "./scoring";

export const HISTORY_LIMIT = 3;
const STORAGE_KEY = "attractiveness-test:result-history:v1";
const QUESTION_COUNT = 18;

export interface ResultHistoryEntry {
  id: string;
  completedAt: string;
  scores: Scores;
  answers: number[];
}

interface CreateResultHistoryEntryOptions {
  completedAt?: Date;
  id?: string;
}

function getDefaultStorage(): Storage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isScores(value: unknown): value is Scores {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const scores = value as Record<string, unknown>;
  return (
    isFiniteNumber(scores.lie) && isFiniteNumber(scores.emotion) && isFiniteNumber(scores.character)
  );
}

function isAnswers(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.length === QUESTION_COUNT &&
    value.every((answer) => Number.isInteger(answer) && answer >= 1 && answer <= 5)
  );
}

function isHistoryEntry(value: unknown): value is ResultHistoryEntry {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === "string" &&
    entry.id.length > 0 &&
    typeof entry.completedAt === "string" &&
    !Number.isNaN(Date.parse(entry.completedAt)) &&
    isScores(entry.scores) &&
    isAnswers(entry.answers)
  );
}

function normalizeHistory(value: unknown): ResultHistoryEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const entries = value.filter(isHistoryEntry);
  if (entries.length !== value.length) {
    return [];
  }

  return entries.slice(0, HISTORY_LIMIT);
}

function createHistoryId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createResultHistoryEntry(
  answers: number[],
  scores: Scores,
  options: CreateResultHistoryEntryOptions = {},
): ResultHistoryEntry {
  return {
    id: options.id ?? createHistoryId(),
    completedAt: (options.completedAt ?? new Date()).toISOString(),
    scores,
    answers: [...answers],
  };
}

export function loadResultHistory(storage: Storage | undefined = getDefaultStorage()) {
  if (!storage) {
    return [];
  }

  try {
    const rawHistory = storage.getItem(STORAGE_KEY);
    if (!rawHistory) {
      return [];
    }

    return normalizeHistory(JSON.parse(rawHistory));
  } catch {
    return [];
  }
}

export function saveResultHistory(
  entry: ResultHistoryEntry,
  storage: Storage | undefined = getDefaultStorage(),
) {
  if (!storage) {
    return [];
  }

  const nextHistory = [entry, ...loadResultHistory(storage)].slice(0, HISTORY_LIMIT);

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));
    return nextHistory;
  } catch {
    return [];
  }
}
