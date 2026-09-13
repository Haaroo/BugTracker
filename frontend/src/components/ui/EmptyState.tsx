import { ReactNode } from "react";

interface EmptyStateProps {
  message: string;
  children?: ReactNode;
}

export default function EmptyState({ message, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200/80 bg-slate-50/50 px-6 py-12 text-center transition-all">
      {/* Icono vectorial contenedor */}
      <div className="mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200/80 shadow-sm shadow-slate-900/5 ring-4 ring-slate-100/50">
        <svg
          className="h-6 w-6 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 20U" />
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
          <path d="M9 10h6" />
          <path d="M9 14h4" />
        </svg>
      </div>

      {/* Mensaje principal */}
      <p className="max-w-xs text-sm font-medium text-slate-500 leading-relaxed">
        {message}
      </p>

      {/* Botones de acción opcionales */}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}