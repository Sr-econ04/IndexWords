"use client";

import type { FilterMode } from "@/types";

type SelectScreenProps = {
  totalCount: number;
  loading: boolean;
  error: string | null;
  onStart: (filter: FilterMode) => void;
  onLoad: () => void;
};

const OPTIONS: { label: string; filter: FilterMode; emoji: string; desc: string }[] = [
  { label: "全単語", filter: "all", emoji: "📚", desc: "すべての品詞を出題" },
  { label: "名詞", filter: "noun", emoji: "🏷️", desc: "名詞だけを出題" },
  { label: "動詞", filter: "verb", emoji: "⚡", desc: "動詞だけを出題" },
  { label: "形容詞", filter: "adjective", emoji: "🎨", desc: "形容詞だけを出題" },
  { label: "副詞", filter: "adverb", emoji: "💨", desc: "副詞だけを出題" },
];

export function SelectScreen({ totalCount, loading, error, onStart, onLoad }: SelectScreenProps) {
  const isReady = totalCount > 0;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* ヘッダー */}
      <div className="bg-primary-600 text-white px-5 pt-12 pb-8">
        <p className="text-primary-200 text-sm font-medium mb-1">探索型英単語ゲーム</p>
        <h1 className="text-4xl font-black tracking-tight mb-2">Index Words</h1>
        {isReady ? (
          <p className="text-primary-100 text-sm">全{totalCount.toLocaleString()}語収録</p>
        ) : (
          <p className="text-primary-300 text-sm">単語データを読み込んでください</p>
        )}
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 w-full max-w-lg mx-auto px-5 py-8 flex flex-col gap-6">

        {/* 単語データ読み込みボタン（未ロード時） */}
        {!isReady && (
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-3xl mb-3">📥</p>
            <p className="text-gray-700 font-bold text-lg mb-1">単語データの読み込み</p>
            <p className="text-gray-400 text-xs mb-4 leading-relaxed">
              兵庫県教育委員会の公式サイトから<br />はば単データを取得します
            </p>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 text-left">
                <p className="text-red-500 text-xs font-medium">⚠️ エラー</p>
                <p className="text-red-400 text-xs mt-0.5">{error}</p>
              </div>
            )}

            <button
              onClick={onLoad}
              disabled={loading}
              className={[
                "w-full rounded-xl py-4 text-base font-bold transition-colors",
                loading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-primary-500 text-white shadow-md hover:bg-primary-600 active:bg-primary-700",
              ].join(" ")}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                  読み込み中…（30秒ほどかかります）
                </span>
              ) : (
                "単語データを読み込む"
              )}
            </button>
          </div>
        )}

        {/* 品詞選択（ロード済みの場合） */}
        {isReady && (
          <>
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
          </>
        )}

        {/* ゲーム説明 */}
        <div className="bg-primary-50 rounded-2xl p-4 space-y-3">
          <p className="text-primary-800 text-sm font-bold">🎮 あそびかた</p>

          <div className="text-primary-700 text-xs space-y-2">
            <p className="font-semibold">① 正解の単語をキーボードで入力しよう</p>
            <p className="text-primary-600 leading-relaxed">
              英単語を入力してENTERを押すと、正解より前か後かがわかります。
              この情報をもとに探索範囲をせばめていきます。
            </p>
          </div>

          <div className="text-primary-700 text-xs space-y-2">
            <p className="font-semibold">② バーで正解の位置を確認しよう</p>
            <p className="text-primary-600 leading-relaxed">
              最初の回答をすると、バーにオレンジの●が表示されます。
              ●の位置が正解単語のだいたいの場所を表しています。
            </p>
            <div className="bg-white rounded-lg px-3 py-2 font-mono text-primary-400">
              <div className="flex justify-between text-xs mb-1">
                <span>angry</span><span>teacher</span>
              </div>
              <div className="relative h-3 bg-primary-100 rounded-full">
                <div className="absolute w-3 h-3 rounded-full bg-accent border border-white" style={{left: "60%"}} />
              </div>
              <p className="text-center text-xs mt-1 text-primary-300">← 正解はこのあたり</p>
            </div>
          </div>

          <div className="text-primary-700 text-xs space-y-2">
            <p className="font-semibold">③ キーボードのヒントを活用しよう</p>
            <p className="text-primary-600 leading-relaxed">
              グレーのキーは現在の候補に存在しない文字です。
              白いキーだけを使って単語を絞り込みましょう。
            </p>
          </div>

          <div className="text-primary-700 text-xs space-y-1">
            <p className="font-semibold">④ スコアについて</p>
            <p className="text-primary-600 leading-relaxed">
              理論上の最小手数（例：2,000語なら11手）と比べてランクが決まります。
              少ない手数ほど高ランク！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
