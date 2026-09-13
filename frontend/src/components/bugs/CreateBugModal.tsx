import { FormEvent, useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { BugInput, Priority, PRIORITIES } from "@/types/bug";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: BugInput) => Promise<void> | void;
}

const initialState = { title: "", description: "", priority: "Medium" as Priority };

export default function CreateBugModal({ isOpen, onClose, onSubmit }: Props) {
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) setForm(initialState);
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit({ ...form, status: "Open" });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report a new bug" testId="create-bug-modal">
      <form data-testid="create-bug-form" onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Campo Título */}
        <div>
          <label
            htmlFor="title"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            Title
          </label>
          <input
            id="title"
            data-testid="bug-title-input"
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="block w-full rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 shadow-xs transition-all placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-900/5"
            placeholder="e.g. Checkout button does nothing on Safari"
          />
        </div>

        {/* Campo Descripción */}
        <div>
          <label
            htmlFor="description"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            Description
          </label>
          <textarea
            id="description"
            data-testid="bug-description-input"
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="block w-full resize-none rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 shadow-xs transition-all placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-900/5 leading-relaxed"
            placeholder="Steps to reproduce, expected vs actual behavior..."
          />
        </div>

        {/* Campo Prioridad */}
        <div>
          <label
            htmlFor="priority"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            Priority
          </label>
          <div className="relative">
            <select
              id="priority"
              data-testid="bug-priority-select"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
              className="block w-full appearance-none rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 pr-8 text-xs font-medium text-slate-900 shadow-xs transition-all focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-900/5"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>
        </div>

        {/* Acciones del Modal */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            data-testid="create-bug-submit"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating...
              </span>
            ) : (
              "Create bug"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}