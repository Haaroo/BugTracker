import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { bugsApi, commentsApi } from "@/lib/api";
import { Bug } from "@/types/bug";
import { Comment } from "@/types/comment";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import EditBugModal from "@/components/bugs/EditBugModal";
import DeleteBugDialog from "@/components/bugs/DeleteBugDialog";
import CommentThread from "@/components/bugs/CommentThread";

export default function BugDetail() {
  const router = useRouter();
  const idParam = router.query.id;
  const bugId = typeof idParam === "string" ? Number(idParam) : undefined;

  const [bug, setBug] = useState<Bug | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const loadComments = useCallback(async () => {
    if (!bugId) return;
    try {
      setComments(await commentsApi.list(bugId));
    } catch {
      // non-fatal: the bug itself can still render without its comments
    }
  }, [bugId]);

  useEffect(() => {
    if (!bugId) return;

    (async () => {
      try {
        setBug(await bugsApi.get(bugId));
        await loadComments();
      } catch {
        setError("This bug doesn't exist, or the API is unreachable.");
      } finally {
        setLoading(false);
      }
    })();
  }, [bugId, loadComments]);

  const handleUpdate = async (id: number, input: Parameters<typeof bugsApi.update>[1]) => {
    const updated = await bugsApi.update(id, input);
    setBug(updated);
    setToast("Bug updated successfully");
  };

  const handleDelete = async () => {
    if (!bug) return;
    await bugsApi.remove(bug.id);
    router.push("/");
  };

  const handleAddComment = async (author: string, content: string) => {
    if (!bugId) return;
    await commentsApi.create(bugId, { author, content });
    await loadComments();
  };

  // Skeleton UI elegante para carga
  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-4 w-32 animate-pulse rounded-md bg-slate-200 mb-6" />
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2">
              <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
              <div className="h-7 w-64 animate-pulse rounded-lg bg-slate-200" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-200" />
            </div>
          </div>
          <div className="flex gap-2 mb-6">
            <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  // Estado de Error / No encontrado
  if (error || !bug) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-8 text-center shadow-sm backdrop-blur-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="mb-4 text-base font-medium text-slate-800">{error ?? "Bug not found."}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition-all"
          >
            ← Back to all bugs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Botón de retorno mejorado */}
      <Link
        href="/"
        className="group mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <svg
          className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to all bugs
      </Link>

      {/* Tarjeta Contenedora Principal */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/5 sm:p-8">
        
        {/* Cabecera del Bug */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-slate-400">
                BUG-{bug.id}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {bug.title}
            </h1>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              onClick={() => setIsEditOpen(true)}
              className="!text-xs !px-3.5 !py-2 border-slate-200 hover:bg-slate-50"
            >
              Edit Bug
            </Button>
            <Button
              variant="danger"
              onClick={() => setIsDeleteOpen(true)}
              className="!text-xs !px-3.5 !py-2"
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Metadatos (Badges) */}
        <div className="mb-8 flex items-center gap-2.5">
          <StatusBadge status={bug.status} />
          <PriorityBadge priority={bug.priority} />
        </div>

        {/* Descripción */}
        <div className="mb-10 rounded-xl bg-slate-50/70 p-5 border border-slate-100">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            Description
          </h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {bug.description}
          </p>
        </div>

        {/* Sección de Comentarios */}
        <div className="border-t border-slate-100 pt-8">
          <CommentThread comments={comments} onAddComment={handleAddComment} />
        </div>
      </div>

      {/* Modales y Notificaciones */}
      <EditBugModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleUpdate}
        bug={bug}
      />

      <DeleteBugDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        bugTitle={bug.title}
      />

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}