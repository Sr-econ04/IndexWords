"use client";

type KeyboardProps = {
  keyStates: Record<string, "active" | "disabled">;
  onKey: (char: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  canEnter: boolean;
};

const ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

export function Keyboard({
  keyStates,
  onKey,
  onDelete,
  onEnter,
  canEnter,
}: KeyboardProps) {
  return (
    <div className="w-full select-none pb-2">
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="flex justify-center gap-1 mb-1">
          {row.map((key) => {
            const state = keyStates[key] ?? "active";
            const isDisabled = state === "disabled";
            return (
              <button
                key={key}
                onPointerDown={(e) => {
                  e.preventDefault();
                  if (!isDisabled) onKey(key);
                }}
                className={[
                  "flex-1 max-w-[10%] min-w-0 h-12 rounded-lg text-sm font-bold uppercase font-mono",
                  "transition-colors active:scale-95",
                  isDisabled
                    ? "bg-gray-100 text-gray-300 cursor-default"
                    : "bg-white text-gray-800 shadow-sm border border-gray-200 active:bg-primary-50",
                ].join(" ")}
              >
                {key.toUpperCase()}
              </button>
            );
          })}
        </div>
      ))}

      {/* ⌫ と ENTER 行 */}
      <div className="flex justify-center gap-2 mt-1">
        <button
          onPointerDown={(e) => {
            e.preventDefault();
            onDelete();
          }}
          className="flex-1 max-w-[28%] h-12 rounded-lg bg-white border border-gray-200 shadow-sm
                     text-gray-600 text-xl font-bold active:bg-gray-50 active:scale-95 transition-colors"
        >
          ⌫
        </button>
        <button
          onPointerDown={(e) => {
            e.preventDefault();
            if (canEnter) onEnter();
          }}
          className={[
            "flex-1 max-w-[40%] h-12 rounded-lg text-sm font-bold tracking-widest transition-colors active:scale-95",
            canEnter
              ? "bg-primary-500 text-white shadow-md active:bg-primary-700"
              : "bg-gray-100 text-gray-300 cursor-default",
          ].join(" ")}
        >
          ENTER
        </button>
      </div>
    </div>
  );
}
