"use client";

import { useReducer, useCallback } from "react";
import type { GameState, GameAction, FilterMode, WordData } from "@/types";
import {
  getCandidates,
  updateRange,
  isCorrect,
  pickRandom,
  filterWords,
  sortWords,
} from "@/lib/gameLogic";

// ゲーム開始時の初期ゲーム状態を組み立てる
function buildPlayingState(
  filter: FilterMode,
  allWords: WordData[]
): Omit<GameState, "phase"> & { phase: "playing" } {
  const pool = sortWords(filterWords(allWords, filter));
  const answer = pickRandom(pool);
  return {
    phase: "playing",
    filter,
    pool,
    answer,
    rangeLowIndex: 0,
    rangeHighIndex: pool.length - 1,
    moves: 0,
    input: "",
  };
}

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      return {
        ...buildPlayingState(action.filter, action.pool),
      };
    }

    case "INPUT_CHAR": {
      if (state.phase !== "playing") return state;
      return { ...state, input: state.input + action.char };
    }

    case "DELETE_CHAR": {
      if (state.phase !== "playing") return state;
      return { ...state, input: state.input.slice(0, -1) };
    }

    case "SUBMIT": {
      if (state.phase !== "playing") return state;
      const { input, answer, pool, rangeLowIndex, rangeHighIndex, moves } =
        state;

      // 入力チェック: プール内に存在する単語のみ受け付ける
      const exists = pool.some(
        (w) => w.word.toLowerCase() === input.toLowerCase()
      );
      if (!exists) return state;

      // 正解判定
      if (isCorrect(input, answer.word)) {
        return { ...state, phase: "result", moves: moves + 1, input: "" };
      }

      // 不正解 → 範囲更新
      const { rangeLowIndex: newLow, rangeHighIndex: newHigh } = updateRange(
        pool,
        answer.word,
        input,
        rangeLowIndex,
        rangeHighIndex
      );

      return {
        ...state,
        rangeLowIndex: newLow,
        rangeHighIndex: newHigh,
        moves: moves + 1,
        input: "",
      };
    }

    case "RETRY": {
      if (state.phase !== "result") return state;
      // poolはすでにフィルタ・ソート済み → そのまま再利用
      const newAnswer = pickRandom(state.pool);
      return {
        phase: "playing",
        filter: state.filter,
        pool: state.pool,
        answer: newAnswer,
        rangeLowIndex: 0,
        rangeHighIndex: state.pool.length - 1,
        moves: 0,
        input: "",
      };
    }

    case "RESET": {
      // 完全リセット → select画面へ
      return {
        phase: "select",
        filter: "all",
        pool: [],
        answer: { word: "", meaning: "", partOfSpeech: "" },
        rangeLowIndex: 0,
        rangeHighIndex: 0,
        moves: 0,
        input: "",
      };
    }

    default:
      return state;
  }
}

const initialState: GameState = {
  phase: "select",
  filter: "all",
  pool: [],
  answer: { word: "", meaning: "", partOfSpeech: "" },
  rangeLowIndex: 0,
  rangeHighIndex: 0,
  moves: 0,
  input: "",
};

export function useGame(allWords: WordData[]) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startGame = useCallback(
    (filter: FilterMode) => {
      dispatch({ type: "START_GAME", filter, pool: allWords });
    },
    [allWords]
  );

  const inputChar = useCallback((char: string) => {
    dispatch({ type: "INPUT_CHAR", char });
  }, []);

  const deleteChar = useCallback(() => {
    dispatch({ type: "DELETE_CHAR" });
  }, []);

  const submit = useCallback(() => {
    dispatch({ type: "SUBMIT" });
  }, []);

  const retry = useCallback(() => {
    dispatch({ type: "RETRY" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  // 派生値
  const candidates =
    state.phase === "playing" || state.phase === "result"
      ? getCandidates(state.pool, state.rangeLowIndex, state.rangeHighIndex)
      : [];

  return {
    state,
    candidates,
    startGame,
    inputChar,
    deleteChar,
    submit,
    retry,
    reset,
  };
}
