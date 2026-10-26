import {
  type Affordance,
  type Community,
  clearMethodContext,
  createCommunity,
  createPerson,
  DAYS_PER_YEAR,
  decide,
  demonstrateMethod,
  liveCommunity,
  type MethodCue,
  MINUTES_PER_DAY,
  type Person,
  receiveMethodCues,
  type Traits,
} from "@adam0white/human-framework";
export const practices = ["count", "look", "wait", "refuse"] as const;
export type Practice = (typeof practices)[number];
export type Input =
  | { type: "teach"; practice: Practice }
  | { type: "work" }
  | { type: "crisis" }
  | { type: "reveal" }
  | { type: "arrange"; practice: Practice };
export type Phase = "prepare" | "movement" | "aftermath" | "ending";
export interface Conditions {
  available: boolean;
  flood: boolean;
  conflict: boolean;
  seep: boolean;
  pressure: boolean;
  variant: number;
}
export interface Outcome {
  age: number;
  action: string;
  success: boolean;
  line: string;
  cost: string;
  movement: string;
}
export interface Game {
  edition: 1;
  seed: number;
  slice: boolean;
  chapter: number;
  age: number;
  phase: Phase;
  preparations: number;
  food: number;
  repairs: number;
  routeKnown: boolean;
  community: Community;
  child: Person;
  inputs: Input[];
  conditions: Conditions;
  outcome: Outcome | null;
  history: Outcome[];
  lastLesson: string;
  months: number;
}
export const teachers: Record<Practice, string> = {
  count: "Maryam",
  look: "Yusuf",
  wait: "Danyal",
  refuse: "Zehra",
};
const YEAR = DAYS_PER_YEAR * MINUTES_PER_DAY;
const cueFor: Record<Practice, MethodCue> = {
  count: { cue: "supply", value: "scarce" },
  look: { cue: "route", value: "uncertain" },
  wait: { cue: "keeper", value: "needed" },
  refuse: { cue: "pressure", value: "repeated" },
};
const baselineTraits: Traits = {
  honesty: 0.5,
  emotionality: 0.5,
  extraversion: 0.5,
  agreeableness: 0.5,
  conscientiousness: 0.5,
  openness: 0.5,
};
const profiles: Record<string, Traits> = {
  Zehra: { ...baselineTraits },
  Yusuf: {
    honesty: 0.75,
    emotionality: 0.4,
    extraversion: 0.5,
    agreeableness: 0.6,
    conscientiousness: 0.85,
    openness: 0.5,
  },
  Maryam: {
    honesty: 0.8,
    emotionality: 0.6,
    extraversion: 0.6,
    agreeableness: 0.8,
    conscientiousness: 0.8,
    openness: 0.4,
  },
  Danyal: {
    honesty: 0.9,
    emotionality: 0.4,
    extraversion: 0.4,
    agreeableness: 0.7,
    conscientiousness: 0.8,
    openness: 0.5,
  },
  Tariq: {
    honesty: 0.6,
    emotionality: 0.3,
    extraversion: 0.7,
    agreeableness: 0.6,
    conscientiousness: 0.5,
    openness: 0.7,
  },
};
export function createGame(seed = 21, slice = false): Game {
  const age = slice ? 6 : 3;
  const child = createPerson({
    id: "elif",
    name: "Elif",
    seed,
    now: 0,
    bornAt: -age * YEAR,
    sex: "female",
    traits: { ...baselineTraits },
    norms: [],
    voices: practices.map((p) => ({ voiceId: teachers[p], trust: 0.85 })),
    enable: { gists: true, yearbook: true },
  });
  const adults = [
    ["Zehra", 31],
    ["Yusuf", 34],
    ["Maryam", 68],
    ["Danyal", 52],
    ["Tariq", 16],
  ] as const;
  const people = adults.map(([name, years], i) =>
    createPerson({
      id: name,
      name,
      seed: seed + i + 1,
      traits: profiles[name],
      norms: [],
      now: 0,
      bornAt: -years * YEAR,
      sex: name === "Zehra" || name === "Maryam" ? "female" : "male",
    }),
  );
  const g: Game = {
    edition: 1,
    seed,
    slice,
    chapter: 0,
    age,
    phase: "prepare",
    preparations: 0,
    food: 9,
    repairs: 7,
    routeKnown: false,
    community: createCommunity([child, ...people]),
    child,
    inputs: [],
    conditions: {
      variant: 0,
      available: false,
      flood: false,
      conflict: false,
      seep: false,
      pressure: true,
    },
    outcome: null,
    history: [],
    lastLesson: slice
      ? "You are Zehra. Elif watches the work you choose. Soon she will fetch water alone."
      : "You are Zehra. Your daughter Elif copies the work she sees. Soon she must keep an evening jar for home.",
    months: 0,
  };
  refresh(g);
  return g;
}
function refresh(g: Game) {
  g.conditions = {
    variant: (g.seed + g.chapter + Math.max(0, 5 - g.repairs)) % 3,
    available: (g.seed + g.chapter + Math.max(0, 4 - g.repairs)) % 3 !== 0,
    flood: (g.seed + g.chapter) % 2 === 1,
    conflict: (g.seed + g.chapter) % 2 === 1,
    seep: g.food <= 2 || g.routeKnown || (g.seed + g.repairs) % 2 === 0,
    pressure: true,
  };
}
function teach(g: Game, practice: Practice, id: string) {
  const cues = [cueFor[practice]];
  if (!receiveMethodCues(g.child, { contextId: "work", cues }))
    throw Error("Elif cannot attend this lesson.");
  if (
    !demonstrateMethod(g.child, {
      id: practice,
      demonstrationId: id,
      contextId: "work",
      conditions: cues,
      action: practice,
      sourceId: teachers[practice],
      attention: 1,
      outcome: "success",
    })
  )
    throw Error("This lesson could not be received.");
  clearMethodContext(g.child);
}
export const lessonLines: Record<Practice, string[]> = {
  count: [
    "Maryam sets aside a jar for each house. Elif moves the empty cups into a row.",
    "Elif counts the filled jars again before Maryam shares the last one.",
    "Maryam divides the grain. Elif leaves a small pile beside each bowl.",
  ],
  look: [
    "Yusuf checks the upper path before carrying water. Elif follows his footprints.",
    "Elif stops beside Yusuf and touches the dry stones above the flooded path.",
    "Yusuf lifts a loose cover. Elif leans down to see the reserve beneath it.",
  ],
  wait: [
    "Danyal waits for the keeper before opening a heavy gate. Elif sits beside him.",
    "Elif puts down her jar where Danyal puts his. They wait for the well to clear.",
    "Danyal asks who is on duty. Elif looks for the keeper before lifting the rope.",
  ],
  refuse: [
    "You keep the evening jar when a neighbour asks again. Elif places her hand across its lid.",
    "You say the household needs this grain. Elif pulls its bowl back from the edge.",
    "A neighbour pushes forward. You hold your place. Elif stands beside your elbow.",
  ],
};
export function step(g: Game, input: Input): void {
  if (
    g.phase === "prepare" &&
    (input.type === "teach" || input.type === "work") &&
    g.preparations < 3
  ) {
    if (input.type === "teach") {
      teach(g, input.practice, `scene-${g.chapter}-${g.preparations}`);
      const base = lessonLines[input.practice][g.preparations % 3] ?? "";
      const growing: Record<number, string[]> = {
        3: [
          "Elif reaches for the smallest cup.",
          "She copies the adult’s hands.",
          "She carries a jar against her chest.",
        ],
        6: [
          "Elif tries the task without a hand on her shoulder.",
          "She checks her own work before looking up.",
          "She takes the first steps home alone.",
        ],
        10: [
          "Elif shows Tariq what she noticed.",
          "She asks who will be on duty tomorrow.",
          "She makes room for another child beside her.",
        ],
        14: [
          "Elif takes over while the adult rests.",
          "She works out what the waiting families need.",
          "She leaves the next household a clear place.",
        ],
        18: [
          "Elif watches the queue while the adult works.",
          "She puts a spare jar beside the well.",
          "She checks who has yet to receive water.",
        ],
      };
      g.lastLesson = `${base} ${growing[g.age]?.[g.preparations] ?? ""}`;
      if (input.practice === "count" || input.practice === "refuse")
        g.food -= 2;
      if (input.practice === "look") {
        g.food -= 1;
        g.routeKnown = true;
      }
      if (input.practice === "wait") g.repairs -= 2;
    } else {
      g.food += 2;
      g.repairs += 1;
      g.lastLesson =
        "You work in the field. Elif plays with an empty jar. No adult shows her a new way today.";
    }
    g.preparations++;
  } else if (
    input.type === "crisis" &&
    g.phase === "prepare" &&
    g.preparations === 3
  ) {
    resolve(g);
    g.phase = "movement";
  } else if (input.type === "reveal" && g.phase === "movement") {
    g.phase = "aftermath";
    if (g.outcome) g.history.push({ ...g.outcome });
  } else if (input.type === "arrange" && g.phase === "aftermath") {
    if (g.slice || g.chapter === 4) g.phase = "ending";
    else nextChapter(g, input.practice);
  } else throw Error("That choice is not available now.");
  g.inputs.push({ ...input });
}
function resolve(g: Game) {
  const variant = g.conditions.variant;
  const canCount =
    g.age === 10
      ? variant !== 1
      : g.age === 18
        ? !g.conditions.seep || g.food > 2
        : true;
  const canLook =
    g.age === 10 ? variant === 1 : g.age >= 14 ? g.conditions.seep : true;
  const hasPressure = g.age === 14 ? !g.conditions.seep : true;
  const cues: MethodCue[] = [
    { cue: "supply", value: canCount ? "scarce" : "contested" },
    { cue: "route", value: canLook ? "uncertain" : "blocked" },
    cueFor.wait,
    { cue: "pressure", value: hasPressure ? "repeated" : "settled" },
    {
      cue: "availability",
      value: g.conditions.available ? "present" : "absent",
    },
  ];
  if (g.conditions.conflict)
    cues.push({ cue: "conflict", value: "stop-or-go" });
  receiveMethodCues(g.child, { contextId: "crisis", cues });
  const held = practices.filter((a) =>
    g.child.methods?.rules.some((r) => r.action === a),
  );
  const offers: Affordance[] = held.map((action) => ({
    id: action,
    action,
    label: action,
    duration: 1,
    effort: 0.01,
    advertises: {},
    methodContext: "crisis",
  }));
  if (g.conditions.conflict)
    offers.push({
      id: "freeze",
      action: "freeze",
      label: "Stay between the two paths.",
      duration: 1,
      effort: 0,
      advertises: {},
    });
  if (!offers.length)
    offers.push({
      id: "try",
      action: "try",
      label: "Try without a plan.",
      duration: 1,
      effort: 0,
      advertises: {},
    });
  const d = decide(g.child, offers);
  const action = d.chosenAction ?? "freeze";
  let success = false;
  let line =
    "I could not decide whether to stay or go. I came home with an empty jar.";
  let cost = "The household uses its reserve tonight.";
  let movement = "Elif stops between the path and the well.";
  if (g.age === 6 && action === "look") {
    success = true;
    line = "I checked the stones above the water. The upper path was dry.";
    cost = "The longer walk leaves the field work unfinished.";
    movement =
      "Elif walks uphill, tests the stones, then carries her jar home.";
    g.food -= 1;
  }
  if (g.age === 6 && action === "count") {
    success = true;
    line = "I took the small jars. I could carry them on the safe path.";
    cost = "The extra trips wear the well rope.";
    movement = "Elif lines up small jars and carries them home one at a time.";
    g.repairs -= 1;
  }
  if (g.age === 6 && action === "wait") {
    success = g.conditions.available;
    line = success
      ? "I found Danyal on duty. We brought the jars together."
      : "I waited where Danyal waits. Nobody came before dusk.";
    cost = success
      ? "Danyal leaves the well repairs until tomorrow."
      : "The household uses its reserve tonight.";
    movement =
      "Elif sits beside the well, then returns with " +
      (success ? "a full jar." : "an almost empty jar.");
    if (success) g.repairs -= 2;
  }
  if (g.age === 6 && action === "refuse") {
    line = "I kept clear of the flooded path. Our jar was still empty at dusk.";
    movement = "Elif holds her arm across the lower path and stays at home.";
  }
  if (g.age !== 6) {
    const variant = g.conditions.variant;
    const table: Record<
      number,
      Partial<Record<string, [boolean, string, string, string]>>
    > = {
      3: {
        count: [
          true,
          "I left one cup for each house and kept our evening jar.",
          "Maryam misses the meal work while the sharing takes time.",
          "Elif counts the cups, then carries one jar into the house.",
        ],
        refuse: [
          true,
          "I put my hand on the lid. We needed that jar for supper.",
          "The neighbour must wait for the morning water.",
          "Elif stands beside the jar with her arm across its lid.",
        ],
        look: [
          !g.conditions.flood,
          "I went to see whether the neighbour had another jar.",
          g.conditions.flood
            ? "The path was wet. The household uses its reserve."
            : "The walk costs an afternoon of field work.",
          "Elif follows the path to the neighbour, then turns toward home.",
        ],
      },
      10: {
        count: [
          variant !== 1,
          "I counted the households and set out their places.",
          variant === 1
            ? "The older children ignore the places. Our household loses its turn."
            : "The waiting children need food from our stores.",
          "Elif lines up jars at the well.",
        ],
        look: [
          variant === 1,
          "I checked the side entrance before joining the queue.",
          variant === 1
            ? "The side path works, but its gate needs repair."
            : "Both entrances join the same crowded queue. We lose our turn.",
          "Elif walks around the queue and checks the side gate.",
        ],
        refuse: [
          true,
          "I stayed in our place when the older children pushed past.",
          "The older children leave angry. Tomorrow the queue will need help.",
          "Elif holds her arm across the queue.",
        ],
        wait: [
          g.conditions.available,
          g.conditions.available
            ? "Danyal saw whose jars were already waiting."
            : "I waited for Danyal. Our turn passed while he was away.",
          g.conditions.available
            ? "Danyal delays his repair work to settle the queue."
            : "The household spends its reserve.",
          "Elif waits beside the well while the queue moves.",
        ],
      },
      14: {
        count: [
          true,
          "I measured a smaller share for every household.",
          "Our meals will be thin until spring.",
          "Elif divides the jars into equal groups.",
        ],
        look: [
          g.conditions.seep,
          "I checked the store beyond the upper path.",
          g.conditions.seep
            ? "The reserve feeds everyone. Moving it delays well repairs."
            : "The upper store is empty. The household gives away its reserve.",
          "Elif takes the upper path to the reserve store.",
        ],
        refuse: [
          !g.conditions.seep,
          "I held back the last jars until the missing families arrived.",
          !g.conditions.seep
            ? "Nobody goes without, but the queue waits into the cold."
            : "The upper reserve was needed. Some neighbours miss their share.",
          "Elif guards the remaining jars with an outstretched arm.",
        ],
      },
      18: {
        count: [
          !g.conditions.seep || g.food > 2,
          "I counted the waiting houses and divided our reserve between them.",
          !g.conditions.seep || g.food > 2
            ? "Everyone has water. Our household gives up its reserve."
            : "Our reserve was too small. The last households go without.",
          "Elif counts the jars and carries a share to every house.",
        ],
        look: [
          g.conditions.seep,
          "I checked the upper seep before carrying the jars.",
          g.conditions.seep
            ? "Everyone has water. The path needs days of repair."
            : "The seep is dry. The last households go without.",
          "Elif follows the upper path and carries water down to the houses.",
        ],
        refuse: [
          true,
          "I held the queue and stopped people taking a second jar.",
          g.food <= 2
            ? "Everyone has water, but the tired neighbours wait into the night."
            : "Everyone has water. Two neighbours leave angry after the long wait.",
          "Elif stands across the queue, then lets each household through.",
        ],
        wait: [
          g.conditions.available,
          g.conditions.available
            ? "Danyal and I kept each household in its turn."
            : "Danyal was away. I kept waiting while the queue emptied the well.",
          g.conditions.available
            ? "Everyone has water. Danyal cannot repair the well today."
            : "The last households go without.",
          "Elif waits by the well, then walks along the queue.",
        ],
      },
    };
    const row = table[g.age]?.[action];
    success = row?.[0] ?? false;
    line =
      row?.[1] ??
      {
        3: "I could not decide whose jar to fill. I stayed beside our door.",
        10: "I stood between the queue and the gate. Our place was gone when I moved.",
        14: "I kept looking from one family to the next. The sharing did not begin.",
        18: "I could not settle which instruction to follow. The last families waited without water.",
      }[g.age] ??
      "I could not decide whether to stay or go.";
    cost =
      row?.[2] ?? "The household spends its reserve to cover the shortfall.";
    movement = row?.[3] ?? "Elif stops between the path and the well.";
    if (success) {
      if (action === "count" || action === "refuse") g.food -= 2;
      else g.repairs -= 2;
    }
  }
  if (!success) g.food -= 3;
  g.outcome = { age: g.age, action, success, line, cost, movement };
}
function nextChapter(g: Game, practice: Practice) {
  const ages = [3, 6, 10, 14, 18];
  const next = ages[g.chapter + 1];
  if (next === undefined) throw Error("No later chapter.");
  const months = (next - g.age) * 12;
  const start = g.community.people.reduce((n, p) => Math.max(n, p.now), 0);
  clearMethodContext(g.child);
  for (let month = 1; month <= months; month++) {
    const until =
      Math.ceil(
        (start + ((next - g.age) * YEAR * month) / months) / MINUTES_PER_DAY,
      ) * MINUTES_PER_DAY;
    liveCommunity(g.community, until, {
      routineFor: () => ({ activities: [] }),
      upbringingMinutes: 0,
    });
    teach(g, practice, `gap-${g.chapter}-${month}`);
    g.months++;
  }
  g.food = Math.max(
    0,
    Math.min(
      12,
      g.food +
        6 -
        (practice === "count" || practice === "refuse"
          ? 3
          : practice === "look"
            ? 1
            : 0),
    ),
  );
  g.repairs = Math.max(
    0,
    Math.min(10, g.repairs + 4 - (practice === "wait" ? 3 : 0)),
  );
  if (practice === "look") g.routeKnown = true;
  g.chapter++;
  g.age = next;
  g.phase = "prepare";
  g.preparations = 0;
  g.outcome = null;
  g.lastLesson = `Through the years, Elif kept watching ${teachers[practice]}. She is ${next} now. ${chapterGoals[next] ?? ""}`;
  refresh(g);
}
export const chapterGoals: Record<number, string> = {
  3: "Keep an evening jar for the household.",
  6: "Bring the household water home.",
  10: "Keep the household’s place in the queue.",
  14: "Divide the winter store so nobody goes without.",
  18: "Bring water to every waiting household by night.",
};
export function conditionsText(g: Game): string {
  const variant = g.conditions.variant;
  const physical =
    g.age === 3
      ? "A neighbour has asked for the evening jar again."
      : g.age === 6
        ? g.conditions.flood
          ? "The lower path is flooded. The upper stones are dry."
          : "The lower path is dry. Smaller jars can cross safely."
        : g.age === 10
          ? variant === 1
            ? "The older children ignore the marked places. The side gate is open."
            : "The older children respect a marked place. The side gate is locked."
          : g.age === 14
            ? g.conditions.seep
              ? "The upper store still has a reserve."
              : "The upper store is empty. Some families arrive late."
            : g.conditions.seep
              ? "The upper seep still runs."
              : "The upper seep is dry. The household reserve can cover small shares.";
  return `${physical} ${g.conditions.available ? "Danyal is on duty today." : "Danyal is away today."} ${g.conditions.conflict ? "A neighbour says to stay. The household needs her to act." : ""}`;
}
export interface Run {
  game: "child";
  edition: 1;
  engine: "3.2.0";
  seed: number;
  slice: boolean;
  inputs: Input[];
  state: Game;
  finalHash: string;
}
export function hash(g: unknown): string {
  let h = 2166136261;
  const s = JSON.stringify(g);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}
export function exportRun(g: Game): Run {
  return {
    game: "child",
    edition: 1,
    engine: "3.2.0",
    seed: g.seed,
    slice: g.slice,
    inputs: structuredClone(g.inputs),
    state: structuredClone(g),
    finalHash: hash(g),
  };
}
export function replay(run: Run): Game {
  if (
    run.game !== "child" ||
    run.edition !== 1 ||
    run.engine !== "3.2.0" ||
    !Number.isSafeInteger(run.seed) ||
    run.inputs.length > 1000
  )
    throw Error("This run needs its original game version.");
  const g = createGame(run.seed, run.slice);
  for (const input of run.inputs) step(g, input);
  if (hash(g) !== run.finalHash || hash(run.state) !== run.finalHash)
    throw Error("This run does not match its saved result.");
  return g;
}
