# What the Child Saw

You are Zehra. Your daughter Elif learns by watching adults work. Prepare her for five days when she must act alone, at three, six, ten, fourteen and eighteen. Keep the household fed while choosing whose work she sees. At eighteen she must bring water home for every waiting household. Her independence can win, even when she follows another adult.

Done means a complete small run with both winning and losing endings, exact replay export, independent Codex review, green CI on the deployed commit, live verification, registry entries and a central listing ready for the coordinator. The owner accepts feel after the lab round. This implements the approved v2 brief and coordinator rulings of 2026-10-26.

## Cue vocabulary (designed before code)

Cues describe situations, never ages or chapter numbers. Demonstrations and crises share these exact keys and values throughout the run.

| Cue          | Values          | Meaning                                                          |
| ------------ | --------------- | ---------------------------------------------------------------- |
| supply       | scarce          | The available water or food may run short.                       |
| route        | uncertain       | A route or source needs inspection.                              |
| keeper       | needed          | A task could use the trusted keeper.                             |
| availability | present, absent | The keeper can or cannot help today.                             |
| pressure     | repeated        | Someone asks again or pushes past a limit.                       |
| conflict     | stop-or-go      | A keeper orders her to stay while an urgent errand needs action. |

Four method actions: `count` (Maryam, count before sharing), `look` (Yusuf, go and look first), `wait` (Danyal, wait for the keeper), `refuse` (Zehra, say no and mean it). Each demonstration uses one stable condition: supply scarce, route uncertain, keeper needed, pressure repeated respectively. Situations can carry several cues. HF selects among the methods she holds. Mixed exposure is useful. An explicit `freeze` offer exists only with visible stop-or-go conflict; weak acquired support can leave that conflict unresolved. No blanket penalty for mixed exposure.

## A game with costs

Each chapter has three preparations. A companion teaches through a witnessed task and exact HF method APIs. Maryam's counting takes her away from preparing food. Yusuf's walk leaves field work undone. Danyal's lesson delays well repairs. Zehra's boundary lesson consumes household stores while she stays home. Cost descriptions appear on the choice. Household food and well condition persist. Choosing field work restores food but leaves Elif to practise alone without a new demonstration. No guaranteed injury for independence.

Every preparation shows the conditions of the coming crisis, including Danyal's availability. Seed and earlier food, repair and route outcomes change those conditions. At least two practices meet each chapter's goal with different costs. Others can bring a shortfall with a visible consequence. Final success is enough water for all, not a parenting score. Earlier shortfalls reduce stores or repair capacity; they do not end the run.

| Age | Goal                                            | Workable approaches and differing costs                                                                                                                                                                                                             |
| --- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3   | Keep an evening jar for home.                   | Count shares (time); refuse a repeat request (neighbour waits).                                                                                                                                                                                     |
| 6   | Bring the household water home.                 | Inspect a dry upper route (food/time); count smaller safe trips (well wear). With a present keeper, waiting also works but delays repairs. A flooded lower path or absent keeper causes a shortfall.                                                |
| 10  | Keep the household's place in the queue.        | Refuse pressure (friction); count and arrange turns (stores); a present keeper can settle it (repair delay).                                                                                                                                        |
| 14  | Divide the winter store so nobody goes without. | Count portions (thin household meals); inspect the water store (repair work deferred).                                                                                                                                                              |
| 18  | Supply every waiting household by night.        | Count and ration (household stored water spent); inspect a flowing upper spring (path work); hold the queue (neighbours wait). A present keeper can organise turns at repair cost. Poor settlement state can close one of these routes; two remain. |

## Build order and HF ownership

First implement age six only, preparation, crisis, movement, aftermath. Prove success, shortfall, explicit confusion and same-seed different movement headless and in a browser. Only then add ages three, ten, fourteen, eighteen.

HF 3.2.0, exactly pinned, owns Person state, method evidence and decisions. Use receiveMethodCues, demonstrateMethod and decide. Never write methods.context. No new HF capability and no engine edits. Crisis presentation holds on the community day boundary; it never adds a partial body day. Monthly liveCommunity steps advance the entire cast between chapters; demonstrations occur at Elif.now between steps. Elif has no second aging loop. Host code owns physical water, food, routes and task results. No copied learning, cognition or trust logic.

## Visual and technical choices

PixiJS 8 with all words in the DOM. A cloth field fills the top of a narrow page. Stitched figures move along paths, count jars, wait beside the well, or hold an arm across the queue. Show movement before revealing her explanation. Canvas 2D implements the same frame protocol if WebGL fails. Use a main-thread HF host unless measurement shows a worker is needed; rendering receives only frames. The game has no runtime server or database. No React shell. Under five seconds ready on the spike phone profile is a release gate. Godot is excluded by its measured 52-second load. techspike/report.md was absent when read; the v2 reviews contain the corrected Pixi 3.8-second measurement.

At 360×690 the scene stays above the choice text. One focused decision appears at a time. No numeric personality scores. The yearbook gives varied first-person recollections. Feedback offers stopping and confusion; first visit explains recording and one switch controls it. Diagnostic export and replay tools require ?lab=1. Reduced motion keeps a readable action pose and skips travel.

## Cast

Canonical Yusuf (34, builder), Maryam (68), Danyal (52, Christian well keeper), Tariq (16, Zehra’s stepson). Zehra is Yusuf's wife, now a foreground player body. Elif is their daughter. These two receive new registry entries under the coordinator's explicit allowance. This game is an authored branch, not a claim about another game's current continuation. No new faith rulings.

## Review decisions

The coordinator resolves the v1 roster objection. Drop the witnessed-practice opt-in and prediction wager. Prefer situational selection over mixed-exposure failure. Reveal actual conditions rather than rumours before the last preparation; hidden availability would make failure arbitrary. Use monthly community advancement, not dual loops. Keep companion costs and variable crises. Lines vary by action, chapter and settlement consequence.

## Deferred

- 2026-11-03: owner and lab-panel taste review, then retest under the coordinator's process.
- 2026-11-03: cross-game continuation admission, pending a separate receiving-stage design; this run uses its own authored cast branch.
- 2026-11-03: custom cloth shader and sound, only if players request them; protect phone ready time.


## Iteration 2: lessons and settlement consequences (2026-10-26)

The binding coordinator rulings remain unchanged. We chose the review's thinner-gap option: monthly community advancement still totals 180 steps, but the gap gives one witnessed task at its end instead of 36–48 repeated demonstrations. The three lived lessons can now change HF's selected action. The arrangement retains a remembered alternative when you spend the preparations in the field. No host action chooser or framework code was added.

Yusuf's lesson records that Elif knows how to check a route. It never creates water. The upper spring depends on seed and the well rope at chapter entry. Food stores and well rope stay between 0–12 and 0–10. Empty food stores mean no supper. Poor well rope can close the upper path. Missed meals before the final chapter limit repeated carrying trips. An empty household water store can also close counting even when the carriers have eaten. When that route is difficult Danyal is on duty to help; checking the upper spring and working with him remain two approaches. When the spring is dry, counting small shares and stopping second jars both work. A flowing spring with food set aside for the carriers admits counting or inspection, but guarding the well alone leaves households short. The relevant conditions stay fixed through all three preparations; preparation costs affect later chapters and supper, not a concealed last-choice verdict.

Freeze is offered only when Elif holds matching evidence for waiting and for counting or inspecting, and the visible request to wait conflicts with starting the task. An unfit remembered practice has an honest failure line. A child with no demonstrated practice tries without a plan. Danyal's keeper cue is absent when he is away, and waiting cannot solve winter allocation or the evening jar task.

Movement lasts four seconds (two with reduced motion). Each yearbook row recalls the adult's task behind Elif's action in a distinct first-person memory. All Zehra buttons address the player as you. Water stores, food stores and the well rope have separate names. The upper spring replaces the unexplained seep in player text.

Replay edition 2 explicitly identifies the changed rules. Edition 1 exports require the original release; an old local save starts a new upbringing with the existing visible warning. Exact replay remains tested within edition 2. Each memory stores the task actually witnessed and adds the action and result; it does not infer a new childhood scene from the selected action.

Copied Claude simulations (unchanged scripts) measured final-age lesson effects at 30/80 versus 0/80, and chapter comparisons at 96/96 versus 9/96. A comparison counts a lesson result that differs from the same seed/gap with field work; it does not count changed prose. Across seeds 21–24, all-companion final wins are Maryam 1/4, Yusuf 3/4, Danyal 3/4 and you 1/4. With field preparations and only gap teaching they are 2/4, 3/4, 3/4 and 1/4. These are bounded controls, not a claim of balance across all seeds.

## Iteration 3: choices across an upbringing

The cold player found the same five preparation descriptions at every age. The choice descriptions now name the coming task: keeping an evening jar, bringing water home, holding a queue place, dividing the winter store, and supplying every household. Each demonstration choice says “Try” until Elif has witnessed that practice, then “Practise … again”. This uses the recorded lesson, including a lesson from the intervening years; it does not claim that she has mastered or retained a method. Field work names the current household need and the adult she last watched. Every cost stays explicit.

This is a presentation change. Inputs, witnessed tasks, HF decisions, settlement rules, movement timing, replay edition 2 and the admitted state are unchanged. Returning to a practice can still fail. The age-specific purpose describes why you might choose the lesson, not a guarantee about Elif's later action. Gap companion choices retain their existing costs.

## Iteration 4: the upbringing reaches the final day (2026-10-26)

Earlier failed errands now consume emergency water that ordinary daily supplies do not replace. The household starts with two emergency household shares. Each pre-eighteen shortfall spends one, down to zero. The final day's last households need one stored share while the carriers return; a suitable learned practice still fails to finish before night if earlier shortfalls exhausted the store. This is an authored physical delivery rule, not an HF parenting score. Conditions disclose the store and its use before every preparation. The ending names the final learned practice and teacher and recalls the earlier failed errands that used the emergency water. Successful daily errands do not consume the emergency store. Field work restores food and the well rope; it does not create stored water.

HF still selects Elif's action from acquired methods. The host adds no learning, trust or cognition rules. Mixed exposure remains allowed and can succeed. Existing route and availability conditions still determine whether a practice fits the final task. A suitable final lesson cannot undo several earlier shortages. A careful complete win remains reachable.

Each completed field afternoon now has visible progress toward the third-afternoon errand. Older Elif no longer plays with an empty jar or stands beside an adult's elbow. The yearbook uses her actual errand explanation with its remembered source, so an unfit practice cannot invent a successful act. Zero food is described as empty. The ending shows her remembered lesson and actual consequence before the full yearbook.

Replay edition 3 identifies the new physical rules and state. Edition 2 exports require their original release; an incompatible local save uses the existing visible new-upbringing warning. Exact replay remains required within edition 3.
