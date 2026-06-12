"use client";

import { useEffect, useState } from "react";
import type { WordData } from "@/types";
import { loadWords } from "@/lib/wordLoader";
import { useGame } from "@/hooks/useGame";
import { SelectScreen } from "@/components/screens/SelectScreen";
import { GameScreen } from "@/components/screens/GameScreen";
import { ResultScreen } from "@/components/screens/ResultScreen";

export default function Home() {
  const [allWords, setAllWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWords()
      .then(setAllWords)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const { state, candidates, startGame, inputChar, deleteChar, submit, retry, reset } =
    useGame(allWords);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">単語データを読み込み中…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="text-gray-700 font-bold mb-1">読み込みエラー</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (state.phase === "select") {
    return (
      <SelectScreen
        totalCount={allWords.length}
        onStart={startGame}
      />
    );
  }

  if (state.phase === "playing") {
    return (
      <GameScreen
        state={{ ...state, phase: "playing" as const }}
        candidates={candidates}
        onKey={inputChar}
        onDelete={deleteChar}
        onEnter={submit}
        onReset={reset}
      />
    );
  }

  if (state.phase === "result") {
    return (
      <ResultScreen
        state={{ ...state, phase: "result" as const }}
        onRetry={retry}
        onReset={reset}
      />
    );
  }

  return null;
}
