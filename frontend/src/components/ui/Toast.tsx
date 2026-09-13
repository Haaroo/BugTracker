import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export default function Toast({
  message,
  type = "success",
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const hide = setTimeout(() => setVisible(false), 4000);
    const close = setTimeout(onClose, 4400);
    return () => {
      clearTimeout(hide);
      clearTimeout(close);
    };
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/95 px-4 py-3 text-xs font-medium text-slate-800 shadow-xl shadow-slate-900/10 backdrop-blur-md transition-all duration-300 ease-out sm:max-w-md ${
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-3 scale-95 opacity-0 pointer-events-none"
      }`}
    >
      {/* Indicador visual / Icono */}
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
          isSuccess
            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
            : "bg-rose-50 text-rose-600 border border-rose-100"
        }`}
      >
        {isSuccess ? (
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
      </span>

      {/* Mensaje principal */}
      <p className="flex-1 leading-snug text-slate-700">{message}</p>

      {/* Botón para cerrar manualmente */}
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        aria-label="Close toast"
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}