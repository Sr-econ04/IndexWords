export default function ContactPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* ヘッダー */}
      <div className="bg-primary-600 text-white px-5 pt-12 pb-6">
        <a href="/" className="text-primary-200 text-sm hover:text-white transition-colors">
          ← トップに戻る
        </a>
        <h1 className="text-2xl font-black mt-3">お問い合わせ</h1>
      </div>

      <div className="max-w-lg mx-auto px-5 py-8 space-y-6 text-sm text-gray-700 leading-relaxed">

        <p>
          バグの報告・ご意見・ご要望などは、以下のメールアドレスまでお気軽にご連絡ください。
        </p>

        <div className="bg-card rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">メールアドレス</p>
          <a
            href="mailto:Srecon04@gmail.com"
            className="text-primary-600 font-bold text-base hover:underline"
          >
            Srecon04@gmail.com
          </a>
        </div>

        <div className="bg-primary-50 rounded-2xl p-4 text-xs text-primary-700 space-y-1">
          <p className="font-bold">ソースコードの使用について</p>
          <p>
            本サービスのソースコードを使用・共有される場合も、ご一報いただけると幸いです。
          </p>
        </div>

      </div>

      {/* フッター */}
      <div className="text-center py-6 text-xs text-gray-400">
        © Sr
      </div>
    </div>
  );
}
