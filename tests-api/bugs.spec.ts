import { test, expect } from "@playwright/test";

test.describe("Health", () => {
  test("GET /health reports ok", async ({ request }) => {
    const res = await request.get("health");
    expect(res.ok()).toBeTruthy();
    expect(await res.json()).toEqual(
      expect.objectContaining({ status: "ok", version: expect.any(String) })
    );
  });
});

test.describe("Bug CRUD", () => {
  let bugId: number;

  test("POST /bugs creates a bug, defaulting status and priority", async ({ request }) => {
    const res = await request.post("bugs", {
      data: { title: `API test bug ${Date.now()}`, description: "Created by Playwright" },
    });

    expect(res.status()).toBe(201);
    const bug = await res.json();
    bugId = bug.id;

    expect(bug).toMatchObject({
      id: expect.any(Number),
      status: "Open",
      priority: "Medium",
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
  });

  test("POST /bugs rejects a missing title", async ({ request }) => {
    const res = await request.post("bugs", { data: { description: "no title" } });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toContain("title");
  });

  test("GET /bugs includes the created bug", async ({ request }) => {
    const res = await request.get("bugs");
    expect(res.ok()).toBeTruthy();
    const bugs = await res.json();
    expect(bugs.some((b: { id: number }) => b.id === bugId)).toBe(true);
  });

  test("GET /bugs/{id} returns that bug", async ({ request }) => {
    const res = await request.get(`bugs/${bugId}`);
    expect(res.ok()).toBeTruthy();
    expect((await res.json()).id).toBe(bugId);
  });

  test("GET /bugs/{id} returns 404 for an unknown id", async ({ request }) => {
    const res = await request.get("bugs/999999");
    expect(res.status()).toBe(404);
  });

  test("PUT /bugs/{id} updates the bug", async ({ request }) => {
    const res = await request.put(`bugs/${bugId}`, {
      data: {
        title: "Updated by Playwright",
        description: "Updated description",
        status: "In Progress",
        priority: "High",
      },
    });

    expect(res.ok()).toBeTruthy();
    expect(await res.json()).toMatchObject({
      id: bugId,
      title: "Updated by Playwright",
      status: "In Progress",
      priority: "High",
    });
  });

  test("POST /bugs/{id}/comments adds a comment", async ({ request }) => {
    const res = await request.post(`bugs/${bugId}/comments`, {
      data: { author: "Playwright", content: "Automated comment" },
    });

    expect(res.status()).toBe(201);
    expect(await res.json()).toMatchObject({
      bug_id: bugId,
      author: "Playwright",
      content: "Automated comment",
    });
  });

  test("GET /bugs/{id}/comments lists the comment", async ({ request }) => {
    const res = await request.get(`bugs/${bugId}/comments`);
    expect(res.ok()).toBeTruthy();
    const comments = await res.json();
    expect(comments).toHaveLength(1);
    expect(comments[0].content).toBe("Automated comment");
  });

  test("POST /bugs/{id}/comments rejects a missing author", async ({ request }) => {
    const res = await request.post(`bugs/${bugId}/comments`, { data: { content: "x" } });
    expect(res.status()).toBe(400);
  });

  test("DELETE /bugs/{id} removes the bug and its comments", async ({ request }) => {
    const del = await request.delete(`bugs/${bugId}`);
    expect(del.status()).toBe(204);

    expect((await request.get(`bugs/${bugId}`)).status()).toBe(404);
    expect((await request.get(`bugs/${bugId}/comments`)).status()).toBe(404);
  });
});

test.describe("Bulk delete", () => {
  test("DELETE /bugs wipes every bug and reports how many were removed", async ({ request }) => {
    await request.post("bugs", { data: { title: "bulk-1", description: "x" } });
    await request.post("bugs", { data: { title: "bulk-2", description: "x" } });

    const res = await request.delete("bugs");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.deleted).toBeGreaterThanOrEqual(2);

    expect(await (await request.get("bugs")).json()).toEqual([]);
  });
});
