# What the Child Saw

You are Zehra. Elif learns through the work she sees. Choose whose work she watches, pay its cost, and prepare her for five days when she must act alone. At eighteen, get water to every waiting household.

[Play](https://child.adamwhite.work) · [Design](docs/design.md) · [Independent review](docs/review.md)

## Develop

Node26.12.0 and pnpm12.14.0. `pnpm install --frozen-lockfile`, then `pnpm dev`.

`pnpm check:lane` runs lint, strict typecheck, headless tests and the production build. `pnpm e2e` checks Chromium and WebKit at360×690 and1280×800. Install their runtimes with `pnpm exec playwright install chromium webkit` when needed.

Every actor decision uses the published HF3.2.0 package. Game code owns settlement resources and consequences. No framework source is vendored. The lab-client tarball is the immutable SDK0.4.11 GitHub release artifact; it retains its own exact HF3.0.0 dependency, separate from the game's3.2.0 import.

Add `?lab=1` for replay export/import. Add `&slice=6` for the verified age-six sequence or `&canvas=1` for the Canvas2D renderer. Ordinary play saves on this device. Feedback and Recording are in Menu.

`node scripts/measure.mjs` serves compressed build assets and measures ready time at360×690, 562ms latency, 180KB/s and4× CPU slowdown. The initial split build measured5.06s; a single startup bundle measured3.77s. This chooses fewer loading round trips at the cost of a larger download (about360KB gzip).

Deploy only after GitHub Actions is green on the exact signed commit. Build from a clean checkout, verify `dist/release.json` has that commit and `dirty:false`, then use `npx wrangler deploy`. Verify both the game and its live `/release.json`. The central listing is published separately by the coordinator.

MIT code. The figures are drawn in code; every word is in the DOM.
