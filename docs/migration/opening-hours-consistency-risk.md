# Opening-Hours Ticker: Consistency Risk Before Cutover (RC item 8)

## The risk, concretely

There are currently **three** independent representations of the clinic's opening hours in this codebase, and migrating to Sanity adds a **fourth** that nothing reads yet:

1. **`src/lib/opening-hours.ts`'s `clinicSchedule`** — a hardcoded TS constant, read directly by the client-side `ClinicOpenStatus` component (the live "open now" ticker with a 60-second refresh). This is a **client component** — its data must be available in the browser bundle at build time; it cannot do a server-side or runtime Sanity fetch without either (a) violating the "no client-side CMS calls" constraint, or (b) a server render already injecting the data as a prop (not currently done).
2. **`site-editable.json`'s `texts.hours.*`** (now overlaid by **Sanity's `siteSettings.textOverrides`** when `CONTENT_SOURCE=sanity`) — the display strings shown in `HoursCard` (e.g. "09:00–13:00 & 14:00–19:00"). **This one IS already wired to Sanity.**
3. **`src/lib/schema.ts`'s `openingHoursSpecification`** — the JSON-LD structured data (fixed in Phase 3 to match #1, but still a separate hardcoded array, not derived from #1 or #4 programmatically).
4. **Sanity's `openingHours` document** (migrated in Phase 4, with the real weekday/window structure) — exists in the dataset, editable via Studio, but **nothing in the frontend reads it yet**.

**The concrete failure mode:** once Sanity is treated as "the" place to edit content, an editor who changes hours via Studio would naturally expect to edit the `openingHours` document (#4) or the hours text override (#2) — and #2 *is* live-wired, so editing it *would* change what `HoursCard` displays. But the **live ticker (#1)** would keep showing the old hardcoded schedule, since it never reads #2 or #4. A patient could see "Heute geöffnet bis 19:00" in the ticker while `HoursCard`'s text (if edited differently) says something else, or — more likely — an editor changes hours in Sanity, sees `HoursCard` update, assumes the whole site is now correct, and doesn't realize the ticker is still wrong until a patient shows up at the old hours.

## Why this wasn't wired in Phase 4 (deliberate, not an oversight)

`ClinicOpenStatus` is a `"use client"` component using `useState`/`useEffect`/`setInterval` to recompute "is it open right now" every 60 seconds in the browser — it needs the schedule data available client-side, synchronously, at every tick. Wiring it to Sanity would require either:
- A **runtime client-side fetch to Sanity** on every page load — violates the "no Sanity calls outside build time" / static-export constraint, and would make the ticker depend on Sanity's uptime for a feature that currently works offline-from-Sanity.
- A **build-time fetch threaded through as a prop** — architecturally correct, but requires changing `ClinicOpenStatus`'s and `useClinicStatus`'s signatures and every call site that renders it (`HoursCard`, `Header`/`StickyBar`/`FloatingCTA` — needs enumeration), which is a real, scoped refactor, not a one-line fix.

## The solution to implement before cutover (not yet done)

1. Add a server-side fetch of the Sanity `openingHours` document (same build-time pattern already used for every other content type) in the one place that's a Server Component and sits above all `ClinicOpenStatus` usages closely enough to pass data down — most naturally `src/app/[locale]/layout.tsx` (already a Server Component, already async) or a dedicated small server wrapper.
2. Change `src/lib/opening-hours.ts`'s pure functions (`isClinicOpen`, `getTodayHoursLabel`, `getNextOpening`) to accept the schedule as a parameter instead of importing the module-level `clinicSchedule` constant directly. Keep `clinicSchedule` as the **fallback default** (same `isSanityContentEnabled()` + try/catch pattern as every other loader) so an outage still degrades gracefully to the known-good local schedule, exactly like every other content type.
3. Thread the resolved schedule down as a prop to `ClinicOpenStatus` (and therefore to `useClinicStatus`), replacing the direct import.
4. Delete (or clearly mark as legacy/unused) the now-redundant `texts.hours.*` display-string overrides, deriving `HoursCard`'s displayed text programmatically from the *same* resolved schedule object instead of a separately-edited string — closing the gap between representations #1 and #2 permanently, not just for this one cutover.
5. Only once steps 1–4 are done and tested should hours actually be exposed as "safe to edit in Studio" to staff — until then, the `openingHours` Sanity document and the `textOverrides` hours entries should be treated as **not yet the real source of truth**, even though they technically exist and are migrated.

## Interim mitigation (now, before that refactor lands)

Do **not** instruct practice staff to edit opening-hours text via Sanity Studio yet, even after Studio access is rolled out for other content (team photos, announcements, services). Hours changes should continue to go through a code change (`opening-hours.ts` + the Phase-3-fixed `schema.ts` JSON-LD) until the refactor above lands — this is a **process control**, not a code change, and costs nothing to put in place immediately.

## Status

**BLOCKED for cutover** — not a reason to block the rest of the Sanity integration (team/services/blog/announcements/contact info have no equivalent dual-source risk and are safe to cut over independently), but opening-hours editing via Sanity specifically should not be presented to staff as live/safe until this refactor is done and tested.
