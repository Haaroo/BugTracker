import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditBugModal from "./EditBugModal";
import { Bug } from "@/types/bug";

const bug: Bug = {
  id: 7,
  title: "Old title",
  description: "Old description",
  status: "Open",
  priority: "Low",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("EditBugModal", () => {
  it("pre-fills the form from the given bug", () => {
    render(<EditBugModal isOpen onClose={jest.fn()} onSubmit={jest.fn()} bug={bug} />);
    expect(screen.getByDisplayValue("Old title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Old description")).toBeInTheDocument();
  });

  it("submits the updated fields for the given bug id", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();

    render(<EditBugModal isOpen onClose={jest.fn()} onSubmit={onSubmit} bug={bug} />);

    const titleInput = screen.getByDisplayValue("Old title");
    await user.clear(titleInput);
    await user.type(titleInput, "New title");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      7,
      expect.objectContaining({ title: "New title", status: "Open", priority: "Low" })
    );
  });
});
