import { gunzipSync } from "node:zlib";
import { expect, type Page, test } from "@playwright/test";

async function beginAtSix(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByText("Other ways to begin", { exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", { name: "Begin at age six", exact: true })
    .click();
}

test.beforeEach(async ({ page }) => {
  const notice = page.getByRole("complementary", { name: "Play recording" });
  await page.addLocatorHandler(notice, async () => {
    await notice.getByRole("button", { name: "Continue", exact: true }).click();
  });
});

test("conditions precede every lesson, movement lasts four seconds, and the yearbook recalls a lesson", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await beginAtSix(page);
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  const notice = page.getByRole("complementary", { name: "Play recording" });
  if (await notice.isVisible())
    await notice.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByRole("button", { name: /Stay home with you/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Work in the field/ }),
  ).toContainText("food to the stores and mend the well rope");
  await expect(
    page.getByRole("button", { name: /Stay with Zehra/ }),
  ).toHaveCount(0);
  for (let i = 0; i < 3; i++) {
    await expect(page.locator(".conditions")).toBeVisible();
    await page.getByRole("button", { name: /Go with Yusuf/ }).click();
  }
  await expect(page.locator(".conditions")).toBeVisible();
  await page.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
  await page.clock.pauseAt(new Date("2026-01-01T00:00:01Z"));
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
  await expect(page.locator(".ending-consequence")).toContainText("Yusuf");
  await expect(page.locator(".ending-consequence")).toContainText(
    aftermathCost ?? "missing cost",
  );
  await expect(memory).not.toContainText(aftermathLine ?? "missing line");
  await expect(memory).not.toContainText(aftermathCost ?? "missing cost");
});

test("age-six preparation, movement, success and shortfall", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await beginAtSix(page);
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  const notice = page.getByRole("complementary", { name: "Play recording" });
  if (await notice.isVisible())
    await notice.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Take a moment." }),
  ).not.toBeVisible();
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: /Go with Yusuf/ }).click();
  await expect(
    page.getByText(/Danyal will be away when she goes alone/),
  ).toBeVisible();
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
  await beginAtSix(page);
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
  await page.goto("/");
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
test("ordinary menu exposes public tools and keeps Canvas diagnostics collapsed", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Export playtest" }),
  ).toBeVisible();
  await expect(page.getByLabel("Replay playtest")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "New game", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Use Canvas renderer" }),
  ).not.toBeVisible();
  const privacy = await page
    .getByRole("link", { name: "Lab privacy" })
    .boundingBox();
  const debug = await page.getByText("Debug", { exact: true }).boundingBox();
  expect(Math.abs((privacy?.y ?? 0) - (debug?.y ?? 100))).toBeLessThan(20);
  await page.getByText("Debug", { exact: true }).click();
  await page.getByRole("button", { name: "Use Canvas renderer" }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-renderer",
    "canvas2d",
  );
});
test("importing a movement resumes, and cached navigation keeps the canvas", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await beginAtSix(page);
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

test("field work advances each afternoon and the third click sends her alone", async ({
  page,
}) => {
  await beginAtSix(page);
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  const notice = page.getByRole("complementary", { name: "Play recording" });
  if (await notice.isVisible())
    await notice.getByRole("button", { name: "Continue", exact: true }).click();
  for (let afternoon = 1; afternoon <= 3; afternoon++) {
    await page.getByRole("button", { name: /Work in the field/ }).click();
    await expect(page.locator(".preparation-progress")).toHaveText(
      `Afternoon ${afternoon} of 3 is finished.`,
    );
  }
  await expect(
    page.getByRole("heading", { name: "Now she goes alone." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Work in the field/ }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: /Let her go/ }).click();
  await expect(
    page.getByRole("heading", { name: "Watch Elif." }),
  ).toBeVisible();
});

test("repeated unsuitable raising leaves a visible final loss after earlier shortfalls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  const notice = page.getByRole("complementary", { name: "Play recording" });
  if (await notice.isVisible())
    await notice.getByRole("button", { name: "Continue", exact: true }).click();
  await page.clock.install();
  for (let chapter = 0; chapter < 5; chapter++) {
    for (let afternoon = 0; afternoon < 3; afternoon++)
      await page.getByRole("button", { name: /Go with Danyal/ }).click();
    if (chapter === 4)
      await expect(page.locator(".conditions")).toContainText(
        "0 household shares left",
      );
    await page.getByRole("button", { name: /Let her go/ }).click();
    await page.clock.runFor(2100);
    if (chapter < 4)
      await page
        .getByRole("button", { name: /Keep working with Danyal/ })
        .click();
    else await page.getByRole("button", { name: /Close this page/ }).click();
  }
  await expect(
    page.getByRole("heading", {
      name: "The last households go without.",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator(".ending-consequence")).toContainText("Danyal");
  await expect(page.locator(".ending-consequence")).toContainText(
    "emergency store is empty",
  );
  await expect(page.locator(".ending-consequence")).toContainText("At 3");
  await page.reload();
  await expect(
    page.getByRole("heading", {
      name: "The last households go without.",
      exact: true,
    }),
  ).toBeVisible();
});

test("age-six day preserves the full upbringing and New game returns to age three", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Go with Maryam/ }).click();
  const saved = await page.evaluate(() => localStorage.getItem("child-run"));
  await beginAtSix(page);
  await page.getByRole("button", { name: /Go with Yusuf/ }).click();
  expect(await page.evaluate(() => localStorage.getItem("child-run"))).toBe(
    saved,
  );
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "New game", exact: true }).click();
  await expect(page.locator(".topline")).toContainText("ELIF AT 3");
});

test("Feedback controls work while movement stays paused until Resume", async ({
  page,
}) => {
  const feedbackAttempts: string[] = [];
  await page.route("**/*", async (route) => {
    const request = route.request();
    if (["GET", "HEAD", "OPTIONS"].includes(request.method())) {
      await route.continue();
      return;
    }
    // Block every write, including automatic recording. Never fabricate a receipt.
    const url = new URL(request.url());
    if (url.pathname.endsWith("/run")) feedbackAttempts.push("run upload");
    if (url.pathname.endsWith("/linked")) {
      try {
        const body = request.postDataBuffer();
        const envelope = JSON.parse(
          gunzipSync(body ?? Buffer.alloc(0)).toString(),
        );
        if (envelope.kind === "note" || envelope.kind === "run")
          feedbackAttempts.push(`linked ${envelope.kind}`);
      } catch {
        feedbackAttempts.push("unreadable linked write");
      }
    }
    await route.abort();
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?labRunSource=agent");
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: /Go with Yusuf/ }).click();
  await page.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
  await page.clock.pauseAt(new Date("2026-01-01T00:00:01Z"));
  await page.getByRole("button", { name: /Let her go/ }).click();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.getByRole("button", { name: "Feedback", exact: true }).click();
  const feedback = page.getByRole("dialog", { name: "Feedback" });
  for (const name of ["I'm stopping", "I'm confused"]) {
    const choice = feedback.getByRole("button", { name, exact: true });
    await expect(choice).toHaveAttribute("aria-pressed", "false");
    await choice.click();
    await expect(choice).toHaveAttribute("aria-pressed", "true");
  }
  await page.clock.runFor(5000);
  await expect(
    page.getByRole("heading", { name: "Watch Elif." }),
  ).toBeVisible();
  await feedback.getByRole("button", { name: "Not now", exact: true }).click();
  await expect(feedback).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Take a moment." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Feedback", exact: true }).click();
  await expect(feedback).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(feedback).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Take a moment." }),
  ).toBeVisible();
  await page.clock.runFor(5000);
  await expect(
    page.getByRole("heading", { name: "Watch Elif." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page.clock.runFor(4000);
  await expect(
    page.getByRole("heading", {
      name: /She did what was needed\.|She came home short\./,
    }),
  ).toBeVisible();
  expect(feedbackAttempts).toEqual([]);
});
