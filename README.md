# What the Child Saw

You are Zehra. Elif learns through the work she sees. Choose whose work she watches, pay its cost, and prepare her for five days when she must act alone. At eighteen, get water to every waiting household.

[Play](https://child.adamwhite.work) · [Design](docs/design.md) · [Independent review](docs/review.md)

## How to play

The game opens at age three, or resumes this browser's saved run. You play Zehra, Elif's mother. There is no Start button. If the recording notice appears, **Continue** dismisses it.

Each age has three preparations. Choose an adult for Elif to watch, or work to restore household supplies:

| Control               | Example and cost                                                                        |
| --------------------- | --------------------------------------------------------------------------------------- |
| **Go with Maryam**    | Count before sharing. Maryam leaves meal work undone; food stores fall.                 |
| **Go with Yusuf**     | Check a path first. Field work is left undone; food falls, but the route becomes known. |
| **Go with Danyal**    | Wait for the keeper. Well repairs are delayed.                                          |
| **Stay with Zehra**   | Keep a jar for home and refuse another request. Staying home uses food stores.          |
| **Work in the field** | Food and repairs recover. Elif receives no new example.                                 |

Read the coming conditions before the last preparation. After three preparations, choose **Let her go**. Watch Elif move; her explanation and the cost appear automatically. You observe her crisis choice rather than select it.

At ages three, six, ten and fourteen, her goals are to keep an evening jar, bring water home, keep a queue place and share the winter store. A shortfall uses household reserves and the run continues. Food and well condition carry forward. Success also has costs, such as thin meals, delayed repairs or neighbours waiting.

After each of these crises, choose **Keep working with Maryam**, **Yusuf**, **Danyal** or **Zehra**. This companion keeps demonstrating the same method through the intervening years. Counting and refusing reduce food recovery; checking paths reduces it less; waiting reduces repair recovery.

At eighteen, win by bringing water to every waiting household by night. Failure leaves the last households without water. Choose **Close this page** to reach the ending and yearbook; it does not close the browser tab. **Begin again** starts a new upbringing.

**Menu** pauses the reveal. **Resume** continues it. The menu also offers **Feedback**, **Recording: on/off**, **Full screen**, **All games** and **New game** with confirmation. Ordinary play saves locally when browser storage works. Reopening the game continues that saved run.

## What HF demonstrates

HF3.2.0 holds Elif's acquired methods and chooses among available actions. The game supplies witnessed examples through `demonstrateMethod`, supplies situation cues through `receiveMethodCues`, and calls `decide` for the crisis. Counting, checking, waiting and refusing can fit different situations. Conflicting instructions can leave her undecided.

The game authors the settlement conditions, offered actions, goals, costs and success rules. Seed and earlier settlement outcomes affect those conditions. This is a bounded demonstration of acquired methods and cue-based choices, not evidence that the model explains general human learning. This run uses its own authored cast branch; it does not continue people from other games. Player and owner acceptance remain pending.

## Recording and Feedback

The SDK attempts to record and link play on this device while Recording is on. Shared recording identity depends on browser storage, frame access and origin rules; it is not a cross-device identity or a shared character history. The lab persona origin list is a separate configuration.

Feedback offers **I'm stopping** and **I'm confused**. Choosing one sends nothing until **Submit**. Upload attempts and queued records do not prove storage. Only **Sent** or a stored receipt confirms storage.

Central delivery remains pending: the deployed central `00d` build rejects new `child` registration until the coordinator deploys the listing after Voice. Listing source `9b05e3` passed exact CI run `40281412400`; source availability and green CI do not prove deployment or successful recording delivery.

## Develop

Node26.12.0 and pnpm12.14.0. `pnpm install --frozen-lockfile`, then `pnpm dev`.

`pnpm check:lane` runs lint, strict typecheck, headless tests and the production build. `pnpm e2e` checks Chromium and WebKit at360×690 and1280×800. Install their runtimes with `pnpm exec playwright install chromium webkit` when needed.

Every actor decision uses the published HF3.2.0 package. Game code owns settlement resources and consequences. No framework source is vendored. The lab-client tarball is the immutable SDK0.4.11 GitHub release artifact; it retains its own exact HF3.0.0 dependency, separate from the game's3.2.0 import.

Add `?lab=1` for replay export/import. Add `&slice=6` for the verified age-six sequence or `&canvas=1` for the Canvas2D renderer. Ordinary play saves on this device. Feedback and Recording are in Menu.

`node scripts/measure.mjs` serves compressed build assets and measures ready time at360×690, 562ms latency, 180KB/s and4× CPU slowdown. The initial split build measured5.06s; a single startup bundle measured3.77s. This chooses fewer loading round trips at the cost of a larger download (about360KB gzip).

Deploy only after GitHub Actions is green on the exact signed commit. Build from a clean checkout, verify `dist/release.json` has that commit and `dirty:false`, then use `npx wrangler deploy`. Verify both the game and its live `/release.json`. The central listing is published separately by the coordinator.

MIT code. The figures are drawn in code; every word is in the DOM.
