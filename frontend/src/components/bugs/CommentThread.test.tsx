import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommentThread from "./CommentThread";
import { Comment } from "@/types/comment";

const comments: Comment[] = [
  {
    id: 1,
    bug_id: 1,
    author: "Emma",
    content: "Can reproduce on Chrome",
    created_at: "2026-01-01T12:00:00Z",
  },
];

describe("CommentThread", () => {
  it("shows an empty state when there are no comments", () => {
    render(<CommentThread comments={[]} onAddComment={jest.fn()} />);
    expect(screen.getByText(/no comments yet/i)).toBeInTheDocument();
  });

  it("renders existing comments", () => {
    render(<CommentThread comments={comments} onAddComment={jest.fn()} />);
    expect(screen.getByText("Emma")).toBeInTheDocument();
    expect(screen.getByText("Can reproduce on Chrome")).toBeInTheDocument();
  });

  it("submits a new comment with trimmed author and content", async () => {
    const onAddComment = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<CommentThread comments={[]} onAddComment={onAddComment} />);

    await user.type(screen.getByTestId("comment-author-input"), "  Emma  ");
    await user.type(screen.getByTestId("comment-content-input"), "  Looks fixed now  ");
    await user.click(screen.getByTestId("comment-submit"));

    expect(onAddComment).toHaveBeenCalledWith("Emma", "Looks fixed now");
  });

  it("disables the submit button until both fields are filled", () => {
    render(<CommentThread comments={[]} onAddComment={jest.fn()} />);
    expect(screen.getByTestId("comment-submit")).toBeDisabled();
  });
});
