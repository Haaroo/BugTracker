import { apiFetch } from "@/lib/http";
import { Bug, BugInput } from "@/types/bug";
import { Comment, CommentInput } from "@/types/comment";

export const bugsApi = {
  list: () => apiFetch<Bug[]>("/bugs"),
  get: (id: number) => apiFetch<Bug>(`/bugs/${id}`),
  create: (input: BugInput) =>
    apiFetch<Bug>("/bugs", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: number, input: BugInput) =>
    apiFetch<Bug>(`/bugs/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  remove: (id: number) =>
    apiFetch<void>(`/bugs/${id}`, { method: "DELETE" }),
};

export const commentsApi = {
  list: (bugId: number) => apiFetch<Comment[]>(`/bugs/${bugId}/comments`),
  create: (bugId: number, input: CommentInput) =>
    apiFetch<Comment>(`/bugs/${bugId}/comments`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
};
