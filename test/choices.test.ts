import { expect, it } from "vitest";
import { preparationChoices } from "../src/choices";
import { createGame, exportRun, practices, replay, step } from "../src/model";

it("gives all five choices a different description at every age", () => {
  const game = createGame(21);
  const descriptions = Array.from({ length: 5 }, () => new Set<string>());
  for (let chapter = 0; chapter < 5; chapter++) {
    const before = JSON.stringify(exportRun(game));
    const choices = preparationChoices(game);
    expect(choices).toHaveLength(5);
    choices.forEach((choice, i) => {
      descriptions[i]?.add(choice.detail);
    });
    expect(JSON.stringify(exportRun(game))).toBe(before);
    expect(preparationChoices(replay(exportRun(game)))).toEqual(choices);
    for (let i = 0; i < 3; i++) step(game, { type: "work" });
    step(game, { type: "crisis" });
    step(game, { type: "reveal" });
    step(game, { type: "arrange", practice: "count" });
  }
  for (const seen of descriptions) expect(seen.size).toBe(5);
});

it("distinguishes a first demonstration from one she has already witnessed", () => {
  for (const practice of practices) {
    const game = createGame(21);
    const before = preparationChoices(game);
    step(game, { type: "teach", practice });
    const after = preparationChoices(game);
    const index = practices.indexOf(practice);
    expect(after[index]?.detail).not.toBe(before[index]?.detail);
    expect(after[index]?.detail).toContain("again");
    for (const other of practices.filter((p) => p !== practice)) {
      expect(after[practices.indexOf(other)]).toEqual(
        before[practices.indexOf(other)],
      );
    }
    expect(after[4]?.detail).toContain(
      practice === "refuse"
        ? "you"
        : { count: "Maryam", look: "Yusuf", wait: "Danyal" }[practice],
    );
  }
});
