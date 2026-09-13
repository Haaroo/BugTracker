import { PropsWithChildren, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  testId?: string;
  maxWidthClassName?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  testId,
  maxWidthClassName = "max-w-md",
  children,
}: PropsWithChildren<ModalProps>) {
  useEffect(() => {
    if (!isOpen) return;

    // Prevenir scroll en la página mientras el modal está abierto
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      data-testid={testId}
      role="dialog"
      aria-modal="true"
      aria-labelledby={testId ? `${testId}-title` : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm transition-all duration-200"
      onClick={onClose}
    >
      {/* Contenedor Flotante del Modal */}
      <div
        className={`w-full ${maxWidthClassName} transform overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl shadow-slate-900/10 transition-all duration-200 ease-out sm:p-7`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
          <h2
            id={testId ? `${testId}-title` : undefined}
            className="text-base font-bold tracking-tight text-slate-900 sm:text-lg"
          >
            {title}
          </h2>
          
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="group flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-400 transition-colors hover:border-slate-200 hover:bg-slate-50 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
          >
            <svg
              className="h-4 w-4 transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="text-sm text-slate-600 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}