import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
};

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary-500 text-white font-bold shadow-md active:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400",
  secondary:
    "bg-white text-primary-600 border-2 border-primary-400 font-bold active:bg-primary-50 disabled:opacity-40",
  ghost:
    "bg-transparent text-gray-500 font-medium active:bg-gray-100 disabled:opacity-40",
};

export function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "rounded-xl px-6 py-3 text-base transition-colors select-none",
        variantStyles[variant],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
