"use client";

import { useState, useCallback } from "react";
import type { WordData } from "@/types";
import { loadWords } from "@/lib/wordLoader";
import { useGame } from "@/hooks/useGame";
import { SelectScreen } from "@/components/screens/SelectScreen";
import { GameScreen } from "@/components/screens/GameScreen";
import { ResultScreen } from "@/components/screens/ResultScreen";

export default function Home() {
  const [allWords, setAllWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoad = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const words = await loadWords();
      setAllWords(words);
    } catch (e) {
      setError(e instanceof Error ? e.message : "読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  const { state, candidates, startGame, inputChar, deleteChar, submit, retry, reset } =
    useGame(allWords);

  if (state.phase === "select") {
    return (
      <SelectScreen
        totalCount={allWords.length}
        loading={loading}
        error={error}
        onStart={startGame}
        onLoad={handleLoad}
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
