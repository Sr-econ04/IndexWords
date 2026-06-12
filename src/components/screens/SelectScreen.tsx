"use client";

import type { FilterMode } from "@/types";
import { Button } from "@/components/ui/Button";

type SelectScreenProps = {
  totalCount: number;
  onStart: (filter: FilterMode) => void;
};

const OPTIONS: { label: string; filter: FilterMode; emoji: string }[] = [
  { label: "全単語", filter: "all", emoji: "📚" },
  { label: "名詞", filter: "noun", emoji: "🏷️" },
  { label: "動詞", filter: "verb", emoji: "⚡" },
  { label: "形容詞", filter: "adjective", emoji: "🎨" },
  { label: "副詞", filter: "adverb", emoji: "💨" },
];

export function SelectScreen({ totalCount, onStart }: SelectScreenProps) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* ヘッダー */}
      <div className="bg-primary-600 text-white px-5 pt-12 pb-8">
        <p className="text-primary-200 text-sm font-medium mb-1">兵庫県 英単語帳</p>
        <h1 className="text-4xl font-black tracking-tight mb-2">はば単</h1>
        <p className="text-primary-100 text-sm">
          全{totalCount.toLocaleString()}語収録
        </p>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 px-5 py-8 flex flex-col gap-6">
        <div>
          <p className="text-gray-500 text-sm mb-1">出題範囲を選ぼう</p>
          <h2 className="text-xl font-bold text-gray-800">品詞を選択</h2>
        </div>

        <div className="flex flex-col gap-3">
          {OPTIONS.map(({ label, filter, emoji }) => (
            <button
              key={filter}
              onClick={() => onStart(filter)}
              className="flex items-center gap-4 bg-card rounded-2xl px-5 py-4
                         border border-gray-100 shadow-sm
                         active:bg-primary-50 active:border-primary-200
                         transition-colors text-left"
            >
              <span className="text-2xl">{emoji}</span>
              <div>
                <p className="font-bold text-gray-800 text-lg">{label}</p>
                <p className="text-xs text-gray-400">
                  {filter === "all" ? "すべての品詞を出題" : `${label}だけを出題`}
                </p>
              </div>
              <span className="ml-auto text-primary-400 text-xl">›</span>
            </button>
          ))}
        </div>

        {/* ゲーム説明 */}
        <div className="bg-primary-50 rounded-2xl p-4 mt-2">
          <p className="text-primary-800 text-sm font-bold mb-2">🎮 あそびかた</p>
          <ul className="text-primary-700 text-xs space-y-1">
            <li>・ 正解の単語を探索して当てよう</li>
            <li>・ 回答するたびに範囲がせばまるよ</li>
            <li>・ バーで正解の位置がわかるよ</li>
            <li>・ 少ない手数ほど高スコア！</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
