import { describe, expect, it } from "vitest";
import {
  createGame,
  exportRun,
  hash,
  type Practice,
  replay,
  step,
} from "../src/model";

function act(practice: Practice, seed = 21) {
  const g = createGame(seed, true);
  for (let i = 0; i < 3; i++) step(g, { type: "teach", practice });
  step(g, { type: "crisis" });
  return g;
}
describe("age six learned actions", () => {
  it("learned inspection succeeds while waiting without the keeper comes home short", () => {
    const look = act("look");
    const wait = act("wait");
    expect(look.outcome?.action).toBe("look");
    expect(look.outcome?.success).toBe(true);
    expect(wait.outcome?.action).toBe("wait");
    expect(wait.outcome?.success).toBe(false);
    expect(wait.food).toBe(6);
    expect(wait.outcome?.cost).toContain("stored water");
  });
  it("counting and inspection both work with different consequences", () => {
    const count = act("count");
    const look = act("look");
    expect(count.outcome?.success).toBe(true);
    expect(look.outcome?.success).toBe(true);
    expect(count.outcome?.cost).not.toBe(look.outcome?.cost);
  });
  it("ways watched equally often leave her torn; the most watched way wins", () => {
    const g = createGame(21, true);
    step(g, { type: "teach", practice: "count" });
    step(g, { type: "teach", practice: "look" });
    step(g, { type: "teach", practice: "refuse" });
    step(g, { type: "crisis" });
    expect(g.outcome?.action).toBe("freeze");
    expect(g.outcome?.success).toBe(false);
    expect(g.outcome?.line).toContain("Maryam’s way and Yusuf’s way");
    expect(hash(replay(exportRun(g)))).toBe(hash(g));
    const leaning = createGame(21, true);
    step(leaning, { type: "teach", practice: "look" });
    step(leaning, { type: "teach", practice: "refuse" });
    step(leaning, { type: "teach", practice: "refuse" });
    step(leaning, { type: "crisis" });
    expect(leaning.outcome?.action).toBe("refuse");
    const unprepared = createGame(21, true);
    for (let i = 0; i < 3; i++) step(unprepared, { type: "work" });
    step(unprepared, { type: "crisis" });
    expect(unprepared.outcome?.action).toBe("try");
  });
  it("keeps the outcome hidden until movement finishes, then exports an exact replay", () => {
    const g = act("look");
    expect(g.phase).toBe("movement");
    step(g, { type: "reveal" });
    expect(g.phase).toBe("aftermath");
    const run = exportRun(g);
    expect(hash(replay(run))).toBe(hash(g));
  });
});
describe("complete upbringing", () => {
  it("finishes five chapters and carries lessons through monthly community steps", () => {
    const g = createGame(21, false);
    expect(g.age).toBe(3);
    for (let c = 0; c < 5; c++) {
      const practice: Practice =
        c === 1 || c >= 3 ? "look" : c === 2 ? "refuse" : "count";
      for (let i = 0; i < 3; i++) step(g, { type: "teach", practice });
      step(g, { type: "crisis" });
      step(g, { type: "reveal" });
      step(g, { type: "arrange", practice });
    }
    expect(g.phase).toBe("ending");
    expect(g.history).toHaveLength(5);
    expect(g.outcome?.success).toBe(true);
    expect(g.months).toBe(180);
    expect(g.child.now).toBeGreaterThan(14 * 365 * 1440);
    expect(hash(replay(exportRun(g)))).toBe(hash(g));
  });
  it("can lose the final day after relying on an absent keeper", () => {
    const g = createGame(23, false);
    for (let c = 0; c < 5; c++) {
      for (let i = 0; i < 3; i++) step(g, { type: "work" });
      step(g, { type: "crisis" });
      step(g, { type: "reveal" });
      step(g, { type: "arrange", practice: "wait" });
    }
    expect(g.phase).toBe("ending");
    expect(g.outcome?.success).toBe(false);
  });
  it("rejects changed export inputs and unavailable choices", () => {
    const g = createGame(1, true);
    expect(() => step(g, { type: "reveal" })).toThrow();
    const run = exportRun(g);
    run.seed = 2;
    expect(() => replay(run)).toThrow();
  });
});
it("holds disclosed crisis conditions through the last preparation", () => {
  const g = createGame(21, true);
  step(g, { type: "teach", practice: "wait" });
  step(g, { type: "teach", practice: "wait" });
  const shown = structuredClone(g.conditions);
  step(g, { type: "teach", practice: "wait" });
  expect(g.conditions).toEqual(shown);
});

it("current lessons can change the final action after a different gap companion", () => {
  function final(prep: Practice) {
    const g = createGame(22);
    for (let c = 0; c < 5; c++) {
      for (let i = 0; i < 3; i++)
        step(g, c < 4 ? { type: "work" } : { type: "teach", practice: prep });
      step(g, { type: "crisis" });
      step(g, { type: "reveal" });
      if (c < 4) step(g, { type: "arrange", practice: "look" });
    }
    return g.outcome?.action;
  }
  expect(final("count")).not.toBe(final("look"));
});
it("floors household stores and never freezes with only one practice", () => {
  const g = createGame(21, true);
  for (let i = 0; i < 3; i++) step(g, { type: "teach", practice: "wait" });
  step(g, { type: "crisis" });
  expect(g.outcome?.action).toBe("wait");
  expect(g.outcome?.line).toContain("did not fit");
  const hungry = createGame(24);
  for (let c = 0; c < 5; c++) {
    for (let i = 0; i < 3; i++)
      step(hungry, { type: "teach", practice: "count" });
    step(hungry, { type: "crisis" });
    step(hungry, { type: "reveal" });
    expect(hungry.food).toBeGreaterThanOrEqual(0);
    expect(hungry.repairs).toBeGreaterThanOrEqual(0);
    step(hungry, { type: "arrange", practice: "count" });
  }
});

it("no companion wins the final day on all four review seeds", () => {
  for (const practice of ["count", "look", "wait", "refuse"] as const) {
    const results = [21, 22, 23, 24].map((seed) => {
      const g = createGame(seed);
      for (let c = 0; c < 5; c++) {
        for (let i = 0; i < 3; i++) step(g, { type: "teach", practice });
        step(g, { type: "crisis" });
        step(g, { type: "reveal" });
        step(g, { type: "arrange", practice });
      }
      return g.outcome?.success;
    });
    expect(results).toContain(false);
  }
});
it("Yusuf cannot make water exist, and depleted well rope closes the upper path", () => {
  const g = createGame(23);
  g.chapter = 3;
  g.age = 14;
  g.repairs = 0;
  for (let i = 0; i < 3; i++) step(g, { type: "teach", practice: "look" });
  step(g, { type: "crisis" });
  step(g, { type: "reveal" });
  step(g, { type: "arrange", practice: "look" });
  expect(g.routeKnown).toBe(true);
  expect(g.conditions.seep).toBe(false);
});
it("yearbook recalls the lesson actually watched and records the result", () => {
  const g = createGame(21, true);
  step(g, { type: "teach", practice: "look" });
  step(g, { type: "work" });
  step(g, { type: "work" });
  step(g, { type: "crisis" });
  expect(g.outcome?.memory).toContain("checked the upper path");
  expect(g.outcome?.memory).not.toContain("lifted a cover");
  expect(g.outcome?.memory).toContain("enough today");
});
it("field work plus a single gap companion is not a universal final win", () => {
  for (const practice of ["count", "look", "wait", "refuse"] as const) {
    const wins = [21, 22, 23, 24].map((seed) => {
      const g = createGame(seed);
      for (let c = 0; c < 5; c++) {
        for (let i = 0; i < 3; i++) step(g, { type: "work" });
        step(g, { type: "crisis" });
        step(g, { type: "reveal" });
        step(g, { type: "arrange", practice });
      }
      return g.outcome?.success;
    });
    expect(wins).toContain(false);
  }
});

function upbringing(careful: boolean) {
  const g = createGame(21);
  const lessons: Practice[] = ["count", "look", "refuse", "refuse", "look"];
  for (let chapter = 0; chapter < 5; chapter++) {
    for (let i = 0; i < 3; i++)
      step(
        g,
        careful || chapter === 4
          ? { type: "teach", practice: lessons[chapter] ?? "look" }
          : { type: "work" },
      );
    step(g, { type: "crisis" });
    step(g, { type: "reveal" });
    step(g, { type: "arrange", practice: "look" });
  }
  return g;
}

it("earlier shortfalls can lose despite the same final learned inspection", () => {
  const careful = upbringing(true);
  const careless = upbringing(false);
  expect(careful.outcome?.action).toBe("look");
  expect(careless.outcome?.action).toBe("look");
  expect(careful.outcome?.success).toBe(true);
  expect(careless.outcome?.success).toBe(false);
  expect(careful.waterReserve).toBe(1);
  expect(careless.waterReserve).toBe(0);
  expect(careless.outcome?.cost).toContain("emergency store");
  expect(careless.outcome?.cost).toContain("At 10");
  expect(careless.outcome?.cost).toContain("Yusuf");
  expect(hash(replay(exportRun(careless)))).toBe(hash(careless));
});

it("yearbook repeats an unfit method's actual explanation rather than inventing an act", () => {
  const g = createGame(21, true);
  for (let i = 0; i < 3; i++) step(g, { type: "teach", practice: "wait" });
  step(g, { type: "crisis" });
  expect(g.outcome?.memory).toContain(g.outcome?.line);
});

it("replay rejects an older rule edition even when its hash is otherwise valid", () => {
  const run = exportRun(createGame(21));
  const older = { ...run, edition: 2 };
  expect(() => replay(older as typeof run)).toThrow("original game version");
});

it("preserved emergency water allows both counting and inspection to complete delivery", () => {
  for (const finalPractice of ["count", "look"] as const) {
    const g = createGame(22);
    const earlier: Practice[] = ["count", "look", "refuse", "look"];
    for (let chapter = 0; chapter < 5; chapter++) {
      const practice = earlier[chapter] ?? finalPractice;
      for (let i = 0; i < 3; i++) step(g, { type: "teach", practice });
      step(g, { type: "crisis" });
      step(g, { type: "reveal" });
      step(g, { type: "arrange", practice });
    }
    expect(g.outcome?.action).toBe(finalPractice);
    expect(g.outcome?.success).toBe(true);
    expect(g.waterReserve).toBe(1);
    expect(g.outcome?.cost).toContain("while the carriers return");
  }
});

it("failed final routes show undelivered households rather than completed deliveries", () => {
  for (const practice of ["count", "look"] as const) {
    const g = createGame(22);
    g.age = 18;
    g.conditions.seep = practice === "count";
    for (let i = 0; i < 3; i++) step(g, { type: "teach", practice });
    step(g, { type: "crisis" });
    expect(g.outcome?.success).toBe(false);
    expect(g.outcome?.movement).toContain("last households still wait");
  }
});

it("an exhausted emergency store does not claim Elif divided stored water", () => {
  const g = createGame(22);
  g.age = 18;
  g.waterReserve = 0;
  g.conditions.variant = 2;
  for (let i = 0; i < 3; i++) step(g, { type: "teach", practice: "count" });
  step(g, { type: "crisis" });
  expect(g.outcome?.action).toBe("count");
  expect(g.outcome?.line).not.toContain("divided our stored water");
  expect(g.outcome?.memory).toContain(g.outcome?.line);
});

it("a failed early errand cannot spend emergency water after the store is empty", () => {
  const g = createGame(21, true);
  g.waterReserve = 0;
  for (let i = 0; i < 3; i++) step(g, { type: "teach", practice: "wait" });
  step(g, { type: "crisis" });
  expect(g.outcome?.success).toBe(false);
  expect(g.outcome?.cost).toContain("no stored water left");
  expect(g.outcome?.cost).not.toContain("uses its stored water");
});
