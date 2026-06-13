"use client";

import type { GameState } from "@/types";
import { calcTheoretical, calcRank, posLabel, filterLabel } from "@/lib/gameLogic";
import { Button } from "@/components/ui/Button";

type ResultScreenProps = {
  state: GameState & { phase: "result" };
  onRetry: () => void;
  onReset: () => void;
};

const RANK_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; message: string }
> = {
  SS: { label: "SS", color: "text-purple-600", bg: "bg-purple-50 border-purple-200", message: "✨ 一発正解！伝説のプレイヤー！" },
  S: { label: "S", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", message: "完璧！理論を超えた神プレイ！" },
  A: { label: "A", color: "text-primary-600", bg: "bg-primary-50 border-primary-200", message: "すばらしい！ほぼ完璧な絞り込み！" },
  B: { label: "B", color: "text-green-600", bg: "bg-green-50 border-green-200", message: "いい感じ！もう少しで理論値だ！" },
  C: { label: "C", color: "text-orange-500", bg: "bg-orange-50 border-orange-200", message: "惜しい！範囲の絞り方を工夫しよう" },
  D: { label: "D", color: "text-red-500", bg: "bg-red-50 border-red-200", message: "次はもっと上を目指そう！" },
};

export function ResultScreen({ state, onRetry, onReset }: ResultScreenProps) {
  const { answer, moves } = state;
  const theoretical = calcTheoretical(state.pool.length);
  // 1手で正解した場合のみSSランク（隠し要素）
  const rank = moves === 1 ? "SS" : calcRank(moves, theoretical);
  const config = RANK_CONFIG[rank];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* ヘッダー */}
      <div className="bg-primary-600 text-white px-5 pt-12 pb-6 text-center relative">
        {/* トップに戻るボタン */}
        <button
          onClick={onReset}
          className="absolute left-4 top-4 text-primary-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-primary-500"
          title="トップに戻る"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <p className="text-primary-200 text-sm mb-1">正解！</p>
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
            <span className="ml-3 mt-0.5 bg-primary-100 text-primary-700 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
              {posLabel(answer.partOfSpeech)}
            </span>
          </div>
        </div>

        {/* スコアカード */}
        <div className={`rounded-2xl p-5 border ${config.bg}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-500 text-xs mb-0.5">ランク</p>
              <p className={`text-5xl font-black ${config.color}`}>{config.label}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs mb-1">手数</p>
              <p className="text-3xl font-black text-gray-800">
                {moves}
                <span className="text-base font-normal text-gray-400 ml-1">手</span>
              </p>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>理論値（最小 {theoretical} 手）</span>
              <span>{moves} 手</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  rank === "S" || rank === "A" ? "bg-primary-500"
                  : rank === "B" ? "bg-green-500"
                  : rank === "C" ? "bg-orange-400"
                  : "bg-red-400"
                }`}
                style={{
                  width: `${Math.min(100, (theoretical / Math.max(moves, theoretical)) * 100)}%`,
                }}
              />
            </div>
          </div>
          <p className={`text-sm font-medium ${config.color}`}>{config.message}</p>
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
    </div>
  );
}
