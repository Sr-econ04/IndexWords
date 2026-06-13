"use client";

import type { GameState, WordData } from "@/types";
import { RangeBar } from "@/components/game/RangeBar";
import { Keyboard } from "@/components/game/Keyboard";
import { getKeyStates } from "@/lib/keyboardHints";
import { filterLabel, calcTheoretical, findWord } from "@/lib/gameLogic";

type GameScreenProps = {
  state: GameState & { phase: "playing" };
  candidates: WordData[];
  onKey: (char: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  onReset: () => void;
};

export function GameScreen({
  state,
  candidates,
  onKey,
  onDelete,
  onEnter,
  onReset,
}: GameScreenProps) {
  const { pool, answer, input, moves, filter, rangeLowIndex, rangeHighIndex, usedWords } = state;

  const keyStates = getKeyStates(candidates, input);

  const inputLower = input.toLowerCase();
  const answerLower = answer.word.toLowerCase();
  const isInitial = rangeLowIndex === 0 && rangeHighIndex === pool.length - 1;
  const lowWord = pool[rangeLowIndex]?.word.toLowerCase();
  const highWord = pool[rangeHighIndex]?.word.toLowerCase();

  const existsInPool = pool.some((w) => w.word.toLowerCase() === inputLower);
  const alreadyUsed = usedWords.has(inputLower);
  const isBoundary = !isInitial && inputLower !== answerLower &&
    (inputLower === lowWord || inputLower === highWord);

  const canEnter = input.length > 0 && existsInPool && !alreadyUsed && !isBoundary;

  const showDot = moves > 0;
  const theoretical = calcTheoretical(pool.length);

  // 入力中の単語の意味（プール内に存在すれば表示）
  const inputWordData = input.length > 0 ? findWord(pool, input) : undefined;

  // 入力フィードバックメッセージ
  let feedbackMsg: { text: string; color: string } | null = null;
  if (input.length > 0) {
    if (alreadyUsed || isBoundary) {
      feedbackMsg = { text: "この単語はすでに使われています", color: "text-red-400" };
    } else if (!existsInPool) {
      feedbackMsg = { text: "はば単にない単語です", color: "text-amber-500" };
    } else {
      feedbackMsg = { text: "ENTERで送信", color: "text-primary-500" };
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* ヘッダー */}
      <div className="bg-primary-600 text-white px-4 py-3 flex justify-between items-center relative">
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="text-primary-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-primary-500"
            title="トップに戻る"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          <span className="text-xs bg-primary-500 rounded-full px-2 py-0.5">
            {filterLabel(filter)}
          </span>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-baseline gap-1">
          <span className="text-2xl font-black text-white leading-none">{moves}</span>
          <span className="text-xs text-primary-200">/ {theoretical}手</span>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-sm font-bold text-white">{candidates.length.toLocaleString()}</span>
          <span className="text-xs text-primary-300">語</span>
        </div>
      </div>

      {/* メインエリア */}
      <div className="flex-1 flex flex-col w-full max-w-lg mx-auto px-4 py-4 gap-4">

        {/* ヒントバー */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 font-medium mb-3">探索範囲</p>
          <RangeBar
            candidates={candidates}
            answer={answer}
            lowWord={isInitial ? null : pool[rangeLowIndex]?.word ?? null}
            highWord={isInitial ? null : pool[rangeHighIndex]?.word ?? null}
            showDot={showDot}
          />
        </div>

        {/* 入力表示エリア */}
        <div className="bg-card rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 mb-2">入力中の単語</p>
          <div className="flex items-end gap-1 min-h-[2.5rem]">
            {input.length === 0 ? (
              <span className="text-gray-300 text-2xl font-mono tracking-widest">＿</span>
            ) : (
              <>
                <span className={`text-2xl font-mono font-bold tracking-wider ${
                  alreadyUsed || isBoundary ? "text-red-300" : "text-gray-800"
                }`}>
                  {input}
                </span>
                <span className="w-0.5 h-7 bg-primary-500 rounded animate-pulse mb-0.5" />
              </>
            )}
          </div>
          <div className={`mt-1 h-0.5 rounded ${alreadyUsed || isBoundary ? "bg-red-200" : "bg-primary-200"}`} />

          {/* 入力した単語の意味 */}
          {inputWordData && !alreadyUsed && !isBoundary ? (
            <p className="mt-2 text-sm text-gray-600 font-medium">
              {inputWordData.meaning}
            </p>
          ) : (
            <p className="mt-1.5 text-xs h-4">
              {feedbackMsg && (
                <span className={feedbackMsg.color}>{feedbackMsg.text}</span>
              )}
            </p>
          )}
        </div>

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
