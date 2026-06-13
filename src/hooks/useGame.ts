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
    usedWords: new Set<string>(),
  };
}

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      return buildPlayingState(action.filter, action.pool);
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
      const { input, answer, pool, rangeLowIndex, rangeHighIndex, moves, usedWords } = state;

      const exists = pool.some(
        (w) => w.word.toLowerCase() === input.toLowerCase()
      );
      if (!exists) return state;

      // 過去に使った単語・現在の上限下限単語は受け付けない
      const isInitial = rangeLowIndex === 0 && rangeHighIndex === pool.length - 1;
      const lowWord = pool[rangeLowIndex]?.word.toLowerCase();
      const highWord = pool[rangeHighIndex]?.word.toLowerCase();
      const inputLower = input.toLowerCase();
      const answerLower = answer.word.toLowerCase();

      if (usedWords.has(inputLower)) return state;
      // 境界単語は正解でない限り入力不可（初期状態を除く）
      if (!isInitial && inputLower !== answerLower) {
        if (inputLower === lowWord || inputLower === highWord) return state;
      }

      const newUsed = new Set([...usedWords, inputLower]);

      // 正解判定
      if (isCorrect(input, answer.word)) {
        return { ...state, phase: "result", moves: moves + 1, input: "", usedWords: newUsed };
      }

      // 不正解 → 範囲更新、新たな境界単語も自動的にusedWordsへ追加
      const { rangeLowIndex: newLow, rangeHighIndex: newHigh } = updateRange(
        pool, answer.word, input, rangeLowIndex, rangeHighIndex
      );

      // 新しい境界もusedWordsに追加しておく（正解でなければ）
      const newLowWord = pool[newLow]?.word.toLowerCase();
      const newHighWord = pool[newHigh]?.word.toLowerCase();
      if (newLowWord && newLowWord !== answerLower) newUsed.add(newLowWord);
      if (newHighWord && newHighWord !== answerLower) newUsed.add(newHighWord);

      return {
        ...state,
        rangeLowIndex: newLow,
        rangeHighIndex: newHigh,
        moves: moves + 1,
        input: "",
        usedWords: newUsed,
      };
    }

    case "RETRY": {
      if (state.phase !== "result") return state;
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
        usedWords: new Set<string>(),
      };
    }

    case "RESET": {
      return {
        phase: "select",
        filter: "all",
        pool: [],
        answer: { word: "", meaning: "", partOfSpeech: "" },
        rangeLowIndex: 0,
        rangeHighIndex: 0,
        moves: 0,
        input: "",
        usedWords: new Set<string>(),
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
  usedWords: new Set<string>(),
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

  // candidatesは境界exclusive・usedWords除外（正解は残す）
  const rawCandidates =
    state.phase === "playing" || state.phase === "result"
      ? getCandidates(
          state.pool,
          state.rangeLowIndex,
          state.rangeHighIndex,
          state.answer.word
        )
      : [];

  const candidates =
    state.phase === "playing"
      ? rawCandidates.filter(
          (w) =>
            !state.usedWords.has(w.word.toLowerCase()) ||
            w.word.toLowerCase() === state.answer.word.toLowerCase()
        )
      : rawCandidates;

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
