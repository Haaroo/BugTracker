import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  bugTitle: string;
}

export default function DeleteBugDialog({ isOpen, onClose, onConfirm, bugTitle }: Props) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Bug" testId="delete-bug-modal">
      <div className="space-y-4 pt-1">
        {/* Encabezado con Icono de Advertencia */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-900">
              Are you sure you want to delete this bug?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This action cannot be undone. The bug and all associated comments will be permanently removed.
            </p>
          </div>
        </div>

        {/* Resaltado del título a eliminar */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs text-slate-700">
          <span className="font-semibold text-slate-900 block truncate">
            &ldquo;{bugTitle}&rdquo;
          </span>
        </div>

        {/* Acciones del Modal */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={deleting}
            data-testid="confirm-delete-button"
          >
            {deleting ? (
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Deleting...
              </span>
            ) : (
              "Delete bug"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}