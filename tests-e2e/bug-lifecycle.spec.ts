import { test, expect } from "@playwright/test";

test("create a bug, view it, then delete it", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const title = `E2E bug ${Date.now()}`;

  await page.getByTestId("open-create-bug-modal").click();
  await page.getByTestId("create-bug-modal").waitFor();

  await page.getByTestId("bug-title-input").fill(title);
  await page.getByTestId("bug-description-input").fill("Created by the E2E suite");
  await page.getByTestId("bug-priority-select").selectOption("Medium");
  await page.getByTestId("create-bug-submit").click();

  const card = page.getByTestId("kanban-board").getByRole("link", { name: title });
  await expect(card).toBeVisible();

  await card.click();
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(page.getByText("Created by the E2E suite")).toBeVisible();

  await page.getByRole("button", { name: "Delete" }).click();
  await page.getByTestId("delete-bug-modal").waitFor();
  await page.getByTestId("confirm-delete-button").click();

  await page.waitForURL("/");
  await expect(page.getByRole("link", { name: title })).toHaveCount(0);
});

test("add a comment to a bug", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const title = `Bug for comment ${Date.now()}`;

  await page.getByTestId("open-create-bug-modal").click();
  await page.getByTestId("bug-title-input").fill(title);
  await page.getByTestId("bug-description-input").fill("This bug needs a comment");
  await page.getByTestId("create-bug-submit").click();

  await page.getByTestId("kanban-board").getByRole("link", { name: title }).click();
  await page.getByTestId("comment-form").waitFor();

  const commentText = `Test comment ${Math.random().toString(36).slice(2)}`;
  await page.getByTestId("comment-author-input").fill("E2E User");
  await page.getByTestId("comment-content-input").fill(commentText);
  await page.getByTestId("comment-submit").click();

  await expect(page.getByText(commentText)).toBeVisible();
});

test("edit a bug's title, description, status and priority", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const title = `Bug to edit ${Date.now()}`;

  await page.getByTestId("open-create-bug-modal").click();
  await page.getByTestId("bug-title-input").fill(title);
  await page.getByTestId("bug-description-input").fill("This bug will be edited");
  await page.getByTestId("bug-priority-select").selectOption("Low");
  await page.getByTestId("create-bug-submit").click();

  await page.getByTestId("kanban-board").getByRole("link", { name: title }).click();
  await expect(page.getByRole("heading", { name: title })).toBeVisible();

  await page.getByRole("button", { name: "Edit" }).click();
  await page.getByTestId("edit-bug-form").waitFor();

  const editedTitle = `Edited title ${Date.now()}`;
  const modal = page.getByTestId("edit-bug-modal");
  await modal.locator('input[type="text"]').fill(editedTitle);
  await modal.locator("textarea").fill("This bug has been edited");
  await modal.locator("select").nth(0).selectOption("Resolved"); // status
  await modal.locator("select").nth(1).selectOption("High"); // priority
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByRole("heading", { name: editedTitle })).toBeVisible();
  await expect(page.getByText("This bug has been edited")).toBeVisible();
  await expect(page.getByText("Resolved")).toBeVisible();
  await expect(page.getByText("High")).toBeVisible();
});
