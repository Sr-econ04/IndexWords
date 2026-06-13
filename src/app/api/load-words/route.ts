import { NextResponse } from "next/server";

const XLS_URL =
  "https://www2.hyogo-c.ed.jp/hpe/uploads/sites/10/2023/03/R3ver2_Habatanforstudents.xls";

// 品詞マッピング
function mapPos(pos: string | null | undefined): string {
  if (!pos) return "other";
  if (pos.includes("動") && !pos.includes("名")) return "verb";
  if (pos.includes("名") && !pos.includes("動")) return "noun";
  if (pos.includes("動")) return "verb";
  if (pos.includes("名")) return "noun";
  if (pos.includes("形")) return "adjective";
  if (pos.includes("副")) return "adverb";
  return "other";
}

function cleanMeaning(raw: string | null | undefined): string {
  if (!raw) return "";
  const lines = String(raw).split(/\n/).map((l) => l.trim()).filter(Boolean);
  let first = lines[0] ?? "";
  first = first.replace(/^[①②③④⑤]/, "").trim();
  first = first.split("※")[0].trim();
  return first.replace(/　+$/, "").trimEnd();
}

export async function GET() {
  try {
    // XLSファイルを取得
    const res = await fetch(XLS_URL, { next: { revalidate: 86400 } });
    if (!res.ok) {
      return NextResponse.json(
        { error: "XLSファイルの取得に失敗しました" },
        { status: 502 }
      );
    }

    const arrayBuffer = await res.arrayBuffer();

    // XLS(BIFF8)をNode.jsで解析 — xlsx(SheetJS)をdynamic importで使用
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(arrayBuffer, { type: "array", codepage: 932 });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: null,
    });

    const words: { word: string; meaning: string; partOfSpeech: string }[] = [];
    const seen = new Set<string>();

    for (const row of rows) {
      if (!row || typeof row[0] !== "number") continue;

      const rawWord = String(row[1] ?? "").trim();
      const rawPos = String(row[3] ?? "").trim();
      const rawMeaning = String(row[4] ?? "").trim();

      // アルファベット始まり以外スキップ
      if (!/^[a-zA-Z]/.test(rawWord)) continue;

      // 括弧以前の先頭単語のみ使用
      const wordClean = rawWord.split(/[\s([]/)[0]
        .replace(/[.,;:]$/, "")
        .toLowerCase();

      // 特殊文字を含む単語はスキップ（キーボードで入力不可）
      if (!/^[a-z]+$/.test(wordClean)) continue;

      const meaning = cleanMeaning(rawMeaning);
      if (!meaning) continue;
      if (seen.has(wordClean)) continue;

      seen.add(wordClean);
      words.push({ word: wordClean, meaning, partOfSpeech: mapPos(rawPos) });
    }

    // 辞書順ソート
    words.sort((a, b) => a.word.localeCompare(b.word));

    return NextResponse.json(words);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "単語データの変換中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
