"use client";

import type { WordData } from "@/types";
import { calcAnswerPosition } from "@/lib/gameLogic";

type RangeBarProps = {
  candidates: WordData[];
  answer: WordData;
  lowWord: string | null;
  highWord: string | null;
  showDot: boolean; // 初回回答後にtrueになる
};

export function RangeBar({ candidates, answer, lowWord, highWord, showDot }: RangeBarProps) {
  const position = calcAnswerPosition(candidates, answer.word);
  const posPercent = Math.round(position * 100);

  return (
    <div className="w-full px-2">
      {/* 境界ラベル */}
      <div className="flex justify-between mb-1 h-5">
        <span className="text-xs font-mono font-bold text-primary-700 truncate max-w-[40%]">
          {lowWord ?? ""}
        </span>
        <span className="text-xs font-mono font-bold text-primary-700 truncate max-w-[40%] text-right">
          {highWord ?? ""}
        </span>
      </div>

      {/* バー本体 */}
      <div className="relative h-6 flex items-center">
        {/* トラック */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-2 bg-primary-100 rounded-full" />
        </div>
        {/* 左端マーカー */}
        <div className="absolute left-0 w-0.5 h-4 bg-primary-400 rounded-full" />
        {/* 右端マーカー */}
        <div className="absolute right-0 w-0.5 h-4 bg-primary-400 rounded-full" />
        {/* 正解位置ドット（初回回答後のみ表示） */}
        {showDot ? (
          <div
            className="absolute w-5 h-5 rounded-full bg-accent shadow-md border-2 border-white transition-all duration-500"
            style={{ left: `calc(${posPercent}% - 10px)` }}
          />
        ) : (
          /* 未回答時はクエスチョンマーク */
          <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center">
            <span className="text-gray-400 text-xs font-bold">?</span>
          </div>
        )}
      </div>

      {/* 未回答ヒント */}
      {!showDot && (
        <p className="text-center text-xs text-gray-400 mt-1">
          最初の回答で位置が表示されます
        </p>
      )}
    </div>
  );
}
