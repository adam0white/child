import "./style.css";
import { foodStatus, preparationChoices, preparationProgress } from "./choices";
import { initLab } from "./lab";
import {
  chapterGoals,
  conditionsText,
  createGame,
  endingReason,
  exportRun,
  type Input,
  type Practice,
  practices,
  replay,
  step,
  teachers,
} from "./model";
import { createRenderer } from "./render";

const app = document.querySelector<HTMLElement>("#app");
if (!app) throw Error("Page is missing.");
const labMode = new URLSearchParams(location.search).get("lab") === "1";
const slice =
  new URLSearchParams(location.search).get("slice") === "6" && labMode;
let game = createGame(21, slice);
let saveWarning = "";
if (!slice) {
  try {
    const saved = localStorage.getItem("child-run");
    if (saved) game = replay(JSON.parse(saved));
  } catch {
    saveWarning = "The old page could not be read. A new upbringing has begun.";
  }
}
const lab = initLab(() => exportRun(game));
let timer: ReturnType<typeof setTimeout> | undefined;
const header = document.createElement("header");
header.className = "masthead";
header.innerHTML =
  '<a href="https://human.adamwhite.work">A HUMAN FRAMEWORK GAME</a><button type="button">Menu</button>';
const top = document.createElement("div");
top.className = "topline";
const scene = document.createElement("div");
scene.className = "scene";
scene.setAttribute("role", "img");
scene.setAttribute("aria-label", "Elif and the paths around the village well.");
const story = document.createElement("section");
story.className = "story";
story.setAttribute("aria-live", "polite");
const choices = document.createElement("div");
choices.className = "choices";
const status = document.createElement("p");
status.className = "status";
app.append(header, top, scene, story, choices, status);
const renderer = await createRenderer(
  scene,
  labMode && new URLSearchParams(location.search).get("canvas") === "1",
);
function button(title: string, detail: string, fn: () => void) {
  const b = document.createElement("button");
  b.type = "button";
  const strong = document.createElement("strong");
  strong.textContent = title;
  const span = document.createElement("span");
  span.textContent = detail;
  b.append(strong, span);
  b.onclick = fn;
  choices.append(b);
}
function save() {
  if (slice) return;
  try {
    const run = exportRun(game);
    localStorage.setItem("child-run", JSON.stringify(run));
    lab.captureSave(run);
    saveWarning = "";
  } catch {
    saveWarning =
      "This device could not save the page. Keep the game open to finish.";
  }
}
function scheduleReveal() {
  clearTimeout(timer);
  timer = setTimeout(
    () => {
      if (!menu.open) dispatch({ type: "reveal" });
    },
    matchMedia("(prefers-reduced-motion: reduce)").matches ? 2000 : 4000,
  );
}
function dispatch(input: Input) {
  step(game, input);
  save();
  lab.event("choice", input.type);
  draw();
  if (game.phase === "movement") scheduleReveal();
}
const costs: Record<Practice, string> = {
  count: "She counts jars. Maryam leaves meal work undone.",
  look: "She checks a path. Yusuf leaves field work undone.",
  wait: "She waits with Danyal. Work on the well rope is delayed.",
  refuse: "You keep a jar for home. Staying home uses food stores.",
};
function draw() {
  top.textContent = `WHAT THE CHILD SAW · ELIF AT ${game.age}`;
  renderer.update({
    age: game.age,
    chapter: game.chapter,
    phase: game.phase,
    action: game.outcome?.action ?? null,
    available: game.conditions.available,
    flood: game.conditions.flood,
    food: game.food,
    repairs: game.repairs,
  });
  choices.replaceChildren();
  story.replaceChildren();
  const h = document.createElement("h1"),
    p = document.createElement("p");
  story.append(h, p);
  if (game.phase === "prepare") {
    h.textContent =
      game.preparations === 0
        ? "She watches your hands."
        : game.preparations === 3
          ? "Now she goes alone."
          : "One ordinary afternoon.";
    p.textContent = game.lastLesson;
    const progress = document.createElement("p");
    progress.className = "preparation-progress";
    progress.textContent =
      game.preparations === 0
        ? "Choose work for three afternoons. Then she goes alone. She uses the way she has watched most often, counting the task that stayed with her from the years before. If two ways are tied, she cannot choose between them."
        : preparationProgress(game.preparations);
    story.append(progress);
    if (game.preparations === 0) {
      const goal = document.createElement("p");
      goal.textContent = chapterGoals[game.age] ?? "";
      story.append(goal);
    }
    const c = document.createElement("p");
    c.className = "conditions";
    c.textContent = conditionsText(game);
    story.append(c);
    if (game.preparations < 3) {
      for (const choice of preparationChoices(game))
        button(choice.title, choice.detail, () => dispatch(choice.input));
    } else
      button("Let her go", "Watch what she does.", () =>
        dispatch({ type: "crisis" }),
      );
  } else if (game.phase === "movement") {
    h.textContent = "Watch Elif.";
    p.textContent = "";
    scene.setAttribute(
      "aria-label",
      game.outcome?.movement ?? "Elif moves toward the well.",
    );
  } else if (game.phase === "aftermath") {
    h.textContent = game.outcome?.success
      ? game.age === 6
        ? "She brought the water."
        : "She did what was needed."
      : "She came home short.";
    p.textContent = `“${game.outcome?.line}”`;
    const c = document.createElement("p");
    c.textContent = game.outcome?.cost ?? "";
    story.append(c);
    if (slice || game.chapter === 4)
      button("Close this page", "Keep what happened in her yearbook.", () =>
        dispatch({ type: "arrange", practice: "count" }),
      );
    else {
      const arrange = document.createElement("p");
      arrange.textContent =
        "Who will she keep working beside through the coming years?";
      story.append(arrange);
      for (const practice of practices)
        button(
          practice === "refuse"
            ? "Keep working with you"
            : `Keep working with ${teachers[practice]}`,
          costs[practice],
          () => dispatch({ type: "arrange", practice }),
        );
    }
  } else {
    h.textContent = game.outcome?.success
      ? slice
        ? "The household has water."
        : "Every household has water."
      : slice
        ? "Tonight they use the water stored at home."
        : "The last households go without.";
    p.textContent = slice
      ? "This day stays in her yearbook."
      : "Elif is the adult on duty now. What she did came from the work she watched.";
    if (game.outcome) {
      const consequence = document.createElement("p");
      consequence.className = "ending-consequence";
      consequence.textContent = endingReason(game);
      story.append(consequence);
    }
    const journal = document.createElement("div");
    journal.className = "journal";
    for (const memory of game.history) {
      const row = document.createElement("p");
      row.textContent = `At ${memory.age}: “${memory.memory}”`;
      journal.append(row);
    }
    story.append(journal);
    button("Begin again", "Another upbringing can teach another way.", () => {
      game = createGame(game.seed + 1, slice);
      save();
      draw();
    });
  }
  status.textContent = `${saveWarning ? `${saveWarning} ` : ""}${foodStatus(game.food)} Emergency water: ${game.waterReserve} household ${game.waterReserve === 1 ? "share" : "shares"}. ${game.repairs <= 3 ? "The well rope needs work." : "The well rope is holding."}`;
}
const menu = document.createElement("dialog");
menu.className = "menu";
const menuTitle = document.createElement("h2");
menuTitle.textContent = "Take a moment.";
menu.append(menuTitle);
function menuButton(label: string, fn: () => void) {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = label;
  b.onclick = fn;
  menu.append(b);
}
menuButton("Resume", () => {
  menu.close();
  if (game.phase === "movement") scheduleReveal();
});
menuButton("Feedback", () => {
  lab.feedback();
});
const recording = document.createElement("button");
recording.type = "button";
function recordingLabel() {
  recording.textContent = `Recording: ${lab.recording() ? "on" : "off"}`;
  recording.setAttribute("aria-pressed", String(lab.recording()));
}
recordingLabel();
recording.onclick = () => {
  lab.setRecording(!lab.recording());
  recordingLabel();
};
menu.append(recording);
menuButton("Full screen", () => {
  void document.documentElement.requestFullscreen?.();
});
const all = document.createElement("a");
all.href = "https://human.adamwhite.work";
all.textContent = "All games";
menu.append(all);
menuButton("New game", () => {
  if (confirm("Start a new upbringing?")) {
    clearTimeout(timer);
    game = createGame(game.seed + 1, slice);
    save();
    menu.close();
    draw();
  }
});
if (labMode) {
  menuButton("Export playtest", () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([JSON.stringify(exportRun(game))], { type: "application/json" }),
    );
    a.download = "child-playtest.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });
  const file = document.createElement("input");
  file.type = "file";
  file.accept = ".json";
  file.setAttribute("aria-label", "Replay playtest");
  file.onchange = async () => {
    try {
      const f = file.files?.[0];
      if (f) {
        clearTimeout(timer);
        game = replay(JSON.parse(await f.text()));
        save();
        menu.close();
        draw();
        if (game.phase === "movement") scheduleReveal();
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "This run could not be read.");
    }
  };
  menu.append(file);
}
document.body.append(menu);
header.querySelector("button")?.addEventListener("click", () => {
  clearTimeout(timer);
  menu.showModal();
});
menu.addEventListener("cancel", () => {
  if (game.phase === "movement") scheduleReveal();
});
draw();
if (game.phase === "movement") scheduleReveal();
document.documentElement.dataset.ready = "true";
document.documentElement.dataset.renderer = renderer.kind;
window.addEventListener("pagehide", (event) => {
  if (event.persisted) {
    clearTimeout(timer);
    return;
  }
  clearTimeout(timer);
  renderer.destroy();
  lab.destroy();
});
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    draw();
    if (game.phase === "movement" && !menu.open) scheduleReveal();
  }
});
