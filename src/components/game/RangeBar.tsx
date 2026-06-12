"use client";

import type { WordData } from "@/types";
import { calcAnswerPosition } from "@/lib/gameLogic";

type RangeBarProps = {
  candidates: WordData[];
  answer: WordData;
  lowWord: string | null;
  highWord: string | null;
};

export function RangeBar({ candidates, answer, lowWord, highWord }: RangeBarProps) {
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
        {/* 正解位置ドット */}
        <div
          className="absolute w-5 h-5 rounded-full bg-accent shadow-md border-2 border-white transition-all duration-300"
          style={{ left: `calc(${posPercent}% - 10px)` }}
        />
      </div>

      {/* 候補数表示エリア（バーの下） */}
    </div>
  );
}
