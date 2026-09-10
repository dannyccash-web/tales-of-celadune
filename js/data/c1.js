// Scene C1 — TIDEWRACK HARBOR (overworld row C, column 1 — the SW corner of row C,
// directly north of D1 Shipwreck Cove on the map grid)
// World coordinates: 3000x3000. Origin top-left.
//
// A fishing village and port built along a curving inlet. The open sea fills
// the WEST edge; the derelict merchant ship *Maiden's Grace* (crewed by
// knights' supply-runners, boarded and slaughtered by miremen at a river
// mouth before drifting in dead) sits moored at a pier/warehouse complex on
// the shore. The village proper — eleven huts (incl. the Tidefolk's, added
// 2026-09-03) + the dockmaster's warehouse — spreads east across open grass
// and dirt paths, with a rocky headland NE and a tide pool SE (the Tidefolk's
// corner). Half the village's 12 NPCs are
// Calder Rusk's former mutinous crew (see D1) — this IS "the fishing
// village" his crew rowed north to. See CLAUDE.md's "Row C design notes" +
// "C1 — Tidewrack Harbor" sections for the full brief and confirmed NPC
// roster.
//
// Art replaced + collision REGENERATED 2026-09-02 (round 2) from Danny's
// hand-painted C1_Walkable.jpg guide — a full re-render of the background,
// completely different geography from the original auto-classified build
// (the ship/dock moved to the WEST shore, the village spreads east/NE, the
// watchtower is gone in favor of a well at the north crossroads). Guide
// convention here is INVERTED from every other scene's walkable guide in
// this project: pure red (R>150,G<80,B<80) marks NOT-walkable, everything
// else (including building roofs — confirmed by inspecting the raw guide,
// roofs ARE painted red same as water/rock) is walkable. Pipeline: per-25px
// cell majority-vote red-sample -> NO separate manual building stamps needed
// this time (the guide already correctly encodes every roof, unlike the
// original no-guide build) -> forced-walkable aprons carved for all three
// edge exits (guide's natural bands were narrower/offset from the previous
// build's bands, so aprons were widened to guarantee safe arrival) -> merged
// into rects. Engine-verified via a 36px-collider EDT/connected-
// component check (equivalent to the project's usual BFS): spawn, every
// building door, every NPC goto/patrol point, the fishing bank, and both
// mireman patrol points on the ship's deck all fall in the single dominant
// safe region (1.72M of ~1.9M safe px; a couple of small sub-2800px pockets
// are isolated on purpose — nothing is placed there). Regenerate the same
// way (from a walkable guide, red=blocked) if this art changes again.
// UPDATED 2026-09-03: a targeted collision delta from an annotated overlay
// (yellow=make walkable, blue=make blocked — see CLAUDE.md's "C1 collision
// delta from an annotated overlay" section) took the obstacle count from
// 364 to 344 rects; no full regen.
//
// D1 <-> C1 connection UNCHANGED from the original build: D1's `top` exit
// (x1375-1625) needed no edits — this file's `bottom` exit apron
// (x1360-1640 forced walkable) still covers it exactly.
//
// New background art dropped in 2026-09-08 (Danny) — C1_Background.jpg
// replaced in place (same filename, same 3000x3000 dims); confirmed the
// staged art matches Danny's annotated overlay before touching anything.
//
// Collision delta from Danny's annotated overlay 2026-09-08: blue=make
// walkable, yellow=make blocked — the SAME convention as the 2026-08-19
// pass, opposite of the 2026-09-03 pass (always re-confirm from what
// Danny actually says for a given image rather than assuming). Same methodology as the 2026-08-19/2026-09-03
// delta passes: existing 344 obstacle rects rasterized to the 25px grid
// (source of truth) -> annotated JPG (3000x3000, solid paint colors
// ~(1,78,255) blue / ~(253,254,2) yellow, zero overlap) thresholded per
// cell at >35% coverage (304 blue cells, 200 yellow cells) -> `blocked
// &= ~blue; blocked |= yellow` -> re-merged into rects via the standard
// row-run + row-stack algorithm. No exit/spawn-apron protection applied
// this pass (the painted blobs near the bottom exit and spawn were
// deliberate-looking, not stray single pixels) — verified safe afterward
// via the real engine instead of guessing. Result: 363 of 14,400 cells
// actually changed state (197 newly walkable, 166 newly blocked), 344 ->
// 366 rects. Diff visually spot-checked against a green/magenta
// before/after highlight render — newly-walkable green matched the dock
// edges/beach/tide-pool blue paint, newly-blocked magenta matched the
// roof-edge/rock/grass yellow paint.
//
// 11 building doors relocated 2026-09-08 (Danny sent new coordinates for
// every named building except the three landmarks). Labels moved with
// their doors (same offset-preservation as every prior door move in this
// file). Every NPC tied to a moved building had home.door (+ approach,
// where present) and any `x`/`y` start position and routine `goto`
// targets re-derived by the same relative-offset-from-door technique used
// in the 2026-09-03 passes. That mechanical offset-preservation landed 6
// waypoints inside newly-blocked or low-clearance terrain at the new
// locations (verified two ways: the usual BFS reachability check AND a
// rewritten-harness rigorous 1800s sim tracking continuous non-movement,
// which is the only thing that reliably catches a permanent freeze — see
// the 2026-09-03 round-2 writeup on why the plain idle-tracker sim can
// miss this). Hand-adjusted to the nearest well-cleared (>=35px) spot in
// the same rough direction, same technique as the Garrick/Cade `approach`
// fixes: Lily Farrow's two wander goto points (her new house sits in a
// mostly-open-to-the-west pocket, her old east-facing loop didn't
// survive the move), Roderick Vane's goto (his old offset landed him in
// a near-zero-clearance sliver between two stacked warehouse-district
// obstacles), Senna Brineholt (needed a new `home.approach` — her literal
// new door coordinate is buried at 0 clearance, same failure mode as the
// Garrick/Cade livelock from 2026-09-03 round 2 — plus a small goto
// nudge), Wynne Ashcombe (her re-derived START position landed in solid
// terrain — she'd have been stuck from t=0 forever, never once reaching
// `atHome`; both her start `x,y` and goto rebuilt from scratch near the
// new door instead of offset-preserved), and Cade Fathom's goto (down to
// 15px clearance after the move, oscillation-livelock risk). **Lesson
// reinforced: offset-preservation is a good first guess, never a
// verified result — always re-run the full rigorous sim after any door
// move, not just the BFS reachability check, since BFS's coarse grid can
// pass a point that's still too tight for real steering.**
// Re-verified with the real engine (`_verify_c1_final.mjs`/
// `_rigorous_check.mjs`-style harnesses): every door/home/goto/patrol
// point, interactable, and all three exits reachable from spawn; a 1800s
// NPC sim, all 12 villagers complete 19-36 clean home/wander cycles with
// `maxStuckAny` exactly matching each one's own scripted `wait`, zero
// permanent freezes. **Not yet live-verified in-browser.**
//
// Chimney smoke reworked 2026-09-08 (Danny) — the previous 6
// building-linked plumes removed; replaced with 4 plumes at Danny's own
// explicit map coordinates (not tied to any specific building this time),
// same thin-plume tuning as before (count 11, rise 150, drift 13, baseR
// 5, growR 15, speed 0.12, alpha 0.34, staggered seed 0/0.25/0.5/0.75).
//
// Building doors relocated 2026-09-03 (Danny sent corrected per-building
// coordinates against the current art + collision). Five of the ten
// requested points (Senna, Aldous, Nils, Isolde, Cade) landed 73-87px inside
// blocked terrain and were snapped to the nearest walkable+reachable point
// (same technique as the round-2 Isolde-patrol fix above); the other five
// landed clean. NPC spawn points, routine `goto`s, and Isolde/Cade's patrol
// loops were all re-derived from each building's door move (same relative
// offset as before the move) and re-verified reachable + livelock-free.

export default {
  id: 'C1',
  name: 'Tidewrack Harbor',
  background: 'assets/images/C1_Background.jpg',
  width: 3000,
  height: 3000,
  // Its own overworld track (2026-09-09, Danny) instead of the generic
  // overworld theme — see audio.js's TRACKS.c1 and main.js's
  // sceneMusicTrack() (generalized from a cave-only special-case to a
  // TRACKS-key lookup so any scene can declare its own music this way).
  music: 'c1',

  // Just inside the south (D1-facing) edge — only used on a direct boot;
  // normal arrival comes up through the scene-transition system.
  spawn: { x: 1500, y: 2900 },

  obstacles: [
    { x: 0, y: 0, w: 1300, h: 25 },
    { x: 1475, y: 0, w: 1525, h: 25 },
    { x: 0, y: 25, w: 1050, h: 25 },
    { x: 1525, y: 25, w: 1475, h: 50 },
    { x: 0, y: 50, w: 1025, h: 75 },
    { x: 1525, y: 75, w: 225, h: 25 },
    { x: 1800, y: 75, w: 1200, h: 25 },
    { x: 1550, y: 100, w: 200, h: 50 },
    { x: 1825, y: 100, w: 1175, h: 25 },
    { x: 0, y: 125, w: 1075, h: 25 },
    { x: 1850, y: 125, w: 1150, h: 25 },
    { x: 0, y: 150, w: 1100, h: 50 },
    { x: 1550, y: 150, w: 25, h: 25 },
    { x: 1625, y: 150, w: 125, h: 25 },
    { x: 1875, y: 150, w: 1125, h: 100 },
    { x: 1225, y: 175, w: 125, h: 25 },
    { x: 1650, y: 175, w: 100, h: 25 },
    { x: 0, y: 200, w: 1125, h: 50 },
    { x: 1200, y: 200, w: 175, h: 25 },
    { x: 1625, y: 200, w: 100, h: 25 },
    { x: 1200, y: 225, w: 200, h: 200 },
    { x: 1600, y: 225, w: 100, h: 50 },
    { x: 0, y: 250, w: 1075, h: 25 },
    { x: 1925, y: 250, w: 1075, h: 75 },
    { x: 0, y: 275, w: 1050, h: 75 },
    { x: 1600, y: 275, w: 150, h: 25 },
    { x: 1575, y: 300, w: 50, h: 25 },
    { x: 1650, y: 300, w: 50, h: 25 },
    { x: 1600, y: 325, w: 25, h: 25 },
    { x: 1925, y: 325, w: 50, h: 25 },
    { x: 2000, y: 325, w: 75, h: 50 },
    { x: 2125, y: 325, w: 875, h: 25 },
    { x: 0, y: 350, w: 1075, h: 25 },
    { x: 1750, y: 350, w: 50, h: 50 },
    { x: 2150, y: 350, w: 850, h: 25 },
    { x: 0, y: 375, w: 1100, h: 25 },
    { x: 2025, y: 375, w: 50, h: 25 },
    { x: 2250, y: 375, w: 750, h: 100 },
    { x: 0, y: 400, w: 1125, h: 25 },
    { x: 0, y: 425, w: 1100, h: 150 },
    { x: 1225, y: 425, w: 150, h: 25 },
    { x: 1550, y: 425, w: 75, h: 25 },
    { x: 1525, y: 450, w: 100, h: 25 },
    { x: 1925, y: 450, w: 25, h: 25 },
    { x: 1525, y: 475, w: 125, h: 75 },
    { x: 1825, y: 475, w: 250, h: 25 },
    { x: 2175, y: 475, w: 825, h: 50 },
    { x: 1775, y: 500, w: 300, h: 25 },
    { x: 1750, y: 525, w: 325, h: 25 },
    { x: 2175, y: 525, w: 200, h: 200 },
    { x: 2400, y: 525, w: 600, h: 25 },
    { x: 1200, y: 550, w: 100, h: 100 },
    { x: 1525, y: 550, w: 150, h: 25 },
    { x: 1750, y: 550, w: 350, h: 25 },
    { x: 2425, y: 550, w: 575, h: 25 },
    { x: 0, y: 575, w: 1125, h: 25 },
    { x: 1500, y: 575, w: 175, h: 25 },
    { x: 1775, y: 575, w: 325, h: 25 },
    { x: 2450, y: 575, w: 550, h: 125 },
    { x: 0, y: 600, w: 1100, h: 25 },
    { x: 1500, y: 600, w: 150, h: 25 },
    { x: 1750, y: 600, w: 350, h: 75 },
    { x: 0, y: 625, w: 1075, h: 50 },
    { x: 1500, y: 625, w: 125, h: 25 },
    { x: 1550, y: 650, w: 50, h: 25 },
    { x: 0, y: 675, w: 1050, h: 50 },
    { x: 1650, y: 675, w: 450, h: 25 },
    { x: 1600, y: 700, w: 250, h: 25 },
    { x: 1875, y: 700, w: 225, h: 25 },
    { x: 2425, y: 700, w: 575, h: 25 },
    { x: 0, y: 725, w: 1025, h: 75 },
    { x: 1600, y: 725, w: 225, h: 25 },
    { x: 2450, y: 725, w: 550, h: 50 },
    { x: 1600, y: 750, w: 250, h: 50 },
    { x: 2150, y: 775, w: 25, h: 25 },
    { x: 2500, y: 775, w: 500, h: 25 },
    { x: 0, y: 800, w: 1000, h: 25 },
    { x: 1250, y: 800, w: 75, h: 25 },
    { x: 1375, y: 800, w: 50, h: 25 },
    { x: 1600, y: 800, w: 200, h: 25 },
    { x: 2075, y: 800, w: 50, h: 25 },
    { x: 2150, y: 800, w: 125, h: 25 },
    { x: 2525, y: 800, w: 475, h: 25 },
    { x: 0, y: 825, w: 750, h: 25 },
    { x: 1250, y: 825, w: 100, h: 50 },
    { x: 1575, y: 825, w: 225, h: 50 },
    { x: 2075, y: 825, w: 250, h: 25 },
    { x: 2550, y: 825, w: 450, h: 25 },
    { x: 0, y: 850, w: 650, h: 75 },
    { x: 700, y: 850, w: 50, h: 25 },
    { x: 2100, y: 850, w: 225, h: 200 },
    { x: 2575, y: 850, w: 425, h: 25 },
    { x: 1000, y: 875, w: 50, h: 25 },
    { x: 1225, y: 875, w: 125, h: 25 },
    { x: 1600, y: 875, w: 200, h: 25 },
    { x: 2600, y: 875, w: 400, h: 25 },
    { x: 975, y: 900, w: 425, h: 50 },
    { x: 2400, y: 900, w: 100, h: 50 },
    { x: 2650, y: 900, w: 350, h: 25 },
    { x: 0, y: 925, w: 675, h: 25 },
    { x: 1850, y: 925, w: 150, h: 25 },
    { x: 2675, y: 925, w: 325, h: 25 },
    { x: 0, y: 950, w: 750, h: 100 },
    { x: 900, y: 950, w: 500, h: 100 },
    { x: 1825, y: 950, w: 200, h: 75 },
    { x: 2400, y: 950, w: 125, h: 50 },
    { x: 2700, y: 950, w: 300, h: 25 },
    { x: 1750, y: 975, w: 50, h: 50 },
    { x: 2725, y: 975, w: 275, h: 25 },
    { x: 2400, y: 1000, w: 100, h: 25 },
    { x: 2750, y: 1000, w: 250, h: 25 },
    { x: 1725, y: 1025, w: 300, h: 25 },
    { x: 2425, y: 1025, w: 50, h: 25 },
    { x: 2500, y: 1025, w: 25, h: 25 },
    { x: 2575, y: 1025, w: 25, h: 25 },
    { x: 2775, y: 1025, w: 50, h: 25 },
    { x: 2875, y: 1025, w: 125, h: 25 },
    { x: 0, y: 1050, w: 775, h: 75 },
    { x: 900, y: 1050, w: 550, h: 25 },
    { x: 1700, y: 1050, w: 325, h: 25 },
    { x: 2500, y: 1050, w: 100, h: 25 },
    { x: 2900, y: 1050, w: 100, h: 25 },
    { x: 900, y: 1075, w: 600, h: 25 },
    { x: 1700, y: 1075, w: 75, h: 50 },
    { x: 1825, y: 1075, w: 200, h: 75 },
    { x: 2475, y: 1075, w: 175, h: 25 },
    { x: 2925, y: 1075, w: 75, h: 25 },
    { x: 900, y: 1100, w: 575, h: 25 },
    { x: 2150, y: 1100, w: 50, h: 25 },
    { x: 2375, y: 1100, w: 50, h: 75 },
    { x: 2475, y: 1100, w: 150, h: 25 },
    { x: 2950, y: 1100, w: 50, h: 25 },
    { x: 0, y: 1125, w: 750, h: 75 },
    { x: 900, y: 1125, w: 550, h: 50 },
    { x: 2125, y: 1125, w: 100, h: 50 },
    { x: 2475, y: 1125, w: 125, h: 50 },
    { x: 2975, y: 1125, w: 25, h: 25 },
    { x: 1875, y: 1150, w: 150, h: 25 },
    { x: 900, y: 1175, w: 525, h: 50 },
    { x: 1900, y: 1175, w: 100, h: 25 },
    { x: 2350, y: 1175, w: 75, h: 25 },
    { x: 2475, y: 1175, w: 150, h: 25 },
    { x: 2825, y: 1175, w: 25, h: 25 },
    { x: 0, y: 1200, w: 375, h: 25 },
    { x: 500, y: 1200, w: 250, h: 25 },
    { x: 1575, y: 1200, w: 400, h: 50 },
    { x: 2275, y: 1200, w: 25, h: 25 },
    { x: 2325, y: 1200, w: 125, h: 25 },
    { x: 2500, y: 1200, w: 50, h: 50 },
    { x: 2750, y: 1200, w: 100, h: 25 },
    { x: 0, y: 1225, w: 325, h: 25 },
    { x: 575, y: 1225, w: 200, h: 50 },
    { x: 900, y: 1225, w: 500, h: 75 },
    { x: 2175, y: 1225, w: 275, h: 25 },
    { x: 2725, y: 1225, w: 175, h: 25 },
    { x: 0, y: 1250, w: 300, h: 425 },
    { x: 1575, y: 1250, w: 525, h: 150 },
    { x: 2200, y: 1250, w: 250, h: 25 },
    { x: 2525, y: 1250, w: 100, h: 25 },
    { x: 2700, y: 1250, w: 225, h: 25 },
    { x: 350, y: 1275, w: 175, h: 150 },
    { x: 575, y: 1275, w: 175, h: 100 },
    { x: 2225, y: 1275, w: 400, h: 25 },
    { x: 2750, y: 1275, w: 250, h: 25 },
    { x: 900, y: 1300, w: 50, h: 25 },
    { x: 1075, y: 1300, w: 325, h: 75 },
    { x: 2225, y: 1300, w: 125, h: 25 },
    { x: 2450, y: 1300, w: 175, h: 25 },
    { x: 2725, y: 1300, w: 275, h: 50 },
    { x: 2225, y: 1325, w: 100, h: 25 },
    { x: 2475, y: 1325, w: 125, h: 25 },
    { x: 2225, y: 1350, w: 75, h: 50 },
    { x: 2500, y: 1350, w: 100, h: 75 },
    { x: 2775, y: 1350, w: 225, h: 100 },
    { x: 1150, y: 1375, w: 225, h: 50 },
    { x: 1575, y: 1400, w: 550, h: 25 },
    { x: 600, y: 1425, w: 150, h: 25 },
    { x: 1575, y: 1425, w: 650, h: 75 },
    { x: 2525, y: 1425, w: 25, h: 25 },
    { x: 575, y: 1450, w: 200, h: 225 },
    { x: 1200, y: 1450, w: 125, h: 25 },
    { x: 2750, y: 1450, w: 250, h: 50 },
    { x: 2300, y: 1475, w: 50, h: 25 },
    { x: 1575, y: 1500, w: 350, h: 25 },
    { x: 2050, y: 1500, w: 175, h: 100 },
    { x: 2275, y: 1500, w: 125, h: 25 },
    { x: 2725, y: 1500, w: 275, h: 25 },
    { x: 925, y: 1525, w: 425, h: 25 },
    { x: 1575, y: 1525, w: 325, h: 25 },
    { x: 2250, y: 1525, w: 175, h: 50 },
    { x: 2700, y: 1525, w: 300, h: 25 },
    { x: 925, y: 1550, w: 275, h: 25 },
    { x: 1250, y: 1550, w: 150, h: 25 },
    { x: 1800, y: 1550, w: 50, h: 50 },
    { x: 2675, y: 1550, w: 325, h: 50 },
    { x: 925, y: 1575, w: 125, h: 25 },
    { x: 1125, y: 1575, w: 75, h: 25 },
    { x: 1275, y: 1575, w: 125, h: 50 },
    { x: 2250, y: 1575, w: 200, h: 50 },
    { x: 900, y: 1600, w: 175, h: 50 },
    { x: 2000, y: 1600, w: 100, h: 25 },
    { x: 2650, y: 1600, w: 350, h: 25 },
    { x: 1150, y: 1625, w: 50, h: 25 },
    { x: 1325, y: 1625, w: 50, h: 25 },
    { x: 1975, y: 1625, w: 125, h: 50 },
    { x: 2350, y: 1625, w: 125, h: 50 },
    { x: 2575, y: 1625, w: 425, h: 25 },
    { x: 925, y: 1650, w: 150, h: 175 },
    { x: 1125, y: 1650, w: 75, h: 25 },
    { x: 2600, y: 1650, w: 400, h: 25 },
    { x: 0, y: 1675, w: 325, h: 25 },
    { x: 550, y: 1675, w: 225, h: 25 },
    { x: 1125, y: 1675, w: 100, h: 25 },
    { x: 1975, y: 1675, w: 100, h: 25 },
    { x: 2375, y: 1675, w: 75, h: 25 },
    { x: 2575, y: 1675, w: 425, h: 25 },
    { x: 0, y: 1700, w: 350, h: 25 },
    { x: 525, y: 1700, w: 225, h: 25 },
    { x: 1100, y: 1700, w: 150, h: 50 },
    { x: 1600, y: 1700, w: 25, h: 25 },
    { x: 2000, y: 1700, w: 75, h: 25 },
    { x: 2400, y: 1700, w: 25, h: 25 },
    { x: 2525, y: 1700, w: 475, h: 25 },
    { x: 0, y: 1725, w: 450, h: 25 },
    { x: 475, y: 1725, w: 275, h: 25 },
    { x: 1575, y: 1725, w: 100, h: 25 },
    { x: 2550, y: 1725, w: 450, h: 25 },
    { x: 0, y: 1750, w: 750, h: 100 },
    { x: 1100, y: 1750, w: 125, h: 25 },
    { x: 1350, y: 1750, w: 50, h: 25 },
    { x: 1550, y: 1750, w: 125, h: 25 },
    { x: 2200, y: 1750, w: 125, h: 25 },
    { x: 2525, y: 1750, w: 475, h: 25 },
    { x: 1125, y: 1775, w: 100, h: 25 },
    { x: 1325, y: 1775, w: 50, h: 25 },
    { x: 1550, y: 1775, w: 200, h: 25 },
    { x: 2175, y: 1775, w: 175, h: 25 },
    { x: 2550, y: 1775, w: 450, h: 25 },
    { x: 1150, y: 1800, w: 50, h: 25 },
    { x: 1300, y: 1800, w: 75, h: 25 },
    { x: 1550, y: 1800, w: 375, h: 50 },
    { x: 2150, y: 1800, w: 200, h: 125 },
    { x: 2525, y: 1800, w: 475, h: 25 },
    { x: 900, y: 1825, w: 175, h: 25 },
    { x: 1150, y: 1825, w: 75, h: 50 },
    { x: 1250, y: 1825, w: 125, h: 50 },
    { x: 2550, y: 1825, w: 450, h: 25 },
    { x: 0, y: 1850, w: 1050, h: 125 },
    { x: 1625, y: 1850, w: 300, h: 25 },
    { x: 2600, y: 1850, w: 400, h: 25 },
    { x: 1175, y: 1875, w: 200, h: 25 },
    { x: 1650, y: 1875, w: 275, h: 175 },
    { x: 2625, y: 1875, w: 375, h: 25 },
    { x: 1200, y: 1900, w: 175, h: 50 },
    { x: 2650, y: 1900, w: 350, h: 175 },
    { x: 2175, y: 1925, w: 150, h: 25 },
    { x: 2375, y: 1925, w: 100, h: 25 },
    { x: 1075, y: 1950, w: 25, h: 25 },
    { x: 1200, y: 1950, w: 200, h: 25 },
    { x: 2350, y: 1950, w: 150, h: 25 },
    { x: 0, y: 1975, w: 1125, h: 150 },
    { x: 1225, y: 1975, w: 175, h: 25 },
    { x: 2325, y: 1975, w: 175, h: 100 },
    { x: 1225, y: 2000, w: 200, h: 25 },
    { x: 1250, y: 2025, w: 175, h: 50 },
    { x: 1625, y: 2050, w: 325, h: 25 },
    { x: 1325, y: 2075, w: 100, h: 25 },
    { x: 1600, y: 2075, w: 375, h: 25 },
    { x: 2350, y: 2075, w: 150, h: 25 },
    { x: 2625, y: 2075, w: 375, h: 25 },
    { x: 1575, y: 2100, w: 400, h: 25 },
    { x: 2375, y: 2100, w: 75, h: 25 },
    { x: 2600, y: 2100, w: 400, h: 125 },
    { x: 0, y: 2125, w: 875, h: 50 },
    { x: 900, y: 2125, w: 225, h: 25 },
    { x: 1550, y: 2125, w: 425, h: 75 },
    { x: 925, y: 2150, w: 200, h: 25 },
    { x: 0, y: 2175, w: 850, h: 100 },
    { x: 950, y: 2175, w: 175, h: 25 },
    { x: 975, y: 2200, w: 25, h: 25 },
    { x: 1050, y: 2200, w: 75, h: 25 },
    { x: 1550, y: 2200, w: 250, h: 25 },
    { x: 1850, y: 2200, w: 100, h: 25 },
    { x: 1075, y: 2225, w: 50, h: 25 },
    { x: 1200, y: 2225, w: 50, h: 100 },
    { x: 1550, y: 2225, w: 225, h: 50 },
    { x: 2300, y: 2225, w: 75, h: 25 },
    { x: 2475, y: 2225, w: 50, h: 25 },
    { x: 2575, y: 2225, w: 425, h: 50 },
    { x: 2275, y: 2250, w: 125, h: 25 },
    { x: 2450, y: 2250, w: 75, h: 25 },
    { x: 0, y: 2275, w: 825, h: 125 },
    { x: 1550, y: 2275, w: 200, h: 25 },
    { x: 2250, y: 2275, w: 750, h: 25 },
    { x: 1575, y: 2300, w: 175, h: 25 },
    { x: 2025, y: 2300, w: 975, h: 25 },
    { x: 1125, y: 2325, w: 150, h: 25 },
    { x: 1625, y: 2325, w: 50, h: 25 },
    { x: 1975, y: 2325, w: 1025, h: 25 },
    { x: 1000, y: 2350, w: 275, h: 25 },
    { x: 1950, y: 2350, w: 1050, h: 25 },
    { x: 1000, y: 2375, w: 325, h: 75 },
    { x: 1925, y: 2375, w: 1075, h: 150 },
    { x: 0, y: 2400, w: 800, h: 25 },
    { x: 1575, y: 2400, w: 75, h: 25 },
    { x: 1700, y: 2400, w: 100, h: 25 },
    { x: 0, y: 2425, w: 775, h: 50 },
    { x: 1575, y: 2425, w: 225, h: 25 },
    { x: 975, y: 2450, w: 350, h: 50 },
    { x: 1550, y: 2450, w: 250, h: 25 },
    { x: 0, y: 2475, w: 750, h: 25 },
    { x: 1550, y: 2475, w: 225, h: 25 },
    { x: 0, y: 2500, w: 725, h: 25 },
    { x: 925, y: 2500, w: 400, h: 25 },
    { x: 1500, y: 2500, w: 275, h: 75 },
    { x: 0, y: 2525, w: 700, h: 25 },
    { x: 925, y: 2525, w: 375, h: 25 },
    { x: 1900, y: 2525, w: 1100, h: 25 },
    { x: 0, y: 2550, w: 675, h: 25 },
    { x: 900, y: 2550, w: 375, h: 25 },
    { x: 1875, y: 2550, w: 1125, h: 100 },
    { x: 0, y: 2575, w: 650, h: 25 },
    { x: 875, y: 2575, w: 375, h: 25 },
    { x: 1500, y: 2575, w: 250, h: 25 },
    { x: 0, y: 2600, w: 625, h: 100 },
    { x: 825, y: 2600, w: 400, h: 25 },
    { x: 1500, y: 2600, w: 225, h: 25 },
    { x: 800, y: 2625, w: 450, h: 25 },
    { x: 1525, y: 2625, w: 200, h: 50 },
    { x: 775, y: 2650, w: 475, h: 25 },
    { x: 1950, y: 2650, w: 1050, h: 50 },
    { x: 725, y: 2675, w: 525, h: 25 },
    { x: 1550, y: 2675, w: 150, h: 25 },
    { x: 0, y: 2700, w: 600, h: 50 },
    { x: 725, y: 2700, w: 550, h: 50 },
    { x: 1575, y: 2700, w: 100, h: 25 },
    { x: 1925, y: 2700, w: 1075, h: 25 },
    { x: 1950, y: 2725, w: 1050, h: 75 },
    { x: 0, y: 2750, w: 625, h: 100 },
    { x: 725, y: 2750, w: 425, h: 25 },
    { x: 1200, y: 2750, w: 75, h: 25 },
    { x: 750, y: 2775, w: 375, h: 25 },
    { x: 1225, y: 2775, w: 50, h: 25 },
    { x: 750, y: 2800, w: 325, h: 25 },
    { x: 2000, y: 2800, w: 1000, h: 25 },
    { x: 750, y: 2825, w: 250, h: 25 },
    { x: 1625, y: 2825, w: 50, h: 25 },
    { x: 2025, y: 2825, w: 975, h: 25 },
    { x: 0, y: 2850, w: 650, h: 25 },
    { x: 725, y: 2850, w: 275, h: 25 },
    { x: 1625, y: 2850, w: 75, h: 25 },
    { x: 2000, y: 2850, w: 1000, h: 25 },
    { x: 0, y: 2875, w: 1000, h: 25 },
    { x: 1600, y: 2875, w: 125, h: 25 },
    { x: 1975, y: 2875, w: 1025, h: 25 },
    { x: 0, y: 2900, w: 1025, h: 25 },
    { x: 1050, y: 2900, w: 75, h: 25 },
    { x: 1550, y: 2900, w: 200, h: 25 },
    { x: 1925, y: 2900, w: 1075, h: 25 },
    { x: 0, y: 2925, w: 1150, h: 25 },
    { x: 1225, y: 2925, w: 75, h: 25 },
    { x: 1550, y: 2925, w: 225, h: 50 },
    { x: 1875, y: 2925, w: 1125, h: 50 },
    { x: 0, y: 2950, w: 1325, h: 25 },
    { x: 0, y: 2975, w: 1350, h: 25 },
    { x: 1550, y: 2975, w: 1450, h: 25 },
  ],

  // Proximity labels. Every home below has its own "X's House"/business-name
  // entry (door matches the NPC's home.door); the rest are landmark-only
  // (no door — never link to a home reveal). Repositioned 2026-09-02 to sit
  // on the new art's actual roofs (see the header comment) — the old
  // watchtower is gone from this render (there's a well at the north
  // crossroads instead), so that label was dropped.
  buildings: [
    // Doors relocated 2026-09-03 (Danny sent corrected per-building door
    // coordinates against the current art). Doors use Danny's EXACT
    // coordinates even where that lands inside collision (round 2, same
    // day — he confirmed that's fine: the door only needs SOME walkable
    // ground within interaction range, not to itself be walkable; see
    // world.js's DOOR_RANGE=79 and homeNpcNearDoor()). Two are a little
    // past that range — Senna ~87px, Nils ~80px to the nearest walkable
    // ground — flagged in CLAUDE.md; the rest are within range.
    //
    // Label x,y RE-DERIVED 2026-09-09 (Danny: Farrows' label "way above" its
    // door — turned out ALL 11 were, because the prior pass above kept each
    // label at the same numeric offset from the OLD (pre-2026-09-03) door
    // position, which doesn't mean anything once the door itself moved.
    // Every other scene in the game (see D2/D3) keeps the label tight and
    // consistent — x == door.x, y a small fixed amount above door.y (D2 uses
    // exactly 31px; D3 varies ~31-109px per building's art). C1 never got
    // that treatment because its doors were moved after the labels were
    // authored. Now standardized to door.x, door.y-45 for all 11 — verified
    // against the actual background art (js/data/c1.js's C1_Background.jpg)
    // to confirm each still lands on open, readable ground near the door.
    { label: 'Dockmaster’s Warehouse', x: 1388, y: 1347, r: 260, door: { x: 1388, y: 1392 } },
    { label: 'Perrin’s Cookhouse', x: 2024, y: 1476, r: 190, door: { x: 2024, y: 1521 } },
    { label: 'The Farrows’ House', x: 1646, y: 1866, r: 180, door: { x: 1646, y: 1911 } },
    { label: 'Wynne’s House', x: 1929, y: 864, r: 180, door: { x: 1929, y: 909 } },
    { label: 'Garrick’s House', x: 1604, y: 710, r: 180, door: { x: 1604, y: 755 } },
    { label: 'Senna’s House', x: 1964, y: 662, r: 170, door: { x: 1964, y: 707 } },
    { label: 'Aldous’s House', x: 2276, y: 670, r: 170, door: { x: 2276, y: 715 } },
    { label: 'Nils’s House', x: 2222, y: 1011, r: 170, door: { x: 2222, y: 1056 } },
    { label: 'Skitter’s Shed', x: 1235, y: 1748, r: 190, door: { x: 1235, y: 1793 } },
    // Isolde and Cade have real houses now (2026-09-03) and go home
    // occasionally like any other villager (see their npc entries below —
    // they were patrol-only wanderers before this pass).
    { label: 'Isolde’s House', x: 2190, y: 1901, r: 180, door: { x: 2190, y: 1946 } },
    { label: 'Cade Fathom’s House', x: 2339, y: 2044, r: 180, door: { x: 2339, y: 2089 } },
    { label: 'The Old Well', x: 1300, y: 300, r: 180 },
    { label: 'Maiden’s Grace', x: 500, y: 1400, r: 480 },
  ],

  // Chimney smoke on half the village's homes (2026-09-03, Danny) — thin
  // plumes, same tuning as D2's chimney smoke (count 11, rise 150, drift 13,
  // baseR 5, growR 15, speed 0.12, alpha 0.34), sourced ~190px above each
  // building's door (roughly roof height). Spread across the map rather than
  // clustered: the warehouse, the Farrows', Garrick's, Nils's, Skitter's, and
  // Cade's — leaving Perrin's Cookhouse (already has its own cook-fire feel),
  // Wynne's, Senna's, Aldous's, and Isolde's bare.
  smoke: [
    { x: 1259, y: 1091, count: 11, rise: 150, drift: 13, baseR: 5, growR: 15, speed: 0.12, alpha: 0.34, seed: 0.0 },
    { x: 1844, y: 1261, count: 11, rise: 150, drift: 13, baseR: 5, growR: 15, speed: 0.12, alpha: 0.34, seed: 0.25 },
    { x: 2228, y: 815, count: 11, rise: 150, drift: 13, baseR: 5, growR: 15, speed: 0.12, alpha: 0.34, seed: 0.5 },
    { x: 1934, y: 459, count: 11, rise: 150, drift: 13, baseR: 5, growR: 15, speed: 0.12, alpha: 0.34, seed: 0.75 },
  ],

  // Ambient water ripple (2026-09-09, Danny) — a persistent, larger ripple
  // effect (bigger than the fishing-cast ripple's ~52px max radius) in the
  // Tidefolk's tide pool, centered between Isolde's and Cade's huts. Drawn
  // behind the player and NPCs (see world.js's drawWaterRipple() and its
  // render() call site). Default maxR (95px) fits comfortably inside the
  // pool without overlapping the surrounding rocks.
  waterRipples: [
    { x: 2165, y: 2045 },
  ],

  entrances: [],

  interactables: [
    // Lily Farrow's lost-gull quest (2026-09-10, replaces the old plain-gold
    // "flash of grey and white" collectible) — a trail of feathers scattered
    // across the village, leading east toward the cave entrance where the
    // gull herself is waiting (js/data/c1b.js). Basic, low-value pickups
    // (js/data/items.js's `feather`) — main.js's buildLilyDialog checks the
    // player's inventory for them directly, not a `collected` flag here.
    {
      id: 'c1_feather_1',
      x: 1415, y: 727,
      label: 'A Feather',
      message: 'A single grey-and-white feather, caught in the grass.',
      reward: { item: 'feather', qty: 1 },
    },
    {
      id: 'c1_feather_2',
      x: 1417, y: 480,
      label: 'A Feather',
      message: 'Another feather, a little further along.',
      reward: { item: 'feather', qty: 1 },
    },
    {
      id: 'c1_feather_3',
      x: 1552, y: 403,
      label: 'A Feather',
      message: 'A few more feathers here, like something struggled.',
      reward: { item: 'feather', qty: 1 },
    },
    {
      id: 'c1_feather_4',
      x: 1783, y: 427,
      label: 'A Feather',
      message: 'More feathers, leading east along the rocky ground.',
      reward: { item: 'feather', qty: 1 },
    },
    {
      id: 'c1_feather_5',
      x: 2048, y: 431,
      label: 'A Feather',
      message: 'One last feather, right at the mouth of a dark, narrow crack in the rock.',
      reward: { item: 'feather', qty: 1 },
    },
    // Cave entrance (2026-09-10) — interact to enter the C1B cave, the same
    // way D1's cave_d1b_entrance works. Sits right at the old "Tidepool Cove"
    // landmark spot (now removed, see the buildings comment above); the
    // point itself is only 7px clear of the cliff art (same as a building
    // door — see the header comment on doors above), but open ground sits
    // well within `range` a few steps away.
    {
      id: 'cave_c1b_entrance',
      x: 2243, y: 388,
      range: 141,
      cave: 'C1B',
      label: 'Hidden Cave',
    },
  ],

  // Fishing spot removed 2026-09-03 (Danny) — it sat right where Cade and
  // Isolde's new houses were placed, in the tide-pool cove.
  // New spot added 2026-09-09 (Danny) — the west shoreline below the
  // Maiden's Grace, verified walkable sand right at the waterline.
  fishingSpots: [
    { x: 647, y: 2724 },
  ],

  chests: [],
  battles: [],
  ambushes: [],

  // South back to D1 (band matches D1's existing top exit exactly — see the
  // header comment). North toward B1 and east toward C2 reach the edges but
  // aren't built yet — the frame loop shows the "isn't ready yet" toast for
  // those. Bands re-measured 2026-09-02 against the new art's actual open
  // ground at each edge (aprons carved a little wider than the natural gaps
  // for a safe margin).
  exits: [
    { edge: 'bottom', xMin: 1375, xMax: 1625, to: 'D1', note: 'the coastal trail back down to the cove' },
    { edge: 'top', xMin: 1350, xMax: 1550, to: 'B1', note: 'the trail climbs north past the crossroads well' },
    { edge: 'right', yMin: 1130, yMax: 1290, to: 'C2', note: 'the road east toward the grassland' },
  ],

  // ---- Tidewrack NPCs (2026-09-02, repositioned for the new art) ----
  // 12 villagers (9 human, 1 reformed Bramblekin, 2 Tidefolk — see CLAUDE.md's
  // confirmed roster) + a 2-strong mireman `pack` guarding the ship itself
  // (moved onto the ship's deck, near its cargo hatch, per Danny — was
  // patrolling the dock walkway). Homes' doors are all pre-verified walkable
  // with the real 36px collider (see the header comment); `approach` is
  // omitted everywhere since every door point here already IS the walkable
  // step-out spot (same as D3's path-side doors — see world.js's
  // home.approach comment).
  npcs: [
    {
      id: 'perrin_alders', name: 'Perrin Alders', role: 'COOK',
      sprite: 'assets/images/perrin_alders_overhead.png',
      portrait: 'assets/images/perrin_alders.png',
      speed: 40, startsHome: true,
      home: { door: { x: 2024, y: 1521 }, interior: 'assets/images/tavern_interior.jpg' },
      routine: [
        { do: 'wait', s: 70 },
        { do: 'leaveHome' },
        { do: 'goto', x: 1967, y: 1818 },
        { do: 'wait', s: 6 },
        { do: 'goHome' },
      ],
    },
    {
      id: 'roderick_vane', name: 'Roderick Vane', role: 'DOCKMASTER',
      sprite: 'assets/images/roderick_vane_overhead.png',
      portrait: 'assets/images/roderick_vane.png',
      speed: 40, startsHome: true,
      home: { door: { x: 1388, y: 1392 }, interior: 'assets/images/general_goods_interior.jpg' },
      routine: [
        { do: 'wait', s: 55 },
        { do: 'leaveHome' },
        { do: 'goto', x: 1468, y: 1392 },
        { do: 'wait', s: 6 },
        { do: 'goHome' },
      ],
    },
    {
      id: 'wynne_ashcombe', name: 'Wynne Ashcombe', role: 'SHRINE-KEEPER',
      sprite: 'assets/images/wynne_ashcombe_overhead.png',
      portrait: 'assets/images/wynne_ashcombe.png',
      x: 1899, y: 857, speed: 38, startsHome: false,
      home: { door: { x: 1929, y: 909 }, interior: 'assets/images/fishing_village_home_interior.jpg' },
      routine: [
        { do: 'wait', s: 5 },
        { do: 'goto', x: 1964, y: 848 },
        { do: 'wait', s: 8 },
        { do: 'goHome' },
        { do: 'wait', s: 65 },
        { do: 'leaveHome' },
      ],
    },
    {
      id: 'toby_farrow', name: 'Toby Farrow', role: 'FISHERMAN',
      sprite: 'assets/images/toby_farrow_overhead.png',
      portrait: 'assets/images/toby_farrow.png',
      // Spawn fixed 2026-09-09 (Danny: Farrows spawned in an unwalkable
      // area) — old (1765,1992) was 0px clearance, literally inside the
      // house's own collision rect. New spot is a verified 60px-clearance
      // patch of yard just west of the door, on the way to his goto.
      x: 1590, y: 1960, speed: 40, startsHome: false,
      home: { door: { x: 1646, y: 1911 }, interior: 'assets/images/fishing_village_home_interior.jpg' },
      routine: [
        { do: 'wait', s: 6 },
        { do: 'goto', x: 1465, y: 1992 },
        { do: 'wait', s: 10 },
        { do: 'goHome' },
        { do: 'wait', s: 60 },
        { do: 'leaveHome' },
      ],
    },
    {
      id: 'lily_farrow', name: 'Lily Farrow', role: '',
      sprite: 'assets/images/lily_farrow_overhead.png',
      portrait: 'assets/images/lily_farrow.png',
      // Spawn fixed 2026-09-09 — old (1815,1942) was 0px clearance,
      // inside the house. New spot: verified 60px-clearance yard patch
      // just west of the door, near her first goto waypoint.
      x: 1580, y: 1915, speed: 50, startsHome: false,
      // Chase-then-talk (2026-09-10, her lost-gull quest): mirrors a
      // roaming creature's charge (world.js's updateNpcs — same aggroRange/
      // chaseSpeed fields, same "race in" steering) but ends in dialogue
      // (main.js's pendingChaseTalk -> openNpcDialog) instead of a fight.
      // Only fires while she's out of the house (skipped when atHome) and
      // `chaseTalk` is true — main.js flips that off on the live npc the
      // moment her quest resolves (completed OR failed), so she goes back to
      // being a normal routine-only NPC afterward. Range/speed match the
      // mireman creatures elsewhere in this same scene for consistency.
      chaseTalk: true, aggroRange: 300, chaseSpeed: 140,
      home: { door: { x: 1646, y: 1911 }, interior: 'assets/images/fishing_village_home_interior.jpg' },
      routine: [
        { do: 'wait', s: 4 },
        { do: 'goto', x: 1607, y: 1921 },
        { do: 'wait', s: 4 },
        { do: 'goto', x: 1520, y: 1945 },
        { do: 'wait', s: 4 },
        { do: 'goHome' },
        { do: 'wait', s: 30 },
        { do: 'leaveHome' },
      ],
    },
    {
      id: 'garrick_hollowmast', name: 'Garrick Hollowmast', role: '',
      sprite: 'assets/images/garrick_hollowmast_overhead.png',
      portrait: 'assets/images/garrick_hollowmast.png',
      x: 1396, y: 638, speed: 38, startsHome: false,
      // door sits deep enough inside the building's collision that leaveHome/
      // goHome couldn't path to/from it directly (found via a livelock sim,
      // 2026-09-03 round 3) — `approach` gives them a real walkable step-out
      // point nearby instead (world.js already prefers approach over door for
      // all actual walking; door alone still governs interaction range).
      home: { door: { x: 1604, y: 755 }, approach: { x: 1462, y: 722 }, interior: 'assets/images/fishing_village_home_interior.jpg' },
      routine: [
        { do: 'wait', s: 7 },
        { do: 'goto', x: 1446, y: 588 },
        { do: 'wait', s: 9 },
        { do: 'goHome' },
        { do: 'wait', s: 55 },
        { do: 'leaveHome' },
      ],
      // Garrick's payoff quest (carrying word back to Calder in D1) is
      // deliberately NOT wired up yet — flavor only for now, per CLAUDE.md's
      // "Row C design notes" (deferred to a future pass since it needs
      // cross-scene changes to D1's Calder dialogue).
      dialog: { line: 'Another day, another tally I don’t keep. Best not linger near me too long, friend — guilt’s not catching, but the drink might be.', responses: ['Leave.'] },
      chatter: [
        { q: 'What’s troubling you?', a: 'Nothing worth a stranger’s ear. Just… this village runs kinder than we deserve, some of us. Leave it there.' },
      ],
    },
    {
      id: 'senna_brineholt', name: 'Senna Brineholt', role: '',
      sprite: 'assets/images/senna_brineholt_overhead.png',
      portrait: 'assets/images/senna_brineholt.png',
      speed: 40, startsHome: true,
      home: { door: { x: 1964, y: 707 }, approach: { x: 1980, y: 765 }, interior: 'assets/images/fishing_village_home_interior.jpg' },
      routine: [
        { do: 'wait', s: 60 },
        { do: 'leaveHome' },
        { do: 'goto', x: 2058, y: 768 },
        { do: 'wait', s: 6 },
        { do: 'goHome' },
      ],
      dialog: { line: 'Tidewrack’s not much to look at, I’ll grant you — but coin spends the same here as anywhere. Mind you don’t let the salt take your boots; good leather’s dear this far from a proper market.', responses: ['Leave.'] },
      chatter: [
        { q: 'Where did your coin come from?', a: 'Enterprise, traveler. Just enterprise. …Ask Garrick if you want a longer story. Mine’s shorter, and I intend to keep it that way.' },
      ],
    },
    {
      id: 'nils_cutwater', name: 'Nils Cutwater', role: '',
      sprite: 'assets/images/nils_cutwater_overhead.png',
      portrait: 'assets/images/nils_cutwater.png',
      // Spawn fixed 2026-09-09 — old (2082,1249) was 1px clearance.
      // New spot: verified 45px-clearance ground near his goto waypoint.
      x: 2070, y: 1180, speed: 38, startsHome: false,
      home: { door: { x: 2222, y: 1056 }, interior: 'assets/images/fishing_village_home_interior.jpg' },
      routine: [
        { do: 'wait', s: 8 },
        { do: 'goto', x: 2082, y: 1199 },
        { do: 'wait', s: 10 },
        { do: 'goHome' },
        { do: 'wait', s: 50 },
        { do: 'leaveHome' },
      ],
      dialog: { line: 'Rope doesn’t mend itself.', responses: ['Leave.'] },
      chatter: [
        { q: 'Rough work?', a: 'Better than idle hands. Idle hands remember too much.' },
      ],
    },
    {
      id: 'aldous_marrow', name: 'Aldous Marrow', role: '',
      sprite: 'assets/images/aldous_marrow_overhead.png',
      portrait: 'assets/images/aldous_marrow.png',
      // Spawn fixed 2026-09-09 — old (2388,725) was 13px clearance,
      // under the 18px collider radius. New spot: verified 45px
      // clearance right next to his goto waypoint.
      x: 2340, y: 770, speed: 34, startsHome: false,
      home: { door: { x: 2276, y: 715 }, interior: 'assets/images/fishing_village_home_interior.jpg' },
      routine: [
        { do: 'wait', s: 9 },
        { do: 'goto', x: 2338, y: 775 },
        { do: 'wait', s: 8 },
        { do: 'goHome' },
        { do: 'wait', s: 45 },
        { do: 'leaveHome' },
      ],
      dialog: { line: 'Sit a spell, if your legs allow it. An old sailor’s tongue loosens easy enough with a bit of company.', responses: ['Leave.'] },
      chatter: [
        { q: 'Any word from the castle?', a: 'Rumor has it King Aldric’s sent his own knights out searching these past months — searching for what, nobody in Tidewrack rightly knows. Riders passing through don’t stop long enough to say, and the ones who might know more don’t come this far south at all.' },
        { q: 'Tell me a sea story.', a: 'I’ve buried more sea stories than years I’ve got left to tell them. Ask me again when the tide’s out and I’ve had my pipe — you’ll get a better one.' },
      ],
    },
    {
      id: 'skitter_nabbins', name: 'Skitter Nabbins', role: 'RATCATCHER',
      sprite: 'assets/images/skitter_nabbins_overhead.png',
      portrait: 'assets/images/skitter_nabbins.png',
      x: 1453, y: 1670, speed: 44, startsHome: false,
      home: { door: { x: 1235, y: 1793 }, interior: 'assets/images/skitter_nablins_home_interior.jpg' },
      routine: [
        { do: 'wait', s: 6 },
        { do: 'goto', x: 1503, y: 1670 },
        { do: 'wait', s: 8 },
        { do: 'goHome' },
        { do: 'wait', s: 40 },
        { do: 'leaveHome' },
      ],
      dialog: { line: 'Oh — oh, a visitor! Don’t mind the traps, they’re only set for rats, mostly. MOSTLY.', responses: ['Leave.'] },
      chatter: [
        { q: 'How’d you end up here?', a: 'Wandered in chasing a rat that chased a chicken that chased — well, it’s a long story, and the short of it is Tidewrack decided to keep me. Fair trade, I think. Rats for a roof.' },
      ],
    },
    // Tidefolk — have real houses now (2026-09-03 round 2) and go home
    // occasionally like any other villager (a plain leaveHome/goto/goHome
    // routine, same pattern as everyone else in this file — were a
    // patrol-only wander loop, same as C4's Mara/Vozhik, before this pass).
    // Repositioned 2026-09-02 to the new art's tide pool (SE corner, near
    // x2100-2300).
    {
      id: 'isolde_pearlwake', name: 'Isolde Pearlwake', role: 'HERBALIST',
      sprite: 'assets/images/isolde_pearlwake_overhead.png',
      portrait: 'assets/images/isolde_pearlwake.png',
      x: 2190, y: 1986, speed: 34, startsHome: false,
      // Has a house now (door added 2026-09-03) and goes home occasionally
      // like any other villager (round 2, same day — was patrol-only before,
      // door always locked; now a real leaveHome/goHome routine).
      home: { door: { x: 2190, y: 1946 }, interior: 'assets/images/fishing_village_hut_interior.jpg' },
      routine: [
        { do: 'wait', s: 6 },
        { do: 'goto', x: 2140, y: 2116 },
        { do: 'wait', s: 10 },
        { do: 'goHome' },
        { do: 'wait', s: 40 },
        { do: 'leaveHome' },
      ],
      dialog: { line: 'The tide pools hold more than crabs, if you know where to look. What brings you to my corner of the shore?', responses: ['Leave.'] },
      chatter: [
        { q: 'What is Tidefolk?', a: 'An old blood, older than this village. We keep to the water more than most — old habit, older than memory, if I’m honest with you.' },
      ],
    },
    {
      id: 'cade_fathom', name: 'Cade Fathom', role: 'DIVER',
      sprite: 'assets/images/cade_fathom_overhead.png',
      portrait: 'assets/images/cade_fathom.png',
      x: 2252, y: 2075, speed: 40, startsHome: false,
      // Has a house now too (door added 2026-09-03) — same "goes home
      // occasionally" treatment as Isolde, round 2. Same approach fix as
      // Garrick above: his door is buried deep enough in the building that
      // leaveHome/goHome need a real walkable step-out point instead.
      home: { door: { x: 2339, y: 2089 }, approach: { x: 2252, y: 2075 }, interior: 'assets/images/fishing_village_hut_interior.jpg' },
      routine: [
        { do: 'wait', s: 6 },
        { do: 'goto', x: 2261, y: 2134 },
        { do: 'wait', s: 10 },
        { do: 'goHome' },
        { do: 'wait', s: 45 },
        { do: 'leaveHome' },
      ],
      dialog: { line: 'You’ve got dry-land legs under you, but I’d wager you could learn to hold your breath if it came to it. Most can, with reason enough.', responses: ['Leave.'] },
      chatter: [
        { q: 'Could you dive the wreck?', a: 'Faster than any of Roderick’s rope-and-lantern crews, I’d wager — if he’d ever let me near it. Someday, maybe. When there’s a reason worth the risk.' },
      ],
    },

    // ---- Miremen guarding the Maiden's Grace (2026-09-02, moved onto the
    // ship 2026-09-02 round 2) ----
    // Two roaming `creature` miremen (down from three, per Danny), milling
    // right on the ship's own deck near its cargo hatch (the new art's ship
    // deck is walkable, with the hatch openings themselves blocked — see the
    // header comment) instead of the dock walkway. A `pack` (same mechanic as
    // C4's clearing bramblekin): striking either one drags both into one
    // fight, and winning clears them both. The ship's interior/cargo is
    // deliberately NOT built yet (Danny: "we'll focus on the ship later") —
    // this is just the deterrent guarding it for now.
    {
      id: 'mireman_c1_1', name: 'Mireman', role: '',
      creature: true, enemyId: 'mireman', pack: 'ship_miremen',
      sprite: 'assets/images/mireman_overhead.png',
      portrait: 'assets/images/mireman.png',
      x: 428, y: 1560, speed: 35, chaseSpeed: 140, aggroRange: 300, giveUpRange: 700, startsHome: false,
      patrol: [ { x: 428, y: 1560 }, { x: 470, y: 1480 } ],
    },
    {
      id: 'mireman_c1_2', name: 'Mireman', role: '',
      creature: true, enemyId: 'mireman', pack: 'ship_miremen',
      sprite: 'assets/images/mireman_overhead.png',
      portrait: 'assets/images/mireman.png',
      x: 390, y: 1650, speed: 35, chaseSpeed: 140, aggroRange: 300, giveUpRange: 700, startsHome: false,
      // Patrol point fixed 2026-09-09 — old (350,1700) was 0px clearance
      // (inside collision). New spot: verified 42.7px clearance, close by,
      // keeping the same short local patrol.
      patrol: [ { x: 390, y: 1650 }, { x: 365, y: 1660 } ],
    },
  ],
};
