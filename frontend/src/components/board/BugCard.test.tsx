import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BugCard from "./BugCard";
import { Bug } from "@/types/bug";

const bug: Bug = {
  id: 3,
  title: "Header overlaps content",
  description: "On narrow viewports the sticky header covers the first row.",
  status: "Open",
  priority: "Medium",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("BugCard", () => {
  it("renders the bug title, id and priority", () => {
    render(<BugCard bug={bug} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText("Header overlaps content")).toBeInTheDocument();
    expect(screen.getByText("#3")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  it("calls onEdit and onDelete with the bug", async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const user = userEvent.setup();

    render(<BugCard bug={bug} onEdit={onEdit} onDelete={onDelete} />);
    await user.click(screen.getByText("Edit"));
    await user.click(screen.getByText("Delete"));

    expect(onEdit).toHaveBeenCalledWith(bug);
    expect(onDelete).toHaveBeenCalledWith(bug);
  });
});
