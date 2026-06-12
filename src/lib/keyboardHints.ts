import type { WordData } from "@/types";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

/**
 * レベル1: 入力0文字時
 * 候補単語の1文字目に存在しないアルファベットをdisabledセットとして返す
 */
export function getLevel1Disabled(candidates: WordData[]): Set<string> {
  const firstChars = new Set(
    candidates.map((w) => w.word.toLowerCase()[0]).filter(Boolean)
  );
  const disabled = new Set<string>();
  for (const ch of ALPHABET) {
    if (!firstChars.has(ch)) disabled.add(ch);
  }
  return disabled;
}

/**
 * レベル2: 入力1文字以上時
 * 現在の入力prefixに続く可能性がある次の1文字の「有効セット」を返す
 * 有効 = input + ch をprefixとして持つ候補が1件以上存在する文字
 */
export function getLevel2Enabled(
  candidates: WordData[],
  input: string
): Set<string> {
  const inputLower = input.toLowerCase();
  const enabled = new Set<string>();
  for (const ch of ALPHABET) {
    const prefix = inputLower + ch;
    const hasMatch = candidates.some((w) =>
      w.word.toLowerCase().startsWith(prefix)
    );
    if (hasMatch) enabled.add(ch);
  }
  return enabled;
}

/**
 * 統合: 現在の入力長に応じてキー状態マップを返す
 * key -> "active" | "disabled"
 */
export function getKeyStates(
  candidates: WordData[],
  input: string
): Record<string, "active" | "disabled"> {
  const states: Record<string, "active" | "disabled"> = {};

  if (input.length === 0) {
    const disabled = getLevel1Disabled(candidates);
    for (const ch of ALPHABET) {
      states[ch] = disabled.has(ch) ? "disabled" : "active";
    }
  } else {
    const enabled = getLevel2Enabled(candidates, input);
    for (const ch of ALPHABET) {
      states[ch] = enabled.has(ch) ? "active" : "disabled";
    }
  }

  return states;
}
