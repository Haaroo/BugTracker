import { useEffect, useState } from "react";
import { bugsApi } from "@/lib/api";
import { Bug, BugInput, STATUSES } from "@/types/bug";
import StatusColumn from "@/components/board/StatusColumn";
import CreateBugModal from "@/components/bugs/CreateBugModal";
import EditBugModal from "@/components/bugs/EditBugModal";
import DeleteBugDialog from "@/components/bugs/DeleteBugDialog";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";

export default function KanbanBoard() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [bugToEdit, setBugToEdit] = useState<Bug | null>(null);
  const [bugToDelete, setBugToDelete] = useState<Bug | null>(null);

  const loadBugs = async () => {
    try {
      setError(null);
      const data = await bugsApi.list();
      setBugs(data);
    } catch {
      setError("Couldn't load bugs. Is the API running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBugs();
  }, []);

  const handleCreate = async (input: BugInput) => {
    const created = await bugsApi.create(input);
    await loadBugs();
    setToast({ message: `Created bug "${created.title}"`, type: "success" });
  };

  const handleUpdate = async (id: number, input: BugInput) => {
    await bugsApi.update(id, input);
    await loadBugs();
    setToast({ message: "Bug updated", type: "success" });
    setBugToEdit(null);
  };

  const handleDelete = async () => {
    if (!bugToDelete) return;
    const title = bugToDelete.title;
    await bugsApi.remove(bugToDelete.id);
    await loadBugs();
    setBugToDelete(null);
    setToast({ message: `Deleted bug "${title}"`, type: "success" });
  };

  const stats = STATUSES.map((status) => ({
    status,
    count: bugs.filter((b) => b.status === status).length,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header del Board */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">All Bugs</h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600 border border-slate-200/60">
              {bugs.length} total
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            {stats.map((s, i) => (
              <span key={s.status} className="inline-flex items-center gap-1.5">
                <span className="capitalize">{s.status.toLowerCase()}</span>
                <span className="font-semibold text-slate-700">({s.count})</span>
                {i < stats.length - 1 && <span className="text-slate-300">·</span>}
              </span>
            ))}
          </div>
        </div>

        <Button onClick={() => setIsCreateOpen(true)} data-testid="open-create-bug-modal">
          <svg className="mr-1.5 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Report a bug
        </Button>
      </div>

      {/* Alerta de Error */}
      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-xs font-medium text-rose-800 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <svg className="h-4 w-4 text-rose-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
          <button
            onClick={loadBugs}
            className="rounded-lg bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-900 transition-colors hover:bg-rose-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Tablero Kanban / Estado de Carga */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((col) => (
            <div key={col} className="animate-pulse rounded-2xl border border-slate-200/60 bg-slate-100/50 p-4 space-y-4">
              <div className="h-4 w-24 rounded-md bg-slate-200" />
              <div className="h-28 rounded-xl bg-slate-200/70" />
              <div className="h-28 rounded-xl bg-slate-200/70" />
            </div>
          ))}
        </div>
      ) : (
        <div
          data-testid="kanban-board"
          className="flex flex-col gap-5 md:flex-row md:items-start md:overflow-x-auto pb-4"
        >
          {STATUSES.map((status) => (
            <StatusColumn
              key={status}
              status={status}
              bugs={bugs.filter((b) => b.status === status)}
              onEdit={setBugToEdit}
              onDelete={setBugToDelete}
            />
          ))}
        </div>
      )}

      {/* Modales y Notificaciones */}
      <CreateBugModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      {bugToEdit && (
        <EditBugModal
          isOpen={!!bugToEdit}
          onClose={() => setBugToEdit(null)}
          onSubmit={handleUpdate}
          bug={bugToEdit}
        />
      )}

      {bugToDelete && (
        <DeleteBugDialog
          isOpen={!!bugToDelete}
          onClose={() => setBugToDelete(null)}
          onConfirm={handleDelete}
          bugTitle={bugToDelete.title}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}