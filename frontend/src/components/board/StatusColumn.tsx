import { Bug, Status } from "@/types/bug";
import BugCard from "@/components/board/BugCard";
import EmptyState from "@/components/ui/EmptyState";

const STATUS_CONFIG: Record<
  Status,
  { dot: string; badge: string; ring: string }
> = {
  Open: {
    dot: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700 border-rose-200/60",
    ring: "ring-rose-500/20",
  },
  "In Progress": {
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200/60",
    ring: "ring-amber-500/20",
  },
  Resolved: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    ring: "ring-emerald-500/20",
  },
};

interface Props {
  status: Status;
  bugs: Bug[];
  onEdit: (bug: Bug) => void;
  onDelete: (bug: Bug) => void;
}

export default function StatusColumn({ status, bugs, onEdit, onDelete }: Props) {
  const config = STATUS_CONFIG[status] || {
    dot: "bg-slate-400",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    ring: "ring-slate-400/20",
  };

  return (
    <div
      data-testid={`status-column-${status.replace(/\s+/g, "-").toLowerCase()}`}
      className="flex min-w-[280px] flex-1 flex-col rounded-2xl border border-slate-200/60 bg-slate-100/60 p-3.5 backdrop-blur-xs"
    >
      {/* Encabezado de la Columna */}
      <div className="mb-3.5 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-20 ${config.dot}`} />
            <span className={`relative inline-flex h-2 w-2 rounded-full ${config.dot}`} />
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {status}
          </h3>
        </div>

        <span
          className={`rounded-full border px-2 py-0.5 text-[11px] font-bold shadow-2xs ${config.badge}`}
        >
          {bugs.length}
        </span>
      </div>

      {/* Contenedor de Tarjetas con Scroll Personalizado */}
      <div className="scroll-thin flex max-h-[68vh] flex-col gap-3 overflow-y-auto px-0.5 pb-1">
        {bugs.length === 0 ? (
          <div className="py-2">
            <EmptyState message="Nothing here." />
          </div>
        ) : (
          bugs.map((bug) => (
            <BugCard key={bug.id} bug={bug} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
}