import { FormEvent, useState } from "react";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { Comment } from "@/types/comment";

interface Props {
  comments: Comment[];
  onAddComment: (author: string, content: string) => Promise<void> | void;
}

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function CommentThread({ comments, onAddComment }: Props) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      await onAddComment(author.trim(), content.trim());
      setAuthor("");
      setContent("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-8">
      {/* Encabezado */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Activity & Comments
        </h2>
        {comments.length > 0 && (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            {comments.length}
          </span>
        )}
      </div>

      {/* Formulario de Comentarios */}
      <form
        data-testid="comment-form"
        onSubmit={handleSubmit}
        className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all focus-within:border-slate-300 focus-within:ring-4 focus-within:ring-slate-900/5"
      >
        <div className="space-y-3">
          <input
            data-testid="comment-author-input"
            type="text"
            required
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="block w-full rounded-xl border border-slate-200/60 bg-slate-50/50 px-3.5 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none"
          />
          <textarea
            data-testid="comment-content-input"
            required
            rows={3}
            placeholder="Add context or update on this bug..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="block w-full resize-none rounded-xl border border-slate-200/60 bg-slate-50/50 px-3.5 py-2.5 text-xs font-medium leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="mt-3 flex items-center justify-end border-t border-slate-100 pt-3">
          <Button
            type="submit"
            disabled={submitting || !author.trim() || !content.trim()}
            data-testid="comment-submit"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Posting...
              </span>
            ) : (
              "Post comment"
            )}
          </Button>
        </div>
      </form>

      {/* Lista de Comentarios / Estado Vacío */}
      {comments.length === 0 ? (
        <EmptyState message="No comments yet — be the first to add context." />
      ) : (
        <div className="relative border-l-2 border-slate-100 pl-4 sm:pl-6 ml-3 space-y-6" data-testid="comment-list">
          {comments.map((comment) => (
            <div key={comment.id} className="relative group">
              {/* Punto de unión en la línea de tiempo */}
              <span className="absolute -left-[25px] sm:-left-[33px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-slate-300 transition-colors group-hover:bg-slate-900" />
              
              <div className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-xs transition-shadow hover:shadow-md">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* Avatar con Iniciales */}
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-[10px] font-bold text-white shadow-xs">
                      {getInitials(comment.author)}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {comment.author}
                    </span>
                  </div>
                  <time className="text-[11px] font-medium text-slate-400">
                    {formatTimestamp(comment.created_at)}
                  </time>
                </div>

                <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-600 pl-9">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}