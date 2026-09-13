import Link from "next/link";
import { Bug } from "@/types/bug";
import { PriorityBadge } from "@/components/ui/Badge";

interface Props {
  bug: Bug;
  onEdit: (bug: Bug) => void;
  onDelete: (bug: Bug) => void;
}

export default function BugCard({ bug, onEdit, onDelete }: Props) {
  return (
    <div
      data-testid={`bug-card-${bug.id}`}
      className="group relative rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all duration-150 hover:border-slate-300 hover:shadow-md"
    >
      {/* Encabezado: Título e ID */}
      <div className="mb-2 flex items-start justify-between gap-2.5">
        <Link
          href={`/bugs/${bug.id}`}
          className="text-xs font-semibold leading-snug text-slate-900 transition-colors hover:text-slate-600"
        >
          {bug.title}
        </Link>
        <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500">
          #{bug.id}
        </span>
      </div>

      {/* Descripción corta */}
      <p className="mb-3.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
        {bug.description}
      </p>

      {/* Footer: Priority Badge y Acciones */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100/80">
        <PriorityBadge priority={bug.priority} />

        {/* Botones de acción al hacer Hover */}
        <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(bug)}
            title="Edit bug"
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
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
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
          </button>
          
          <button
            type="button"
            onClick={() => onDelete(bug)}
            title="Delete bug"
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
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
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}