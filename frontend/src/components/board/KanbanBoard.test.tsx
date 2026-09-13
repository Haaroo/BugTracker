import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import KanbanBoard from "./KanbanBoard";
import { bugsApi } from "@/lib/api";
import { Bug } from "@/types/bug";

jest.mock("@/lib/api", () => ({
  bugsApi: {
    list: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

const mockedBugsApi = bugsApi as jest.Mocked<typeof bugsApi>;

const sampleBug: Bug = {
  id: 1,
  title: "Sample bug",
  description: "Something is broken",
  status: "Open",
  priority: "High",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

describe("KanbanBoard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedBugsApi.list.mockResolvedValue([sampleBug]);
  });

  it("loads and displays bugs grouped by status", async () => {
    render(<KanbanBoard />);

    await waitFor(() => expect(mockedBugsApi.list).toHaveBeenCalled());
    expect(await screen.findByText("Sample bug")).toBeInTheDocument();
    expect(screen.getByTestId("status-column-open")).toBeInTheDocument();
  });

  it("shows an error message when loading fails", async () => {
    mockedBugsApi.list.mockRejectedValueOnce(new Error("network down"));
    render(<KanbanBoard />);

    expect(await screen.findByText(/couldn't load bugs/i)).toBeInTheDocument();
  });

  it("opens the create bug modal", async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />);

    await screen.findByText("Sample bug");
    await user.click(screen.getByTestId("open-create-bug-modal"));

    expect(screen.getByTestId("create-bug-modal")).toBeInTheDocument();
  });
});
