"use client";

import type { FilterMode } from "@/types";

type SelectScreenProps = {
  totalCount: number;
  onStart: (filter: FilterMode) => void;
};

const OPTIONS: { label: string; filter: FilterMode; emoji: string; desc: string }[] = [
  { label: "全単語", filter: "all", emoji: "📚", desc: "すべての品詞を出題" },
  { label: "名詞", filter: "noun", emoji: "🏷️", desc: "名詞だけを出題" },
  { label: "動詞", filter: "verb", emoji: "⚡", desc: "動詞だけを出題" },
  { label: "形容詞", filter: "adjective", emoji: "🎨", desc: "形容詞だけを出題" },
  { label: "副詞", filter: "adverb", emoji: "💨", desc: "副詞だけを出題" },
];

export function SelectScreen({ totalCount, onStart }: SelectScreenProps) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* ヘッダー */}
      <div className="bg-primary-600 text-white px-5 pt-12 pb-8">
        <p className="text-primary-200 text-sm font-medium mb-1">兵庫県 英単語帳</p>
        <h1 className="font-black tracking-tight mb-1"><span className="text-4xl">はば単</span><span className="text-xl text-primary-300 ml-3 font-bold tracking-widest">Index Words</span></h1>
        <p className="text-primary-100 text-sm">
          全{totalCount.toLocaleString()}語収録
        </p>
      </div>

      {/* メインコンテンツ：PCでは中央寄せ */}
      <div className="flex-1 w-full max-w-lg mx-auto px-5 py-8 flex flex-col gap-6">
        <div>
          <p className="text-gray-500 text-sm mb-1">出題範囲を選ぼう</p>
          <h2 className="text-xl font-bold text-gray-800">品詞を選択</h2>
        </div>

        <div className="flex flex-col gap-3">
          {OPTIONS.map(({ label, filter, emoji, desc }) => (
            <button
              key={filter}
              onClick={() => onStart(filter)}
              className="flex items-center gap-4 bg-card rounded-2xl px-5 py-4
                         border border-gray-100 shadow-sm
                         hover:bg-primary-50 hover:border-primary-200
                         active:bg-primary-50 active:border-primary-200
                         transition-colors text-left cursor-pointer"
            >
              <span className="text-2xl">{emoji}</span>
              <div>
                <p className="font-bold text-gray-800 text-lg">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
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
            <li>・ 最初の回答でバーに位置が表示されるよ</li>
            <li>・ 少ない手数ほど高スコア！</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
