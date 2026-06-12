# はば単ゲーム

兵庫県の中学生向け英単語帳「はば単（第２版）」の2,380語を使った探索型英単語ゲームです。

## ローカル起動

```bash
npm install
npm run dev
# http://localhost:3000 で起動
```

## Vercelへのデプロイ（無料）

### 方法1: Vercel CLIで直接デプロイ

```bash
npm install
npm i -g vercel
vercel
```

### 方法2: GitHubからデプロイ（推奨）

1. このフォルダをGitHubリポジトリにpush
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   gh repo create habatan --public --push
   ```
2. [vercel.com](https://vercel.com) でGitHubアカウントでログイン
3. 「New Project」→ リポジトリを選択 → 「Deploy」
4. 自動でURLが発行される（例: `habatan.vercel.app`）

以降はGitHubにpushするたびに自動デプロイされます。

## 単語データ

`public/words.json` に2,380語が入っています。
はば単第２版 から変換済みです（特殊文字を含む11語を除外）。

| 品詞 | 語数 |
|---|---|
| 名詞 (noun) | 1,425 |
| 動詞 (verb) | 412 |
| 形容詞 (adjective) | 326 |
| 副詞 (adverb) | 118 |
| その他 (冠詞・前置詞等) | 99 |
| **合計** | **2,380** |

## ディレクトリ構成

```
src/
├── app/              # Next.js App Router
├── components/
│   ├── game/         # RangeBar / Keyboard / CandidateCount
│   ├── screens/      # SelectScreen / GameScreen / ResultScreen
│   └── ui/           # Button
├── hooks/useGame.ts  # useReducerによる状態管理
├── lib/              # ゲームロジック・キーヒント計算
└── types/            # 型定義
```
