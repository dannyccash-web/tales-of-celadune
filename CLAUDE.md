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
- Icons: 3px multiply drop shadow to bottom-right, fixed angle regardless of rotation (canvas silhouette cache in world.js).
- NPCs steer around player/obstacles (side-committed steering, step+lookahead). Test logic headless in node: `new World({getContext:()=>({})}, scene, {})`, then `update()` in a loop. `window.world` is a live debug handle.
- Testing live: Pages caches JS for 10 min — `fetch(f, {cache:'reload'})` each module, then reload. rAF freezes when the browser window is hidden (drive `world.update` manually under automation).

## Status / roadmap

- ✅ D3 Farm: 4-layer scene, movement, collision, camera, Mirelle NPC patrol + avoidance, placeholder dialog, PDF-matched UI styling, HUD stubs.
- ⏳ Later: real dialog trees, battle system (kobolds, dagger), inventory/menu, interiors, other 15 scenes, Steam wrap.
- Player stats currently hardcoded in `js/main.js` (health 10/10, magic 5/10, gold 1,234 — matches mockups).
