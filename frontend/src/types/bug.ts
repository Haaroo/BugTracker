export type Status = "Open" | "In Progress" | "Resolved";
export type Priority = "Low" | "Medium" | "High";

export const STATUSES: Status[] = ["Open", "In Progress", "Resolved"];
export const PRIORITIES: Priority[] = ["Low", "Medium", "High"];

export interface Bug {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  created_at: string;
  updated_at: string;
}

export interface BugInput {
  title: string;
  description: string;
  status?: Status;
  priority?: Priority;
}
