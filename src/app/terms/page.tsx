export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* ヘッダー */}
      <div className="bg-primary-600 text-white px-5 pt-12 pb-6">
        <a href="/" className="text-primary-200 text-sm hover:text-white transition-colors">
          ← トップに戻る
        </a>
        <h1 className="text-2xl font-black mt-3">利用規約</h1>
      </div>

      <div className="max-w-lg mx-auto px-5 py-8 space-y-8 text-sm text-gray-700 leading-relaxed">

        <section className="space-y-2">
          <h2 className="font-bold text-gray-900 text-base">1. サービスについて</h2>
          <p>
            Index Words（以下「本サービス」）は、兵庫県教育委員会が発行する英単語帳「はば単（第２版）」を使用した探索型英単語ゲームです。
            本サービスは非営利・学習目的で提供しています。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-gray-900 text-base">2. 単語データについて</h2>
          <p>
            本サービスで使用する単語データは、兵庫県教育委員会の公式サイトから直接取得しています。
            単語データの著作権は兵庫県教育委員会に帰属します。
          </p>
          <p>
            取得元：
            <a
              href="https://www2.hyogo-c.ed.jp/hpe/uploads/sites/10/2023/03/R3ver2_Habatanforstudents.xls"
              className="text-primary-500 underline break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              兵庫県教育委員会 公式サイト
            </a>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-gray-900 text-base">3. 免責事項</h2>
          <p>
            本サービスの利用によって生じたいかなる損害についても、作者は責任を負いません。
            サービスの内容は予告なく変更・終了する場合があります。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-gray-900 text-base">4. ソースコードのライセンス</h2>
          <p>
            本サービスのソースコードは、非営利目的・改変なしに限り使用・共有を許可します。
            商用利用・改変・改変物の配布は禁止します。
            使用の際はご連絡いただけると幸いです。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-gray-900 text-base">5. お問い合わせ</h2>
          <p>
            ご意見・ご要望は
            <a href="/contact" className="text-primary-500 underline mx-1">
              お問い合わせページ
            </a>
            よりご連絡ください。
          </p>
        </section>

      </div>

      {/* フッター */}
      <div className="text-center py-6 text-xs text-gray-400">
        © Sr
      </div>
    </div>
  );
}
