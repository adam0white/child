import { expect, test } from "@playwright/test";

test("conditions precede every lesson, movement lasts four seconds, and the yearbook recalls a lesson", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?lab=1&slice=6");
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  const notice = page.getByRole("complementary", { name: "Play recording" });
  if (await notice.isVisible())
    await notice.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByRole("button", { name: /Stay home with you/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Work in the field/ }),
  ).toContainText("food stores and mend the well rope");
  await expect(
    page.getByRole("button", { name: /Stay with Zehra/ }),
  ).toHaveCount(0);
  for (let i = 0; i < 3; i++) {
    await expect(page.locator(".conditions")).toBeVisible();
    await page.getByRole("button", { name: /Go with Yusuf/ }).click();
  }
  await expect(page.locator(".conditions")).toBeVisible();
  await page.clock.install();
  await page.getByRole("button", { name: /Let her go/ }).click();
  await page.clock.runFor(3900);
  await expect(
    page.getByRole("heading", { name: "Watch Elif." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Close this page/ }),
  ).toHaveCount(0);
  await page.clock.runFor(100);
  await expect(
    page.getByRole("heading", { name: "She brought the water." }),
  ).toBeVisible();
  const aftermathLine = await page.locator(".story > p").first().textContent();
  const aftermathCost = await page.locator(".story > p").nth(1).textContent();
  await page.getByRole("button", { name: /Close this page/ }).click();
  const memory = page.locator(".journal p");
  await expect(memory).toContainText("At 6:");
  await expect(memory).toContainText("Yusuf");
  await expect(memory).not.toContainText(aftermathLine ?? "missing line");
  await expect(memory).not.toContainText(aftermathCost ?? "missing cost");
});

test("age-six preparation, movement, success and shortfall", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
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
  await expect(
    page.getByText(/I tried Danyal’s way. It did not fit today/),
  ).toBeVisible();
});
test("full upbringing reaches an ending, saves, and exports a replay", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?lab=1");
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  const notice = page.getByRole("complementary", { name: "Play recording" });
  if (await notice.isVisible())
    await notice.getByRole("button", { name: "Continue", exact: true }).click();
  const descriptions = Array.from({ length: 5 }, () => new Set<string>());
  for (let c = 0; c < 5; c++) {
    const details = await page
      .locator(".choices button span")
      .allTextContents();
    expect(details).toHaveLength(5);
    details.forEach((detail, i) => {
      descriptions[i]?.add(detail);
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const name = c === 1 || c >= 3 ? "Yusuf" : c === 2 ? "Zehra" : "Maryam";
    const choice =
      name === "Zehra" ? /Stay home with you/ : new RegExp(`Go with ${name}`);
    for (let i = 0; i < 3; i++) {
      await page.getByRole("button", { name: choice }).click();
      if (i === 0)
        await expect(page.getByRole("button", { name: choice })).toContainText(
          "again",
        );
    }
    await page.getByRole("button", { name: /Let her go/ }).click();
    await expect(
      page.getByRole("heading", { name: "Watch Elif." }),
    ).toBeVisible();
    if (c < 4)
      await page
        .getByRole("button", {
          name:
            name === "Zehra"
              ? /Keep working with you/
              : new RegExp(`Keep working with ${name}`),
        })
        .click();
    else await page.getByRole("button", { name: /Close this page/ }).click();
  }
  for (const seen of descriptions) expect(seen.size).toBe(5);
  await expect(
    page.getByRole("heading", {
      name: /Every household has water\.|The last households go without\./,
    }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", {
      name: /Every household has water\.|The last households go without\./,
    }),
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
  await page.emulateMedia({ reducedMotion: "reduce" });
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
