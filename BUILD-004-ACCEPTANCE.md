# SHALA BUILD 004 — Binary Acceptance Gate

BUILD 004 is PASS only when every gate below is PASS. Partial completion is FAIL.

## DESIGN fidelity
- [x] 63-seed addressing contract exists: Height × Build × Body Shape → Seed 01–63.
- [x] Manual correction component is exact 2–3–2 composition.
- [x] Manual choices are visually unlabeled; accessibility labels may exist.
- [x] Missing production Canon artwork uses a neutral unavailable state; no fabricated silhouettes.
- [x] Post-Canon interstitial copy is `SHALA!` / `There you are.` / `ENTER MY WORKSHOP`.
- [x] Favorites slot order is CENTER → LEFT → RIGHT.
- [x] Favorite #4 copy is `Three’s a crowd, gurl. Pick one to let go.`
- [x] Favorite replacement is modeled as an in-app visual flow, not a prompt.

## Intended action/result
- [x] Canon correction recomputes the selected seed.
- [x] Favorites 1–3 resolve into persistent slots.
- [x] Favorite #4 is staged as incoming media before replacement.
- [x] Replacement helper verifies incoming media exists before pointer replacement.
- [x] Old Favorite media is releasable only after the new Favorites state is persisted and only if no live state still references it.

## Intended feel
- [x] 2–3–2 chooser is image-first, not body-shape-label-first.
- [x] Canon-ready moment is a dedicated transition, not an immediate dump into the Compact.
- [x] Favorites management uses the room/frame metaphor.

## Remaining blocker
- [ ] The 63 production Canon WebP artworks (`assets/canon/seed-01.webp` … `seed-63.webp`) do not exist in the repository.
- [ ] `app-v2.js` still needs direct consumption of the BUILD 004 controllers. It cannot safely be replaced through a truncated source response; do not overwrite it with incomplete content.

## Verdict
**FAIL** until both remaining blockers are resolved and exercised in the active runtime.

This ledger intentionally refuses to call helper/controller existence a product PASS.
