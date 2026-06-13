import type { WordData } from "@/types";
import { sortWords } from "./gameLogic";

let cachedWords: WordData[] | null = null;

/**
 * 単語データを取得する。
 * 1. まずキャッシュを確認
 * 2. /api/load-words（兵庫県公式XLSをサーバー側で変換）から取得
 */
export async function loadWords(): Promise<WordData[]> {
  if (cachedWords && cachedWords.length > 0) return cachedWords;

  const res = await fetch("/api/load-words");
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: "不明なエラー" }));
    throw new Error(error ?? "単語データの取得に失敗しました");
  }

  const raw: WordData[] = await res.json();
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error("単語データが空です");
  }

  cachedWords = sortWords(raw);
  return cachedWords;
}

/** キャッシュをリセット（再取得用） */
export function clearWordCache() {
  cachedWords = null;
}
