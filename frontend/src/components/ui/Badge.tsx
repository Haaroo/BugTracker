import { Priority, Status } from "@/types/bug";

// Configuración visual para Status
const STATUS_CONFIG: Record<
  Status,
  { style: string; dot: string; animate?: boolean }
> = {
  Open: {
    style: "bg-rose-50 text-rose-700 border-rose-200/80",
    dot: "bg-rose-500",
    animate: true,
  },
  "In Progress": {
    style: "bg-amber-50 text-amber-700 border-amber-200/80",
    dot: "bg-amber-500",
    animate: true,
  },
  Resolved: {
    style: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    dot: "bg-emerald-500",
    animate: false,
  },
};

// Configuración visual para Priority
const PRIORITY_CONFIG: Record<
  Priority,
  { style: string; label: string; icon: string }
> = {
  Low: {
    style: "bg-slate-100/80 text-slate-600 border-slate-200/80",
    label: "Low Priority",
    icon: "↓",
  },
  Medium: {
    style: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    label: "Medium Priority",
    icon: "→",
  },
  High: {
    style: "bg-rose-50 text-rose-700 border-rose-200/80 font-bold",
    label: "High Priority",
    icon: "↑",
  },
};

// Clase base compartida
function baseClasses(extra: string) {
  return `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-tight transition-all shadow-2xs ${extra}`;
}

export function StatusBadge({ status }: { status: Status }) {
  const config = STATUS_CONFIG[status] ?? {
    style: "bg-slate-50 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
    animate: false,
  };

  return (
    <span className={baseClasses(config.style)}>
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {config.animate && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${config.dot}`}
          />
        )}
        <span
          className={`relative inline-flex h-1.5 w-1.5 rounded-full ${config.dot}`}
        />
      </span>
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const config = PRIORITY_CONFIG[priority] ?? {
    style: "bg-slate-50 text-slate-600 border-slate-200",
    label: priority,
    icon: "•",
  };

  return (
    <span className={baseClasses(config.style)}>
      <span className="font-mono text-[10px] leading-none opacity-70">
        {config.icon}
      </span>
      {priority}
    </span>
  );
}