import type { WordData } from "@/types";
import { sortWords } from "./gameLogic";

let cachedWords: WordData[] | null = null;

export async function loadWords(): Promise<WordData[]> {
  if (cachedWords) return cachedWords;

  const res = await fetch("/words.json");
  if (!res.ok) throw new Error("単語データの読み込みに失敗しました");

  const raw: WordData[] = await res.json();
  cachedWords = sortWords(raw);
  return cachedWords;
}
