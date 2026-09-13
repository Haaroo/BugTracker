export interface Comment {
  id: number;
  bug_id: number;
  author: string;
  content: string;
  created_at: string;
}

export interface CommentInput {
  author: string;
  content: string;
}
