import type { WordData, ScoreRank, FilterMode } from "@/types";

/** 辞書順ソート（toLowerCase比較） */
export function sortWords(words: WordData[]): WordData[] {
  return [...words].sort((a, b) =>
    a.word.toLowerCase().localeCompare(b.word.toLowerCase())
  );
}

/** フィルタモードに応じて単語プールを絞り込む */
export function filterWords(words: WordData[], filter: FilterMode): WordData[] {
  if (filter === "all") return words;
  return words.filter((w) => w.partOfSpeech === filter);
}

/**
 * 探索範囲内の候補インデックス範囲を返す
 * @returns { lowIndex, highIndex } pool基準のinclusive範囲
 */
export function getCandidates(
  pool: WordData[],
  lowIndex: number,
  highIndex: number
): WordData[] {
  return pool.slice(lowIndex, highIndex + 1);
}

/**
 * 回答後の範囲更新
 * answer > guess → 下限を更新（guessのpool内インデックスをlowに）
 * answer < guess → 上限を更新（guessのpool内インデックスをhighに）
 * @returns 新しい { rangeLowIndex, rangeHighIndex }
 */
export function updateRange(
  pool: WordData[],
  answerWord: string,
  guessWord: string,
  currentLow: number,
  currentHigh: number
): { rangeLowIndex: number; rangeHighIndex: number } {
  const guessIndex = pool.findIndex(
    (w) => w.word.toLowerCase() === guessWord.toLowerCase()
  );
  if (guessIndex === -1) {
    // 見つからない場合は変更なし（通常ここには来ない）
    return { rangeLowIndex: currentLow, rangeHighIndex: currentHigh };
  }

  const answerLower = answerWord.toLowerCase();
  const guessLower = guessWord.toLowerCase();

  if (answerLower > guessLower) {
    // 正解はguessより後ろ → 下限をguessに更新
    return {
      rangeLowIndex: Math.max(guessIndex, currentLow),
      rangeHighIndex: currentHigh,
    };
  } else {
    // 正解はguessより前 → 上限をguessに更新
    return {
      rangeLowIndex: currentLow,
      rangeHighIndex: Math.min(guessIndex, currentHigh),
    };
  }
}

/** 正解判定 */
export function isCorrect(input: string, answerWord: string): boolean {
  return input.toLowerCase() === answerWord.toLowerCase();
}

/** 理論値計算: ceil(log2(候補数)) */
export function calcTheoretical(candidateCount: number): number {
  if (candidateCount <= 1) return 1;
  return Math.ceil(Math.log2(candidateCount));
}

/** ランク判定 */
export function calcRank(moves: number, theoretical: number): ScoreRank {
  const diff = moves - theoretical;
  if (diff <= -2) return "S";
  if (diff <= 1) return "A";
  if (diff <= 3) return "B";
  if (diff <= 5) return "C";
  return "D";
}

/**
 * 正解位置をバー用に 0.0〜1.0 で返す
 * candidates内の順位（0始まり）/ (candidates.length - 1)
 */
export function calcAnswerPosition(
  candidates: WordData[],
  answerWord: string
): number {
  if (candidates.length <= 1) return 0.5;
  const idx = candidates.findIndex(
    (w) => w.word.toLowerCase() === answerWord.toLowerCase()
  );
  if (idx === -1) return 0.5;
  return idx / (candidates.length - 1);
}

/** プールからランダムに1語選ぶ */
export function pickRandom(pool: WordData[]): WordData {
  return pool[Math.floor(Math.random() * pool.length)];
}

/** PartOfSpeechの日本語表示 */
export function posLabel(pos: string): string {
  const map: Record<string, string> = {
    noun: "名詞",
    verb: "動詞",
    adjective: "形容詞",
    adverb: "副詞",
  };
  return map[pos] ?? "その他";
}

/** FilterModeの日本語表示 */
export function filterLabel(filter: FilterMode): string {
  const map: Record<FilterMode, string> = {
    all: "全単語",
    noun: "名詞",
    verb: "動詞",
    adjective: "形容詞",
    adverb: "副詞",
  };
  return map[filter];
}
