import { bugsApi, commentsApi } from "./api";
import { ApiError } from "./http";

function mockFetchOnce(body: unknown, init: Partial<Response> = {}) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => body,
    ...init,
  }) as jest.Mock;
}

describe("bugsApi", () => {
  afterEach(() => jest.resetAllMocks());

  it("list() calls GET /api/bugs", async () => {
    mockFetchOnce([{ id: 1 }]);
    const bugs = await bugsApi.list();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/bugs"),
      expect.objectContaining({ headers: expect.any(Object) })
    );
    expect(bugs).toEqual([{ id: 1 }]);
  });

  it("create() POSTs the input as JSON", async () => {
    mockFetchOnce({ id: 2, title: "New bug" });
    await bugsApi.create({ title: "New bug", description: "desc" });

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body)).toEqual({ title: "New bug", description: "desc" });
  });

  it("throws an ApiError with the server's message on failure", async () => {
    mockFetchOnce(
      { error: "title is required" },
      { ok: false, status: 400 }
    );

    await expect(bugsApi.create({ title: "", description: "" })).rejects.toMatchObject({
      message: "title is required",
      status: 400,
    });
  });

  it("throws a generic ApiError when the error body isn't JSON", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error("not json");
      },
    }) as jest.Mock;

    await expect(bugsApi.list()).rejects.toBeInstanceOf(ApiError);
  });
});

describe("commentsApi", () => {
  afterEach(() => jest.resetAllMocks());

  it("create() POSTs to the bug's comments endpoint", async () => {
    mockFetchOnce({ id: 1, author: "Emma", content: "hi" });
    await commentsApi.create(5, { author: "Emma", content: "hi" });

    const [url] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toContain("/api/bugs/5/comments");
  });
});
