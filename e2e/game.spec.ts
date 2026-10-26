import { expect, test } from "@playwright/test";

test("age-six preparation, movement, success and shortfall", async ({
  page,
}) => {
  await page.goto("/?lab=1&slice=6");
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  const notice = page.getByRole("complementary", { name: "Play recording" });
  if (await notice.isVisible())
    await notice.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Take a moment." }),
  ).not.toBeVisible();
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: /Go with Yusuf/ }).click();
  await expect(page.getByText(/Danyal is away today/)).toBeVisible();
  await page.getByRole("button", { name: /Let her go/ }).click();
  await expect(
    page.getByRole("heading", { name: "Watch Elif." }),
  ).toBeVisible();
  await expect(page.getByText(/I checked the stones/)).not.toBeVisible();
  await expect(
    page.getByRole("heading", { name: "She brought the water." }),
  ).toBeVisible();
  await expect(page.getByText(/longer walk/)).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.reload();
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: /Go with Danyal/ }).click();
  await page.getByRole("button", { name: /Let her go/ }).click();
  await expect(
    page.getByRole("heading", { name: "She came home short." }),
  ).toBeVisible();
  await expect(page.getByText(/Nobody came before dusk/)).toBeVisible();
});
test("full upbringing reaches an ending, saves, and exports a replay", async ({
  page,
}) => {
  await page.goto("/?lab=1");
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  const notice = page.getByRole("complementary", { name: "Play recording" });
  if (await notice.isVisible())
    await notice.getByRole("button", { name: "Continue", exact: true }).click();
  for (let c = 0; c < 5; c++) {
    const name = c === 1 || c >= 3 ? "Yusuf" : c === 2 ? "Zehra" : "Maryam";
    const choice =
      name === "Zehra" ? /Stay with Zehra/ : new RegExp(`Go with ${name}`);
    for (let i = 0; i < 3; i++)
      await page.getByRole("button", { name: choice }).click();
    await page.getByRole("button", { name: /Let her go/ }).click();
    await expect(
      page.getByRole("heading", { name: "Watch Elif." }),
    ).toBeVisible();
    if (c < 4)
      await page
        .getByRole("button", { name: new RegExp(`Keep working with ${name}`) })
        .click();
    else await page.getByRole("button", { name: /Close this page/ }).click();
  }
  await expect(
    page.getByRole("heading", { name: "Every household has water." }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Every household has water." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export playtest" }).click();
  expect((await download).suggestedFilename()).toBe("child-playtest.json");
  await page.getByRole("button", { name: "Feedback", exact: true }).click();
  await expect(page.getByText("I'm stopping", { exact: true })).toBeVisible();
  await expect(page.getByText("I'm confused", { exact: true })).toBeVisible();
});
test("Canvas fallback renders and ordinary play hides lab tools", async ({
  page,
}) => {
  await page.goto("/?lab=1&canvas=1&slice=6");
  await expect(page.locator("html")).toHaveAttribute(
    "data-renderer",
    "canvas2d",
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Export playtest" }),
  ).toHaveCount(0);
});
test("importing a movement resumes, and cached navigation keeps the canvas", async ({
  page,
}) => {
  await page.goto("/?lab=1&slice=6");
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  const notice = page.getByRole("complementary", { name: "Play recording" });
  if (await notice.isVisible())
    await notice.getByRole("button", { name: "Continue", exact: true }).click();
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: /Go with Yusuf/ }).click();
  await page.getByRole("button", { name: /Let her go/ }).click();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export playtest" }).click();
  const path = await (await downloaded).path();
  await page.reload();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByLabel("Replay playtest").setInputFiles(path);
  await expect(
    page.getByRole("heading", { name: "She brought the water." }),
  ).toBeVisible();
  await page.evaluate(() =>
    window.dispatchEvent(
      new PageTransitionEvent("pagehide", { persisted: true }),
    ),
  );
  await expect(page.locator(".scene canvas")).toBeAttached();
});
