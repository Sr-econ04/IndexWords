export function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-lg mx-auto px-5 py-4 flex items-center justify-between">
        <p className="text-xs text-gray-400">© Sr</p>
        <div className="flex gap-4">
          <a
            href="/terms"
            className="text-xs text-gray-400 hover:text-primary-500 transition-colors"
          >
            利用規約
          </a>
          <a
            href="/contact"
            className="text-xs text-gray-400 hover:text-primary-500 transition-colors"
          >
            お問い合わせ
          </a>
        </div>
      </div>
    </footer>
  );
}
