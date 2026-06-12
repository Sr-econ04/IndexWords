"use client";

import type { GameState, WordData } from "@/types";
import { RangeBar } from "@/components/game/RangeBar";
import { CandidateCount } from "@/components/game/CandidateCount";
import { Keyboard } from "@/components/game/Keyboard";
import { getKeyStates } from "@/lib/keyboardHints";
import { filterLabel } from "@/lib/gameLogic";

type GameScreenProps = {
  state: GameState & { phase: "playing" };
  candidates: WordData[];
  onKey: (char: string) => void;
  onDelete: () => void;
  onEnter: () => void;
};

export function GameScreen({
  state,
  candidates,
  onKey,
  onDelete,
  onEnter,
}: GameScreenProps) {
  const { pool, answer, input, moves, filter, rangeLowIndex, rangeHighIndex } =
    state;

  const keyStates = getKeyStates(candidates, input);

  // ENTER有効判定: プール内に存在する単語のみ
  const canEnter =
    input.length > 0 &&
    pool.some((w) => w.word.toLowerCase() === input.toLowerCase());

  // 範囲の境界単語
  const lowWord = pool[rangeLowIndex]?.word ?? null;
  const highWord = pool[rangeHighIndex]?.word ?? null;
  const isInitialRange =
    rangeLowIndex === 0 && rangeHighIndex === pool.length - 1;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* ステータスバー */}
      <div className="bg-primary-600 text-white px-5 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-primary-500 rounded-full px-2 py-0.5">
            {filterLabel(filter)}
          </span>
        </div>
        <span className="text-xs text-primary-200">{moves}手目</span>
      </div>

      {/* メインエリア */}
      <div className="flex-1 flex flex-col px-4 py-4 gap-4 overflow-hidden">
        {/* 候補数 + ヒントバー */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-400 font-medium">残り候補数</p>
            <CandidateCount current={candidates.length} total={pool.length} />
          </div>
          <RangeBar
            candidates={candidates}
            answer={answer}
            lowWord={isInitialRange ? null : lowWord}
            highWord={isInitialRange ? null : highWord}
          />
        </div>

        {/* 入力表示エリア */}
        <div className="bg-card rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 mb-2">入力中の単語</p>
          <div className="flex items-end gap-1 min-h-[2.5rem]">
            {input.length === 0 ? (
              <span className="text-gray-300 text-2xl font-mono tracking-widest">
                ＿
              </span>
            ) : (
              <>
                <span className="text-2xl font-mono font-bold text-gray-800 tracking-wider">
                  {input}
                </span>
                {/* カーソル */}
                <span className="w-0.5 h-7 bg-primary-500 rounded animate-pulse mb-0.5" />
              </>
            )}
          </div>
          {/* アンダーライン */}
          <div className="mt-1 h-0.5 bg-primary-200 rounded" />
          {/* 入力状態フィードバック */}
          <p className="mt-1.5 text-xs h-4">
            {input.length > 0 && !canEnter && (
              <span className="text-amber-500">はば単にない単語です</span>
            )}
            {canEnter && (
              <span className="text-primary-500">ENTERで送信</span>
            )}
          </p>
        </div>

        {/* スペーサー */}
        <div className="flex-1" />

        {/* キーボード */}
        <Keyboard
          keyStates={keyStates}
          onKey={onKey}
          onDelete={onDelete}
          onEnter={onEnter}
          canEnter={canEnter}
        />
      </div>
    </div>
  );
}
