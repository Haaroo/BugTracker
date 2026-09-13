import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-slate-900 text-white shadow-sm shadow-slate-900/10 hover:bg-slate-800 focus-visible:ring-slate-900 active:scale-[0.98]",
  secondary:
    "border border-slate-200/80 bg-white text-slate-700 shadow-sm shadow-slate-900/5 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-400 active:scale-[0.98]",
  danger:
    "bg-rose-600 text-white shadow-sm shadow-rose-900/10 hover:bg-rose-700 focus-visible:ring-rose-600 active:scale-[0.98]",
  ghost:
    "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 focus-visible:ring-slate-400 active:scale-[0.98]",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({
  variant = "primary",
  className = "",
  disabled,
  ...props
}: Props) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold tracking-tight transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}