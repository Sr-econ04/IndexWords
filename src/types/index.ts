export type PartOfSpeech = "noun" | "verb" | "adjective" | "adverb";

export type WordData = {
  word: string;
  meaning: string;
  partOfSpeech: PartOfSpeech | string;
};

export type FilterMode = PartOfSpeech | "all";

export type GamePhase = "select" | "playing" | "result";

export type GameState = {
  phase: GamePhase;
  filter: FilterMode;
  /** フィルタ後・辞書順ソート済みの出題候補プール */
  pool: WordData[];
  /** 正解単語 */
  answer: WordData;
  /** 探索範囲の下限インデックス（pool基準、inclusive） */
  rangeLowIndex: number;
  /** 探索範囲の上限インデックス（pool基準、inclusive） */
  rangeHighIndex: number;
  /** 有効回答の手数 */
  moves: number;
  /** 現在の入力文字列 */
  input: string;
};

export type ScoreRank = "S" | "A" | "B" | "C" | "D";

export type GameResult = {
  answer: WordData;
  moves: number;
  theoretical: number;
  rank: ScoreRank;
};

// キーボードキーの状態
export type KeyState = "active" | "disabled";

export type GameAction =
  | { type: "START_GAME"; filter: FilterMode; pool: WordData[] }
  | { type: "INPUT_CHAR"; char: string }
  | { type: "DELETE_CHAR" }
  | { type: "SUBMIT" }
  | { type: "RETRY" }
  | { type: "RESET" };
