import { render, screen } from "@testing-library/react";
import { StatusBadge, PriorityBadge } from "./Badge";

describe("Badge", () => {
  it("renders the given status label", () => {
    render(<StatusBadge status="In Progress" />);
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  it("renders the given priority label", () => {
    render(<PriorityBadge priority="High" />);
    expect(screen.getByText("High")).toBeInTheDocument();
  });
});
