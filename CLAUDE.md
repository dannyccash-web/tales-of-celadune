# Tales of Celadune — dev notes for Claude sessions

## Non-negotiables (from Danny)

- Web-first, no build step, no frameworks. Must stay 100% Steam-publishable later via Electron/Tauri wrap — never introduce anything that would force a refactor into another engine.
- Keep development clean and streamlined.
- Design spec lives in `docs/Fantasy_RPG_Game.pdf` (6 pages: dialog UI, battle UI, item-received UI, D3 overworld mockup, 4-layer spec, overworld map).

## Deployment (do this after every change set)

1. Commit and push to `main` at https://github.com/dannyccash-web/tales-of-celadune
2. GitHub Pages serves `main` branch root → https://dannyccash-web.github.io/tales-of-celadune/
3. Auth: Danny's GitHub token is stored in the local git remote URL (`git remote -v`) — not in any committed file. Never commit tokens.
4. Always verify the live URL after pushing (Pages can take ~1 min to update).
5. **Known quirk of this sandbox's mount of the project folder: it can't unlink (or rename) files** (confirmed: even a file just created with `touch` can't be `rm`'d or `mv`'d). Git relies on lock-file unlinks for `add`/`commit`/`push` (`.git/index.lock`, `.git/HEAD.lock`, `.git/refs/remotes/origin/*.lock`), so once any git command leaves one of these behind (e.g. a run that got interrupted), it's stuck forever and every future git write in the mounted `.git` fails with `Unable to create '.git/....lock': File exists`. `git status`/`log`/`diff` (read-only) keep working fine regardless — it's only writes that break, and a `GIT_INDEX_FILE` override alone isn't enough since HEAD/ref locks aren't affected by it. Reliable workaround: copy `.git` to a normal, writable filesystem (`/tmp`), strip any lock/tmp files from the copy, and point git at it with `--git-dir` while keeping `--work-tree` on the real project folder:
   ```
   WT="<absolute path to the project folder>"
   GD="/tmp/celadune_gitdir_$$_$(date +%s)"   # unique name — /tmp on this sandbox
                                                # has been observed to retain files
                                                # across sessions, don't reuse a name
   cp -r "$WT/.git" "$GD"
   find "$GD" -name "*.lock" -o -name "tmp_obj_*" | xargs -r rm -f
   git --git-dir="$GD" --work-tree="$WT" add -A
   git --git-dir="$GD" --work-tree="$WT" commit -m "..."
   git --git-dir="$GD" --work-tree="$WT" push origin main
   ```
   This leaves the mounted `.git` itself stale (still has its own stuck locks, now behind the new commit) — that's fine, it's only used read-only going forward from Claude sessions. If Danny works on this repo directly on his Mac, the stuck lock files are just normal Finder-deletable files there (this restriction is specific to how Cowork's sandbox mounts the folder), so `rm .git/*.lock` locally clears them.

## Design rules (from the PDF, page 5)

- Fixed 1920×1080 design resolution, scaled to window (see `ui.fitStage`).
- Scenes are 1920×1920; camera scrolls vertically only, clamped to edges.
- Player/NPC icons ~40px; icon bottom = front, faces travel direction.
- Arrow keys move, spacebar interacts. Paths/dirt/grass navigable; buildings, trees, fences, NPCs are obstacles.
- Building entrances sit where the building meets the path.
- Vignette.jpg multiplied over the world, fixed. UI 50px in from edges.
- Overworld 4×4: A1 School of Sorcery, A2/A3 Mountains, A4 Wizard's Fortress, B1 Grassland, B2 King's Castle, B3 Town, B4 Woods, C1 Village, C2 Grassland, C3/C4 Woods, D1 Grassland, D2 Village, D3 Farm ✅ built, D4 Woods.
- Scene transitions preserve position (exit D3 west mid-path → enter D2 at same path point on its east edge).

## Styling (matched to the PDF — keep consistent)

- Fonts (Google): MedievalSharp = HUD labels, gold count, Inventory/Menu, NPC name headings + canvas name labels. Metamorphous = dialog body, response options (selected #fff, unselected #a6a8ab), diamond icon letters. Lato = role caps (semibold #f3d19b, letter-spaced) and bar values.
- Gold frames are gradients (see css vars --frame-light/--frame-dark, --gold-bright/--gold-dark). Dialog boxes: 2px inner + 2px outer rect 9px out. Bars: pointed-hex clip-path with gradient border via padding trick.
- Dialog: 500x500 portrait window bottom-anchored right, image 500 wide top-justified; responses left-justified with the gold SVG arrow sliding in its own column.
- Icons: 3px multiply drop shadow to bottom-right, fixed angle regardless of rotation (canvas silhouette cache in world.js). Shadow alpha is SHADOW_ALPHA in world.js (0.46).
- NPCs steer around player/obstacles (side-committed steering, step+lookahead). Test logic headless in node: `new World({getContext:()=>({})}, scene, {})`, then `update()` in a loop. `window.world` is a live debug handle.
- Testing live: Pages caches JS for 10 min — `fetch(f, {cache:'reload'})` each module, then reload. rAF freezes when the browser window is hidden (drive `world.update` manually under automation).

## Gameplay conventions

- Player speed 130 px/s; icon mirrors horizontally every 0.25s while moving (walk effect) — see WALK_FLIP_INTERVAL in world.js. Same flip applies to NPCs (`npc.moving`/`npc.walkTimer` set in `updateNpcs` by diffing position before/after each tick, since movement happens across several branches — fading/paused/waiting NPCs don't flip). Footsteps loop plays while walking (`audio.setWalking(bool)` each frame, player only).
- Door SFX plays when NPCs leave/return home AND when the player enters/exits an interior.
- Building labels: `buildings: [{label, x, y, r}]` in scene data — drawn on canvas when player within r, centered directly over the building's door (same x as the door, y offset toward the interior — flipped to *below* the door for north-facing doors like Old Barn's). Names on D3: Mirelle's Farmhouse, Tuckwell's House (was Hay Barn), Brenna's House (was Tool Shed), Storehouse, Well, Animal Pen, Silo, Old Barn.
- Soundtrack: js/audio.js, one looped track at a time, `audio.play(src, fadeMs)` cross-fades. Start screen plays celadune_theme.mp3 (retried on first gesture — browser autoplay), Start button cross-fades to celadune_overworld.mp3. Battle/scene tracks later use the same call.
- Collision maps are hand-traced from a 25px grid overlay on the scene background (PIL script: 25px pink lines, 50px cyan, 100px red, labels every 100px; inspect per-quadrant crops). CONSERVATIVE RULE (from Danny): if any part of an object touches a 25px cell, the whole cell is blocked — all rect edges are multiples of 25. The well rect is x325-400, y775-900 (frame + stone base only, corrected from an earlier trace that over-extended to y925 and ate into the path); the full path band (y900-985) below it is clear, no detour needed.
- Each of the 4 main crop fields (upper-left, upper-right, lower-left, lower-right) is split into 2 rects with a ~50px walkable dirt lane between them (row-to-row furrows are real but too narrow for the 36px collider even where clear — only wider worker-path-style gaps are worth opening). Lane positions were found by color-classifying plant vs. dirt pixels per column (green/red plant colors vs. tan/brown dirt) and picking the cleanest ~50px window, then eyeballed against a cropped zoom to confirm before committing — pure per-cell auto-detection was too noisy (different crops have different foliage density/color). Lanes: upper-left x275-325, upper-right x1425-1475, lower-left x250-300, lower-right's field west edge pulled in to x1350 (joins the pen/silo corridor below instead of a separate lane).
- Silo access: the pen (x1050-1250, y1000-1300) and the lower-right field (now starting x1350 instead of x1300) leave a ~55-100px corridor at x1250-1350 running from the main path down past the pen to the silo's west/north side — enough for the player to walk it directly. **Do not shrink the pen further to widen this** — it was tried (opening the ground south of the pen down to the silo) and, even though it's fine for the player, it opens a pocket that NPC steering can wander into and get livelocked in (bounded by the pen/silo/barn, escape requires an >126° turn from the goal direction, which the side-committed steer() algorithm never attempts). The narrower fixed corridor plus the field-lane change already gives comfortable player access without that risk — confirmed via the long headless sim below.
- Homes: NPC `home: {door, interior}` + `routine` steps (leaveHome/goto/wait/goHome) in scene data. `startsHome` (explicit bool on the NPC) decides whether they spawn inside — falls back to "routine[0] is leaveHome" if omitted, so old data still works. NPCs that spawn out in the world (Tuckwell, Brenna) set `startsHome: false` and their own `x/y`. Leaving/entering = door SFX + 0.7s fade (FADE_S). Spacebar at door: locked toast if NPC away, dialog over interior background if home (world.interior swaps Layer 1). NPCs at home don't render, collide, or take dialog focus.
- SFX are one-shots via `audio.sfx(src)` (no-op in node); soundtrack unchanged (one looped track, crossfade). Player must only walk paths/grass/dirt: crop fields, hedges, trees, buildings, barrels, well, pen, silo are all rects in js/data/<scene>.js.
- D3 NPCs: Mirelle (home/leaveHome loop: barn → well → home), Tuckwell (Tuckwell's House, formerly labeled Hay Barn; tours all 4 crop fields then home), Brenna (Brenna's House, formerly labeled Tool Shed; pen → silo → home). All routine waypoints ride two shared clear corridors — the main path (y900-990 full width) and a couple of 50-75px north-south gaps between buildings (x400-450 by the well, x925-1000 by the barn lane) — never a straight line through a building.
- **Routine waypoint safety margin (important, learned the hard way):** every `goto`/door target needs ≥30px clearance from any obstacle edge, not just "technically not overlapping." COLLIDER is 36px (half=18), so a point only 18-20px clear is one stray avoidance deflection away from a multi-NPC livelock — two NPCs can wedge into a narrow gap and oscillate forever (each "moves" a little every tick, so the stuck-timer fallback never fires, and it never shows up in a short test). Keep shared-corridor waypoints near the center of the y900-990 band (~940) rather than hugging its edges. Validate new waypoints programmatically (check against `scene.obstacles` with the 36px collider) and stress-test with a long headless sim (thousands of simulated seconds, not just tens) before trusting a new route — the Tuckwell/Brenna livelock only appeared after ~400s of sim time.
- Collision test suites live in this workflow: probe walkable/blocked points with `world.blockersAt`, walk exits/lanes with simulated input, and run the 4 NPC steering scenarios (route-around, patrol, overlap-escape, wall-block) headless in node before every collision change. For multi-NPC routine changes, also run a long headless sim (`new World({getContext:()=>({})}, scene, {})`, drive `update()` in a loop for 1000s+ of sim time) checking for zero collision violations and no NPC stuck >3s outside an intended wait/fade/pause.
- Dialog animations: portrait slides in from the right + fades in via a CSS keyframe (`.portrait-enter` on `#dialog-portrait`, class removed + reflowed + re-added on every `openDialog` so it replays). NPC line types out character-by-character (`js/ui.js`, ~22ms/char); pressing Space/Enter while typing completes the line instantly instead of advancing, matching common RPG dialog UX.

## Status / roadmap

- ✅ D3 Farm: 4-layer scene, movement, collision (25px-grid traced), camera, walk animation, three NPCs with home routines (Mirelle, Tuckwell, Brenna — leave/return + door SFX + interior dialog), multi-NPC steering avoidance, placeholder dialog with portrait slide/fade + typewriter text, PDF-matched UI styling, HUD stubs, start screen (click/Enter/Space), theme + overworld soundtrack with crossfade.
- ⏳ Later: real dialog trees, battle system (kobolds, dagger), inventory/menu, interiors, other 15 scenes, Steam wrap.
- Player stats currently hardcoded in `js/main.js` (health 10/10, magic 5/10, gold 1,234 — matches mockups).
