import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateBugModal from "./CreateBugModal";

describe("CreateBugModal", () => {
  it("renders nothing when closed", () => {
    render(<CreateBugModal isOpen={false} onClose={jest.fn()} onSubmit={jest.fn()} />);
    expect(screen.queryByTestId("create-bug-modal")).not.toBeInTheDocument();
  });

  it("submits title, description and priority, defaulting status to Open", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();
    const user = userEvent.setup();

    render(<CreateBugModal isOpen onClose={onClose} onSubmit={onSubmit} />);

    await user.type(screen.getByTestId("bug-title-input"), "Login button broken");
    await user.type(screen.getByTestId("bug-description-input"), "Nothing happens on click");
    await user.selectOptions(screen.getByTestId("bug-priority-select"), "High");
    await user.click(screen.getByTestId("create-bug-submit"));

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Login button broken",
      description: "Nothing happens on click",
      priority: "High",
      status: "Open",
    });
    expect(onClose).toHaveBeenCalled();
  });

  it("does not submit when required fields are empty", async () => {
    const onSubmit = jest.fn();
    const user = userEvent.setup();

    render(<CreateBugModal isOpen onClose={jest.fn()} onSubmit={onSubmit} />);
    await user.click(screen.getByTestId("create-bug-submit"));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
