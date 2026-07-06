# Tales of Celadune

A turn-based fantasy RPG. Navigate an overworld, meet NPCs, take quests, fight with stats and die rolls — no physics, all story.

**Play:** https://dannyccash-web.github.io/tales-of-celadune/

## Tech

Plain HTML/CSS/JavaScript (ES modules) + a single canvas. No frameworks, no build step — open `index.html` from any static server and it runs. This keeps development streamlined and keeps every platform open:

- **Browser (now):** hosted on GitHub Pages straight from the `main` branch.
- **Steam (later):** wrap the same files in Electron or Tauri and add Steamworks integration (e.g. `steamworks.js`). No refactor needed — this is the proven path used by shipped web-tech Steam games.

## Architecture

The screen is a fixed 1920×1080 design canvas, scaled to fit the window. Four layers, per the design doc:

1. **Layer 1** — 1920×1920 scene background, scrolls vertically with the player, never past its edges.
2. **Layer 2** — player + NPC overhead icons (40px). Arrow keys move; icon bottom faces travel direction; spacebar interacts. Buildings/trees/fences/NPCs are collision obstacles.
3. **Layer 3** — `Vignette.jpg`, multiply blend, fixed to viewport.
4. **Layer 4** — HTML UI (HUD bars, gold, Inventory/Menu, dialogs), fixed to viewport, 50px insets.

The overworld is a 4×4 grid of scenes (A1–D4). Each scene is a data file in `js/data/` (background, obstacles, NPCs, exits, entrances). **Built so far: D3 (Farm).**

## Files

```
index.html          page + layer structure
css/style.css       UI styling (HUD, dialog, toasts)
js/main.js          boot, input, game loop
js/world.js         camera, collision, NPC patrol, canvas rendering
js/ui.js            HUD, placeholder dialog, stage scaling
js/data/d3.js       Scene D3 data (obstacles, NPCs, exits)
assets/images/      art assets
```

## Local dev

Any static server works, e.g. `python3 -m http.server` in the repo root, then open http://localhost:8000.

## Roadmap

- Dialog system (mockup pages 1, 3), battle system (page 2), inventory/menu
- Building interiors (`home_interior.jpg`), item pickups (dagger), kobold encounters
- Remaining 15 scenes
- Steam packaging (Electron/Tauri + Steamworks)
