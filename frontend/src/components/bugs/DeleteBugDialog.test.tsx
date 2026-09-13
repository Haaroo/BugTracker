import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteBugDialog from "./DeleteBugDialog";

describe("DeleteBugDialog", () => {
  it("shows the bug title and confirms deletion", async () => {
    const onConfirm = jest.fn();
    const user = userEvent.setup();

    render(
      <DeleteBugDialog isOpen onClose={jest.fn()} onConfirm={onConfirm} bugTitle="Broken export" />
    );

    expect(screen.getByText(/Broken export/)).toBeInTheDocument();
    await user.click(screen.getByTestId("confirm-delete-button"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onClose on cancel", async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();

    render(<DeleteBugDialog isOpen onClose={onClose} onConfirm={jest.fn()} bugTitle="x" />);
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
