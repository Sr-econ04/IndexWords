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

/**
 * 初期境界は番兵インデックス:
 *   rangeLowIndex  = -1          （pool[0]より前）
 *   rangeHighIndex = pool.length  （pool[last]より後）
 * これにより pool[0] や pool[last] が正解でも境界と重ならない。
 */
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
    rangeLowIndex: -1,
    rangeHighIndex: pool.length,
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

      const inputLower = input.toLowerCase();
      const answerLower = answer.word.toLowerCase();

      // 使用済み単語は受け付けない
      if (usedWords.has(inputLower)) return state;

      // 現在の境界単語（番兵でない場合）は正解以外入力不可
      const lowWord = rangeLowIndex >= 0 ? pool[rangeLowIndex]?.word.toLowerCase() : null;
      const highWord = rangeHighIndex < pool.length ? pool[rangeHighIndex]?.word.toLowerCase() : null;
      if (inputLower !== answerLower) {
        if (inputLower === lowWord || inputLower === highWord) return state;
      }

      const newUsed = new Set([...usedWords, inputLower]);

      // 正解判定
      if (isCorrect(input, answer.word)) {
        return { ...state, phase: "result", moves: moves + 1, input: "", usedWords: newUsed };
      }

      // 不正解 → 範囲更新
      const { rangeLowIndex: newLow, rangeHighIndex: newHigh } = updateRange(
        pool, answer.word, input, rangeLowIndex, rangeHighIndex
      );

      // 新しい境界単語もusedWordsに追加（正解でなければ）
      const newLowWord = newLow >= 0 ? pool[newLow]?.word.toLowerCase() : null;
      const newHighWord = newHigh < pool.length ? pool[newHigh]?.word.toLowerCase() : null;
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
        rangeLowIndex: -1,
        rangeHighIndex: state.pool.length,
        moves: 0,
        input: "",
        usedWords: new Set<string>(),
      };
    }

    case "GIVE_UP": {
      if (state.phase !== "playing") return state;
      return { ...state, phase: "giveup" };
    }

    case "RESET": {
      return {
        phase: "select",
        filter: "all",
        pool: [],
        answer: { word: "", meaning: "", partOfSpeech: "" },
        rangeLowIndex: -1,
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
  rangeLowIndex: -1,
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

  const giveUp = useCallback(() => {
    dispatch({ type: "GIVE_UP" });
  }, []);

  // 候補：境界exclusive（番兵インデックス対応）・usedWords除外（正解は残す）
  const rawCandidates =
    state.phase === "playing" || state.phase === "result" || state.phase === "giveup"
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
    giveUp,
  };
}
