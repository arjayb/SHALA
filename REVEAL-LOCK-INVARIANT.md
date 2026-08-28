# SHALA — REVEAL LOCK / PIETY INVARIANT

This amendment is authoritative for BUILD 008 and must be respected by routing/state work performed earlier.

## Core rule
A successful generated Look is persisted as `pendingReveal` before REVEAL is shown. While that Reveal is unresolved, REVEAL owns the application.

## Before a qualifying action succeeds
- Navigation elsewhere is suspended.
- Compact/Home cannot escape REVEAL.
- Browser Back cannot escape REVEAL.
- Reload returns to the exact pending REVEAL.
- App/browser crash returns to the exact pending REVEAL on next launch.
- Reopen/login returns to the exact pending REVEAL.
- Mirror, Trend, Workshop and Favorites cannot supersede it.
- Failed SAVE or failed FAVORITE leaves navigation suspended.

## SAVE TO DEVICE
1. User presses SAVE TO DEVICE.
2. Save must actually succeed.
3. Show exact confirmation: `Photo saved to device`.
4. Navigation controls may be restored.
5. REVEAL remains the current screen. It does not disappear merely because the save succeeded.

## MARK FAVORITE
1. User presses MARK FAVORITE.
2. Favorite transaction must actually succeed.
3. Show exact confirmation: `Review the photo at The Console by entering the FAVORITES palette`.
4. Navigation controls may be restored, including entry to FAVORITES / The Console.
5. REVEAL remains current until the user actually navigates away.

## TRY NEW ONE
TRY NEW ONE is an explicit resolving action. It clears `pendingReveal` and begins a new exploration.

## Router invariant
If `pendingReveal` exists and `pendingReveal.navigationReleased !== true`, every ordinary route request resolves to `reveal`.

## Binary tests
- Successful generation → kill app on REVEAL → reopen → exact REVEAL: PASS; anything else: FAIL.
- Browser Back/Home before qualifying action → still REVEAL: PASS; escape: FAIL.
- SAVE succeeds → confirmation exact + navigation restored + REVEAL still visible: PASS.
- SAVE fails → navigation remains suspended: PASS.
- FAVORITE succeeds → transaction committed + confirmation exact + navigation restored: PASS.
- FAVORITE fails → navigation remains suspended: PASS.
- TRY NEW ONE → pending Reveal cleared + new exploration: PASS.

Piety protects the photo. The lock forces an explicit action. Successful action earns navigation back.
