import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "はば単 | 兵庫県 英単語ゲーム",
  description: "兵庫県の中学生向け英単語帳「はば単」の単語を使った探索型英単語ゲーム",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="max-w-md mx-auto min-h-screen">{children}</body>
    </html>
  );
}
