"use client";

import type { GameState } from "@/types";
import { posLabel, filterLabel } from "@/lib/gameLogic";
import { Button } from "@/components/ui/Button";
import { Footer } from "@/components/ui/Footer";

type GiveUpScreenProps = {
  state: GameState & { phase: "giveup" };
  onRetry: () => void;
  onReset: () => void;
};

export function GiveUpScreen({ state, onRetry, onReset }: GiveUpScreenProps) {
  const { answer, moves } = state;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* ヘッダー */}
      <div className="bg-gray-600 text-white px-5 pt-12 pb-6 text-center relative">
        <button
          onClick={onReset}
          className="absolute left-4 top-4 text-gray-300 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-500"
          title="トップに戻る"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <p className="text-gray-300 text-sm mb-1">降参…</p>
        <h2 className="text-4xl font-black font-mono tracking-wide">
          {answer.word}
        </h2>
      </div>

      <div className="flex-1 w-full max-w-lg mx-auto px-5 py-6 flex flex-col gap-4">

        {/* 単語情報カード */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-gray-400 text-xs mb-1">意味</p>
              <p className="text-gray-800 text-xl font-bold">{answer.meaning}</p>
            </div>
            <span className="ml-3 mt-0.5 bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
              {posLabel(answer.partOfSpeech)}
            </span>
          </div>
        </div>

        {/* 手数カード */}
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
          <p className="text-gray-400 text-xs mb-1">挑戦した手数</p>
          <p className="text-3xl font-black text-gray-600">
            {moves}
            <span className="text-base font-normal text-gray-400 ml-1">手</span>
          </p>
          <p className="text-sm text-gray-400 mt-2">次回はきっと当てられる！</p>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col gap-3 mt-2">
          <Button variant="primary" fullWidth onClick={onRetry}>
            もう1問（{filterLabel(state.filter)}）
          </Button>
          <Button variant="secondary" fullWidth onClick={onReset}>
            トップに戻る
          </Button>
        </div>

      </div>

      <Footer />
    </div>
  );
}
