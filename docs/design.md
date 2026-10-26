# What the Child Saw

You are Zehra. Your daughter Elif learns by watching adults work. Prepare her for five days when she must act alone, at three, six, ten, fourteen and eighteen. Keep the household fed while choosing whose work she sees. At eighteen she must bring water home for every waiting household. Her independence can win, even when she follows another adult.

Done means a complete small run with both winning and losing endings, exact replay export, independent Codex review, green CI on the deployed commit, live verification, registry entries and a central listing ready for the coordinator. The owner accepts feel after the lab round. This implements the approved v2 brief and coordinator rulings of 2026-10-26.

## Cue vocabulary (designed before code)

Cues describe situations, never ages or chapter numbers. Demonstrations and crises share these exact keys and values throughout the run.

| Cue | Values | Meaning |
| --- | --- | --- |
| supply | scarce | The available water or food may run short. |
| route | uncertain | A route or source needs inspection. |
| keeper | present, absent | A trusted keeper can or cannot help today. |
| pressure | repeated | Someone asks again or pushes past a limit. |
| conflict | stop-or-go | A keeper orders her to stay while an urgent errand needs action. |

Four method actions: `count` (Maryam, count before sharing), `look` (Yusuf, go and look first), `wait` (Danyal, wait for the keeper), `refuse` (Zehra, say no and mean it). Each demonstration uses one stable condition: supply scarce, route uncertain, keeper present, pressure repeated respectively. Situations can carry several cues. HF selects among the methods she holds. Mixed exposure is useful. An explicit `freeze` offer exists only with visible stop-or-go conflict; weak acquired support can leave that conflict unresolved. No blanket penalty for mixed exposure.

## A game with costs

Each chapter has three preparations. A companion teaches through a witnessed task and exact HF method APIs. Maryam's counting takes her away from preparing food. Yusuf's walk leaves field work undone. Danyal's lesson delays well repairs. Zehra's boundary lesson consumes household stores while she stays home. Cost descriptions appear on the choice. Household food and well condition persist. Choosing field work restores food but leaves Elif to practise alone without a new demonstration. No guaranteed injury for independence.

The last preparation shows the conditions of the coming crisis, including Danyal's availability. Seed and earlier food, repair and route outcomes change those conditions. At least two practices meet each chapter's goal with different costs. Others can bring a shortfall with a visible consequence. Final success is enough water for all, not a parenting score. Earlier shortfalls reduce stores or repair capacity; they do not end the run.

| Age | Goal | Workable approaches and differing costs |
| --- | --- | --- |
| 3 | Keep an evening jar for home. | Count shares (time); refuse a repeat request (neighbour waits). |
| 6 | Bring the household water home. | Inspect a dry upper route (food/time); count smaller safe trips (well wear). With a present keeper, waiting also works but delays repairs. A flooded lower path or absent keeper causes a shortfall. |
| 10 | Keep the household's place in the queue. | Refuse pressure (friction); count and arrange turns (stores); a present keeper can settle it (repair delay). |
| 14 | Divide the winter store so nobody goes without. | Count portions (thin household meals); inspect the reserve (repair work deferred). |
| 18 | Supply every waiting household by night. | Count and ration (household reserve spent); inspect a usable seep (path work); hold the queue (neighbours wait). A present keeper can organise turns at repair cost. Poor settlement state can close one of these routes; two remain. |

## Build order and HF ownership

First implement age six only, preparation, crisis, movement, aftermath. Prove success, shortfall, explicit confusion and same-seed different movement headless and in a browser. Only then add ages three, ten, fourteen, eighteen.

HF 3.2.0, exactly pinned, owns Person state, method evidence and decisions. Use receiveMethodCues, demonstrateMethod and decide. Never write methods.context. No new HF capability and no engine edits. Monthly liveCommunity steps advance the entire cast between chapters; demonstrations occur at Elif.now between steps. Elif has no second aging loop. Host code owns physical water, food, routes and task results. No copied learning, cognition or trust logic.

## Visual and technical choices

PixiJS 8 with all words in the DOM. A cloth field fills the top of a narrow page. Stitched figures move along paths, count jars, wait beside the well, or hold an arm across the queue. Show movement before revealing her explanation. Canvas 2D implements the same frame protocol if WebGL fails. Use a main-thread HF host unless measurement shows a worker is needed; rendering receives only frames. The game has no runtime server or database. No React shell. Under five seconds ready on the spike phone profile is a release gate. Godot is excluded by its measured 52-second load. techspike/report.md was absent when read; the v2 reviews contain the corrected Pixi 3.8-second measurement.

At 360×690 the scene stays above the choice text. One focused decision appears at a time. No numeric personality scores. The yearbook gives varied first-person recollections. Feedback offers stopping and confusion; first visit explains recording and one switch controls it. Diagnostic export and replay tools require ?lab=1. Reduced motion keeps a readable action pose and skips travel.

## Cast

Canonical Yusuf (34, builder), Maryam (68), Danyal (52, Christian well keeper), Tariq (16). Zehra is Yusuf's wife, now a foreground player body. Elif is their daughter. These two receive new registry entries under the coordinator's explicit allowance. This game is an authored branch, not a claim about another game's current continuation. No new faith rulings.

## Review decisions

The coordinator resolves the v1 roster objection. Drop the witnessed-practice opt-in and prediction wager. Prefer situational selection over mixed-exposure failure. Reveal actual conditions rather than rumours before the last preparation; hidden availability would make failure arbitrary. Use monthly community advancement, not dual loops. Keep companion costs and variable crises. Lines vary by action, chapter and settlement consequence.

## Deferred

- 2026-11-03: owner and lab-panel taste review, then retest under the coordinator's process.
- 2026-11-03: cross-game continuation admission, pending a separate receiving-stage design; this run uses its own authored cast branch.
- 2026-11-03: custom cloth shader and sound, only if players request them; protect phone ready time.
