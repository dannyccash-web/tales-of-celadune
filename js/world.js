// World: owns the current scene, player, NPCs, camera, collision, and canvas rendering.
// Layers 1 (scrolling background) and 2 (player/NPC icons) are drawn here.

import * as audio from './audio.js';

const VIEW_W = 1920;
const VIEW_H = 1080;
const PLAYER_SPEED = 130; // px/sec
const WALK_FLIP_INTERVAL = 0.25; // s — icon mirrors while walking to suggest steps
const COLLIDER = 36; // square collider centered on characters
const INTERACT_RANGE = 90;
// How close (px) the player/NPC must be to a home's door point to interact with
// it — and, now, the exact range at which that building's label appears, so the
// label shows iff the door is interactable (2026-07-19, Danny). Bumped 40 -> 50.
const DOOR_RANGE = 50;
const SHADOW_OFFSET = 3; // px, always to the bottom-right regardless of rotation
const SHADOW_ALPHA = 0.46; // multiply blend (see drawSprite) — bumped ~15% up from 0.4
const FADE_S = 0.7; // NPC door fade duration

function rectsOverlap(ax, ay, aw, ah, b) {
  return ax < b.x + b.w && ax + aw > b.x && ay < b.y + b.h && ay + ah > b.y;
}

export class World {
  constructor(canvas, scene, images) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    // Separate canvas ABOVE the vignette for world-space labels (building
    // names, NPC names) so the multiply vignette doesn't dim them. Falls back
    // to the main ctx if the labels canvas isn't present (e.g. headless).
    this.labelCtx = (typeof document !== 'undefined' && document.getElementById)
      ? (document.getElementById('labels')?.getContext('2d') || this.ctx)
      : this.ctx;
    this.scene = scene;
    this.images = images; // { [src]: HTMLImageElement }
    this.silhouettes = new Map(); // img -> black-silhouette canvas for shadows

    this.player = {
      x: scene.spawn.x,
      y: scene.spawn.y,
      rotation: Math.PI, // facing up (front of icon = bottom)
      moving: false,
      walkTimer: 0,
    };

    this.npcs = scene.npcs.map((n) => {
      // An NPC starts inside their home if explicitly flagged (`startsHome`) or,
      // for backward compatibility, if their routine's first step is 'leaveHome'.
      // NPCs that spawn out in the world (e.g. mid-field) set startsHome: false.
      const startsHome = n.startsHome ?? (!!n.home && n.routine?.[0]?.do === 'leaveHome');
      return {
        ...n,
        patrolIndex: 0,
        waitTimer: 0,
        stuckTimer: 0,
        avoidSign: 0,
        routineIndex: 0,
        timer: 0,
        pause: 0,
        moving: false,
        walkTimer: 0, // drives the same walk-flip mirroring the player uses
        fading: null, // 'in' | 'out'
        alpha: startsHome ? 0 : 1,
        atHome: startsHome,
        // Set once a hostile camp NPC is beaten in battle (2026-07-17). Lives
        // on the instance (the cached-per-session World), so a slain Bramblekin
        // stays gone when the player leaves and returns to D4. A defeated NPC
        // doesn't render, collide, aggro, or take interaction.
        defeated: false,
        ...(startsHome ? { x: n.home.door.x, y: n.home.door.y } : {}),
      };
    });

    // Invisible collectibles: no sprite, just a proximity label + one-time
    // reward. `collected` lives on the instance (not the scene data) so a
    // fresh World always starts with everything available.
    this.interactables = (scene.interactables || []).map((it) => ({ ...it, collected: false }));

    // Battle encounters (2026-07-08): a door position + an enemy id list.
    // `defeated` lives on the instance (not the scene data), same pattern as
    // `collected` above, and is only ever set by main.js once a fight is
    // actually won — see battleNearDoor().
    this.battles = (scene.battles || []).map((b) => ({ ...b, defeated: false }));

    // Fishing spots (2026-07-17) — specific points the player can fish from,
    // not every body of water. Each is { x, y }; the "Go Fishing" label, the
    // ripple animation, and the interaction all center on this point. The
    // player can fish while within FISH_SPOT_RANGE of it (see
    // fishingSpotNearby()). fishing = { x, y } while a cast is in progress
    // (main.js sets/clears it), drawn as ripples at that same spot.
    this.fishingSpots = (scene.fishingSpots || []).map((s) => ({ ...s }));
    this.fishing = null;

    this.cameraY = 0;
    this.interior = null; // interior image while a home dialog is open
    // Set when the player pushes on a scene exit (2026-07-10, replaces the
    // old edgeMessage placeholder): {edge, to, ...} — main.js consumes it
    // each frame and either switches scenes (if the target is built) or
    // shows the "not built yet" toast.
    this.pendingExit = null;

    // Bramblekin toll-camp (D4, reworked 2026-07-11). `camp.region` is a
    // rectangle the player can't cross while the toll's unpaid (`campSealed`,
    // set by main.js): can't ENTER until they've agreed to see the Chief
    // (`campEntered`), then can't LEAVE until they pay. Two stationary guards
    // stand at the region's gates. Hitting the sealed boundary sets
    // `pendingGate` (before entering — the "see the chief" confrontation) or
    // `pendingLeave` (after — the "you're not leaving" turn-back); main.js
    // consumes both, like pendingExit. `_campContact` de-bounces them so they
    // fire once per approach, not every frame the player pushes the line.
    this.camp = scene.camp || null;
    this.campSealed = false;
    this.campEntered = false;
    // Set by main.js once the player draws steel on any camp member (2026-07-17):
    // every Bramblekin then attacks on sight — walking within CAMP_AGGRO_RANGE
    // of an alive one fires `pendingAggro` (a battle with just that one).
    this.campHostile = false;
    this.pendingGate = null;
    this.pendingLeave = null;
    this.pendingAggro = null;
    this._campContact = false;
    // Per-gate armed flag for the proximity confrontation (re-arms once the
    // player leaves the gate's radius) — the guards physically block the
    // opening, so the "see the chief" dialog is triggered by getting NEAR a
    // gate, not by reaching the membrane line behind the guard.
    this.gateArmed = {};

    // Hidden proximity ambushes (D4 Rootweavers): auto-start a battle when the
    // player comes within range. Per-instance `triggered`/`defeated` like
    // `battles`, so a fresh World resets them; `triggered` re-arms with
    // hysteresis after the player leaves (so a fled ambush isn't instant-loop).
    this.ambushes = (scene.ambushes || []).map((a) => ({ ...a, triggered: false, defeated: false }));
    this.pendingAmbush = null;

    // Animation clock for code-drawn effects (currently campfire smoke).
    this.time = 0;
    // Smoke sources from scene data ({x, y} in world coords), each expanded
    // with tunable defaults. Rendered as rising particle plumes in drawSmoke().
    this.smokes = (scene.smoke || []).map((s) => ({
      x: s.x,
      y: s.y,
      count: s.count ?? 16,     // particles per plume
      rise: s.rise ?? 165,      // how high (px) a particle travels over its life
      drift: s.drift ?? 30,     // sideways sway amplitude (px)
      baseR: s.baseR ?? 11,     // starting particle radius
      growR: s.growR ?? 32,     // extra radius gained over its life
      speed: s.speed ?? 0.16,   // life-cycles per second (lower = slower)
      maxAlpha: s.alpha ?? 0.26,
      seed: s.seed ?? 0,
    }));
  }

  // Nearest interactable within range (defaults to the same radius as NPC
  // interaction), or null. Collected ones are skipped UNLESS they carry an
  // `emptyMessage` (2026-07-10, e.g. the silo) — those stay interactive so
  // main.js can respond with the empty line instead of silence.
  nearestInteractableInRange() {
    let best = null;
    let bestDist = Infinity;
    for (const it of this.interactables) {
      if (it.collected && !it.emptyMessage) continue;
      const range = it.range ?? INTERACT_RANGE;
      const d = Math.hypot(it.x - this.player.x, it.y - this.player.y);
      if (d < range && d < bestDist) { best = it; bestDist = d; }
    }
    return best;
  }

  nearestNpcInRange() {
    let best = null;
    let bestDist = INTERACT_RANGE;
    for (const npc of this.npcs) {
      if (npc.atHome || npc.defeated) continue;
      const d = Math.hypot(npc.x - this.player.x, npc.y - this.player.y);
      if (d < bestDist) { best = npc; bestDist = d; }
    }
    return best;
  }

  // NPC whose home the player is standing near (for spacebar interaction:
  // enter/talk if they're home, "door is locked" if they're out).
  //
  // A doorway is a single POINT (2026-07-19, Danny — same idea as a fishing
  // spot): each `home.door` sits on the building's path-facing wall, roughly
  // centered, and the player (or an NPC) must be within DOOR_RANGE (40px) of it
  // to interact. Nearest-wins across all homes, since D2's buildings are packed
  // tightly enough that a couple of door radii can overlap. (The old, larger
  // `home.zone` whole-footprint anchor is gone — doorways are precise now.)
  homeNpcNearDoor() {
    let best = null;
    let bestDist = DOOR_RANGE;
    for (const npc of this.npcs) {
      if (!npc.home || npc.defeated) continue;
      const d = Math.hypot(npc.home.door.x - this.player.x, npc.home.door.y - this.player.y);
      if (d < bestDist) { best = npc; bestDist = d; }
    }
    return best;
  }

  // Same shape as homeNpcNearDoor() but for battle encounters (e.g. the
  // kobolds in the Old Barn) — skips ones already marked defeated so a
  // cleared encounter doesn't immediately re-trigger. Nearest-wins for the
  // same reason as homeNpcNearDoor() above.
  battleNearDoor() {
    let best = null;
    let bestDist = INTERACT_RANGE;
    for (const b of this.battles) {
      if (b.defeated) continue;
      const d = Math.hypot(b.door.x - this.player.x, b.door.y - this.player.y);
      if (d < bestDist) { best = b; bestDist = d; }
    }
    return best;
  }

  // The nearest fishing spot the player is close enough to fish from (within
  // FISH_SPOT_RANGE), or null. The returned spot's { x, y } is where the label
  // shows, where ripples animate, and where the line is cast.
  fishingSpotNearby() {
    const FISH_SPOT_RANGE = 180;
    let best = null, bestDist = FISH_SPOT_RANGE;
    for (const s of this.fishingSpots) {
      const d = Math.hypot(s.x - this.player.x, s.y - this.player.y);
      if (d < bestDist) { best = s; bestDist = d; }
    }
    return best;
  }

  // Everything blocking a body at (x, y). `self` is excluded; player and all
  // NPCs block each other. Each blocker is returned with its center point.
  blockersAt(x, y, self) {
    const half = COLLIDER / 2;
    const cx = x - half;
    const cy = y - half;
    const out = [];
    const isPlayer = self === this.player;
    for (const ob of this.scene.obstacles) {
      // npcOnly rects are invisible-to-the-player steering guards: they keep
      // autonomous NPCs out of a pocket without blocking the player, who
      // moves deliberately and isn't at risk of getting stuck there.
      if (ob.npcOnly && isPlayer) continue;
      if (rectsOverlap(cx, cy, COLLIDER, COLLIDER, ob)) {
        out.push({ id: ob, cx: ob.x + ob.w / 2, cy: ob.y + ob.h / 2 });
      }
    }
    for (const b of [this.player, ...this.npcs]) {
      if (b === self || b.atHome || b.defeated) continue;
      if (rectsOverlap(cx, cy, COLLIDER, COLLIDER,
        { x: b.x - half, y: b.y - half, w: COLLIDER, h: COLLIDER })) {
        out.push({ id: b, cx: b.x, cy: b.y });
      }
    }
    return out;
  }

  // A move is legal if it hits nothing — or, when a body is already wedged into
  // something (overlap can happen at spawn or in edge cases), if every remaining
  // blocker was already blocking and the move increases distance from it.
  // Prevents mutual deadlocks: overlapping bodies can always back apart.
  canMove(body, nx, ny) {
    const next = this.blockersAt(nx, ny, body);
    if (next.length === 0) return true;
    const cur = this.blockersAt(body.x, body.y, body);
    return next.every((n) => {
      const was = cur.find((c) => c.id === n.id);
      if (!was) return false;
      const dNow = Math.hypot(body.x - n.cx, body.y - n.cy);
      const dNext = Math.hypot(nx - n.cx, ny - n.cy);
      return dNext > dNow;
    });
  }

  update(dt, input, uiLocked) {
    this.time += dt; // advances even while UI-locked so effects keep drifting
    this.pendingExit = null;
    this.pendingGate = null;
    this.pendingLeave = null;
    this.pendingAmbush = null;
    this.pendingAggro = null;
    const p = this.player;
    const preX = p.x, preY = p.y; // pre-move position for the camp membrane clamp
    let dx = 0, dy = 0;

    if (!uiLocked) {
      if (input.left) dx -= 1;
      if (input.right) dx += 1;
      if (input.up) dy -= 1;
      if (input.down) dy += 1;
    }

    p.moving = dx !== 0 || dy !== 0;
    p.walkTimer = p.moving ? p.walkTimer + dt : 0;
    if (p.moving) {
      const len = Math.hypot(dx, dy);
      const step = PLAYER_SPEED * dt;
      const nx = p.x + (dx / len) * step;
      const ny = p.y + (dy / len) * step;

      // Front of the icon (its bottom) faces the direction of travel
      p.rotation = Math.atan2(dy, dx) - Math.PI / 2;

      // Axis-separated movement so the player slides along walls
      if (this.canMove(p, nx, p.y)) p.x = nx;
      if (this.canMove(p, p.x, ny)) p.y = ny;

      // Scene edges: exits lead to adjacent scenes (not built yet); otherwise clamp
      const half = COLLIDER / 2;
      if (p.x < half) { p.x = half; this.checkExit('left'); }
      if (p.x > this.scene.width - half) { p.x = this.scene.width - half; this.checkExit('right'); }
      if (p.y < half) { p.y = half; this.checkExit('top'); }
      if (p.y > this.scene.height - half) { p.y = this.scene.height - half; this.checkExit('bottom'); }
    }

    this.updateNpcs(dt, uiLocked);

    // Camp membrane (can't enter/leave while sealed) + hidden ambush triggers —
    // only while the world is live (a rejected move reverts to the pre-move pos).
    if (!uiLocked) {
      this.checkCampGates();
      this.checkCampMembrane(preX, preY);
      this.checkCampAggro();
      this.checkAmbushes();
    }

    // Camera: horizontal fixed (world width == viewport width); vertical follows
    // player, clamped so Layer 1 never scrolls past its edges.
    this.cameraY = Math.min(Math.max(p.y - VIEW_H / 2, 0), this.scene.height - VIEW_H);
  }

  // Left/right exits match on a y band (yMin/yMax); top/bottom exits on an
  // x band (xMin/xMax). A match sets pendingExit for main.js to act on.
  checkExit(edge) {
    const p = this.player;
    const exit = this.scene.exits.find((e) => {
      if (e.edge !== edge) return false;
      if (edge === 'left' || edge === 'right') {
        return p.y >= (e.yMin ?? 0) && p.y <= (e.yMax ?? this.scene.height);
      }
      return p.x >= (e.xMin ?? 0) && p.x <= (e.xMax ?? this.scene.width);
    });
    if (exit) this.pendingExit = { ...exit };
  }

  // ---- Bramblekin toll-camp membrane (reworked 2026-07-11) ----
  // While the camp is sealed (toll unpaid), the player can't cross the region
  // boundary: they can't ENTER until they've agreed to see the Chief
  // (campEntered), then can't LEAVE until they pay. Called from update() with
  // the pre-move position, so a rejected move just leaves the player where
  // they were (stopped at the line). Fires pendingGate (entry confrontation)
  // or pendingLeave (turn-back) once per contact — `_campContact` de-bounces
  // it so it doesn't re-fire every frame the player holds into the boundary.
  inCampRegion(x, y) {
    const r = this.camp && this.camp.region;
    return !!r && x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
  }

  nearestGateId() {
    const p = this.player;
    let best = null, bd = Infinity;
    for (const g of this.camp.gates) {
      const d = Math.hypot(g.x - p.x, g.y - p.y);
      if (d < bd) { bd = d; best = g.id; }
    }
    return best;
  }

  checkCampMembrane(preX, preY) {
    if (!this.camp || !this.camp.region || !this.campSealed) { this._campContact = false; return; }
    const p = this.player;
    const inR = this.inCampRegion(p.x, p.y);
    const violated = this.campEntered ? !inR : inR; // entered→can't leave; else→can't enter
    if (violated) {
      p.x = preX; p.y = preY; // stopped at the boundary
      if (!this._campContact) {
        if (this.campEntered) this.pendingLeave = this.nearestGateId();
        else this.pendingGate = this.nearestGateId();
      }
      this._campContact = true;
    } else {
      this._campContact = false;
    }
  }

  // Gate proximity confrontation (entry). The guards physically block the
  // openings, so the "see the chief" dialog is triggered by getting NEAR a
  // gate — not by reaching the membrane line behind the guard (which the
  // player's collider can't get to). De-bounced per gate via gateArmed.
  checkCampGates() {
    if (!this.camp || !this.campSealed || this.campEntered) return;
    const p = this.player;
    for (const g of this.camp.gates) {
      const gr = g.r ?? 100;
      const d = Math.hypot(g.x - p.x, g.y - p.y);
      if (d < gr) {
        if (this.gateArmed[g.id] !== false && !this.pendingGate) {
          this.pendingGate = g.id;
          this.gateArmed[g.id] = false;
        }
      } else if (d > gr * 1.6) {
        this.gateArmed[g.id] = true;
      }
    }
  }

  // Hostile-camp aggro (2026-07-17): once the player has drawn steel on any
  // Bramblekin, every remaining one attacks on sight — coming within
  // CAMP_AGGRO_RANGE of an alive, undefeated camp member (guard or Chief) fires
  // pendingAggro (main.js starts a one-on-one fight with it). De-bounced per
  // NPC via `_aggroArmed`, re-arming once the player backs off past 1.4×range,
  // so fleeing one fight doesn't instantly restart it while you're still next
  // to the body.
  isCampMember(npc) {
    return npc.bramblekin || npc.id === 'bramblekin_chief';
  }
  checkCampAggro() {
    if (!this.campHostile || this.pendingAggro) return;
    const p = this.player;
    const RANGE = 200;
    for (const npc of this.npcs) {
      if (npc.defeated || npc.atHome || !this.isCampMember(npc)) continue;
      const d = Math.hypot(npc.x - p.x, npc.y - p.y);
      if (d < RANGE) {
        if (npc._aggroArmed !== false) { this.pendingAggro = npc; npc._aggroArmed = false; }
      } else if (d > RANGE * 1.4) {
        npc._aggroArmed = true;
      }
    }
  }

  // Hidden proximity ambushes (Rootweavers): fire pendingAmbush once when the
  // player enters range, re-arming only after they leave (hysteresis), and
  // skipping ones already defeated.
  checkAmbushes() {
    const p = this.player;
    for (const a of this.ambushes) {
      if (a.defeated) continue;
      const range = a.range ?? 70;
      const d = Math.hypot(a.x - p.x, a.y - p.y);
      if (d < range) {
        if (!a.triggered && !this.pendingAmbush) { this.pendingAmbush = a; a.triggered = true; }
      } else if (d > range * 1.6) {
        a.triggered = false;
      }
    }
  }

  updateNpcs(dt, uiLocked) {
    if (uiLocked) return; // world pauses during dialog
    // Recorded before any movement so we can tell, after the fact, which NPCs
    // actually translated this tick (vs. waiting/fading/paused) — that drives
    // the same walk-flip mirroring the player uses, without threading extra
    // state through every branch below.
    const before = this.npcs.map((n) => ({ x: n.x, y: n.y }));

    for (const npc of this.npcs) {
      if (npc.defeated) continue; // slain — no movement, no routine
      // Door fades run to completion before anything else
      if (npc.fading) {
        const dir = npc.fading === 'in' ? 1 : -1;
        npc.alpha = Math.min(1, Math.max(0, npc.alpha + (dir * dt) / FADE_S));
        if (npc.alpha === (dir === 1 ? 1 : 0)) {
          if (dir === -1) npc.atHome = true;
          npc.fading = null;
          this.advanceRoutine(npc);
        }
        continue;
      }

      if (npc.pause > 0) { npc.pause -= dt; continue; }

      if (npc.routine) { this.updateRoutine(npc, dt); continue; }

      // Simple back-and-forth patrol (NPCs without a routine)
      if (!npc.patrol || npc.patrol.length < 2) continue;
      if (npc.waitTimer > 0) { npc.waitTimer -= dt; continue; }
      const target = npc.patrol[npc.patrolIndex];
      const arrived = this.walkToward(npc, target, dt);
      if (arrived) {
        npc.patrolIndex = (npc.patrolIndex + 1) % npc.patrol.length;
        npc.waitTimer = 2 + Math.random() * 3;
      }
    }

    this.npcs.forEach((npc, i) => {
      const moved = Math.hypot(npc.x - before[i].x, npc.y - before[i].y) > 0.01;
      npc.moving = moved;
      npc.walkTimer = moved ? npc.walkTimer + dt : 0;
    });
  }

  // Steer one tick toward a target; returns true when the NPC has arrived.
  // `arriveDist` is how close counts as "arrived" (default 4px). goHome passes
  // a larger tolerance (2026-07-19): a walkout beside an on-wall door can sit
  // right against the building edge, where the 36px body can't inch to within
  // 4px and instead jitters in place forever — a bigger threshold lets the NPC
  // settle at the doorstep and fade inside.
  walkToward(npc, target, dt, arriveDist = 4) {
    const dx = target.x - npc.x;
    const dy = target.y - npc.y;
    const dist = Math.hypot(dx, dy);
    if (dist < arriveDist) return true;

    const moved = this.steer(npc, Math.atan2(dy, dx), Math.min(npc.speed * dt, dist));
    if (moved) {
      npc.stuckTimer = 0;
    } else {
      // Fully boxed in (e.g. the player is standing in the way):
      // wait politely, then try again.
      npc.stuckTimer += dt;
      if (npc.stuckTimer > 1.5) {
        npc.stuckTimer = 0;
        npc.pause = 1 + Math.random();
      }
    }
    return false;
  }

  advanceRoutine(npc) {
    if (!npc.routine) return;
    npc.timer = 0;
    npc.routineIndex = (npc.routineIndex + 1) % npc.routine.length;
  }

  // Volume weight (0-0.9) for a door SFX based on how close the player is to
  // that door (2026-07-19, Danny) — with the town staggered, doors open/close
  // constantly, so a distant one should be faint and only a nearby one loud.
  // Full within ~110px, fading to silent past ~620px.
  doorVolume(door) {
    const d = Math.hypot(door.x - this.player.x, door.y - this.player.y);
    const NEAR = 110, FAR = 620;
    return Math.max(0, Math.min(0.9, 0.9 * (FAR - d) / (FAR - NEAR)));
  }

  updateRoutine(npc, dt) {
    const step = npc.routine[npc.routineIndex];
    switch (step.do) {
      case 'leaveHome': {
        audio.sfx(audio.SFX.door, this.doorVolume(npc.home.door));
        // Step OUT to the walkout spot (a walkable cell beside the door), not
        // onto the door point itself — the door sits on the building wall
        // (2026-07-19, matched to Danny's red-dot marks), where the 36px body
        // can't stand. `home.approach` is that reachable step-out; interaction
        // still keys off `home.door` (see homeNpcNearDoor). Falls back to the
        // door for any home without an approach (e.g. D3's path-side doors).
        const out = npc.home.approach || npc.home.door;
        npc.x = out.x;
        npc.y = out.y;
        npc.atHome = false;
        npc.alpha = 0;
        npc.fading = 'in'; // advanceRoutine fires when the fade completes
        break;
      }
      case 'wait': {
        npc.timer += dt;
        // Cap how long an NPC stands still *in the open* at 5s (2026-07-17,
        // Danny) — a frozen figure out in the world reads as dead. Waits taken
        // while home (invisible, indoors) keep their full duration so the
        // town's staggered come-and-go rhythm is preserved.
        const limit = npc.atHome ? step.s : Math.min(step.s, 5);
        if (npc.timer >= limit) this.advanceRoutine(npc);
        break;
      }
      case 'goto':
        if (this.walkToward(npc, step, dt)) this.advanceRoutine(npc);
        break;
      case 'goHome': {
        // Walk to the walkout spot beside the door, then fade in. Arrival is
        // either within 20px, or a PROGRESS watchdog (2026-07-19): track the
        // closest we've come this trip, and if we stop getting nearer for 3.5s
        // we're oscillating against a wall/pinch — give up and go inside. The
        // local steering can occasionally fail to close the last stretch into a
        // tight walkout and would otherwise circle forever; this caps any
        // near-home spin at ~3.5s no matter the distance, so an NPC always ends
        // up home instead of pinwheeling on the doorstep.
        const target = npc.home.approach || npc.home.door;
        const arrived = this.walkToward(npc, target, dt, 20);
        const d = Math.hypot(target.x - npc.x, target.y - npc.y);
        if (npc._homeBest === undefined || d < npc._homeBest - 2) { npc._homeBest = d; npc._homeNoProg = 0; }
        else { npc._homeNoProg = (npc._homeNoProg || 0) + dt; }
        if (arrived || npc._homeNoProg > 3.5) {
          audio.sfx(audio.SFX.door, this.doorVolume(npc.home.door));
          npc.fading = 'out'; // atHome + advance when the fade completes
          npc._homeBest = undefined; npc._homeNoProg = 0;
        }
        break;
      }
      default:
        this.advanceRoutine(npc);
    }
  }

  // Local steering with side commitment: try the desired heading first; when
  // blocked, detour at progressively wider angles — but keep favoring the same
  // side (body.avoidSign) until the straight path clears. The lookahead probe
  // is longer than one tick's step so tiny steps can't jitter at corners.
  steer(body, desired, step) {
    // A direction is usable only if both the immediate step and a longer
    // lookahead are free: the step check keeps moves legal, the lookahead
    // stops tiny steps from jittering into corners.
    const look = Math.max(step, 14);
    const clear = (a) => {
      const cos = Math.cos(a);
      const sin = Math.sin(a);
      return this.canMove(body, body.x + cos * step, body.y + sin * step)
        && this.canMove(body, body.x + cos * look, body.y + sin * look);
    };

    let choice = null;
    if (clear(desired)) {
      choice = desired;
      body.avoidSign = 0;
    } else {
      const firstSide = body.avoidSign || 1;
      outer:
      for (const side of [firstSide, -firstSide]) {
        for (const off of [0.5, 1.0, 1.6, 2.2]) {
          if (clear(desired + off * side)) {
            choice = desired + off * side;
            body.avoidSign = side;
            break outer;
          }
        }
      }
    }

    if (choice === null) return false;
    body.x += Math.cos(choice) * step;
    body.y += Math.sin(choice) * step;
    body.rotation = choice - Math.PI / 2; // icon bottom faces travel direction
    return true;
  }

  // Black-silhouette copy of a sprite, cached, used for multiply drop shadows.
  silhouetteOf(img) {
    let sil = this.silhouettes.get(img);
    if (!sil) {
      sil = document.createElement('canvas');
      sil.width = img.width;
      sil.height = img.height;
      const c = sil.getContext('2d');
      c.drawImage(img, 0, 0);
      c.globalCompositeOperation = 'source-in';
      c.fillStyle = '#000';
      c.fillRect(0, 0, sil.width, sil.height);
      this.silhouettes.set(img, sil);
    }
    return sil;
  }

  drawSprite(img, x, y, rotation, flip = false, alpha = 1) {
    if (alpha <= 0) return;
    const ctx = this.ctx;
    const screenY = y - this.cameraY;
    const fx = flip ? -1 : 1;

    // Drop shadow: offset applied in screen space (before rotating), so it always
    // falls to the bottom-right no matter which way the icon faces.
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = SHADOW_ALPHA * alpha;
    ctx.translate(x + SHADOW_OFFSET, screenY + SHADOW_OFFSET);
    ctx.rotate(rotation || 0);
    ctx.scale(fx, 1);
    ctx.drawImage(this.silhouetteOf(img), -img.width / 2, -img.height / 2);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, screenY);
    ctx.rotate(rotation || 0);
    ctx.scale(fx, 1);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  }

  drawLabel(text, x, y) {
    const ctx = this.labelCtx;
    ctx.save();
    ctx.font = '22px MedievalSharp, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = '#fff';
    ctx.fillText(text, x, y - this.cameraY);
    ctx.restore();
  }

  drawNameLabel(npc) {
    const img = this.images[npc.sprite];
    this.drawLabel(npc.name, npc.x, npc.y - img.height / 2 - 14);
  }

  // Soft rising campfire smoke: each particle loops through a birth→rise→fade
  // life cycle, offset in phase so the plume looks continuous. Drawn as
  // radial-gradient puffs in world space (scrolls with the camera).
  // Concentric ripple rings expanding from the cast point on the water
  // surface, plus a little bobber dot, while a cast is in progress. Flattened
  // vertically for the top-down water perspective.
  drawRipples() {
    const ctx = this.ctx;
    const sx = this.fishing.x;
    const sy = this.fishing.y - this.cameraY;
    if (sy < -60 || sy > VIEW_H + 60) return;
    ctx.save();
    const RINGS = 3, PERIOD = 1.7, MAXR = 52;
    for (let i = 0; i < RINGS; i++) {
      let f = ((this.time / PERIOD) + i / RINGS) % 1;
      if (f < 0) f += 1;
      const r = 5 + f * MAXR;
      const a = (1 - f) * 0.55;
      ctx.strokeStyle = `rgba(214,234,242,${a})`;
      ctx.lineWidth = 2.5 * (1 - f * 0.5);
      ctx.beginPath();
      ctx.ellipse(sx, sy, r, r * 0.52, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    // bobber / bait splash at the centre
    const bob = Math.sin(this.time * 3) * 1.5;
    ctx.fillStyle = 'rgba(236,244,248,0.8)';
    ctx.beginPath();
    ctx.ellipse(sx, sy + bob, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawSmoke(s) {
    const ctx = this.ctx;
    const baseScreenY = s.y - this.cameraY;
    // Cull if the whole plume (source + full rise) is off-screen.
    if (baseScreenY < -60 || baseScreenY - s.rise > VIEW_H + 60) return;

    ctx.save();
    for (let i = 0; i < s.count; i++) {
      const phase = i / s.count + s.seed;
      let f = (this.time * s.speed + phase) % 1; // life fraction [0,1)
      if (f < 0) f += 1;

      const a = Math.sin(f * Math.PI) * s.maxAlpha; // fade in, then out
      if (a <= 0.01) continue;

      const px = s.x
        + Math.sin(f * 3.1 + i * 1.7) * s.drift * f // widening sway
        + f * s.drift * 0.5;                        // gentle lean as it rises
      const gy = (s.y - f * s.rise) - this.cameraY;
      const r = s.baseR + f * s.growR;

      const grad = ctx.createRadialGradient(px, gy, 0, px, gy, r);
      grad.addColorStop(0, `rgba(202,202,194,${a})`);
      grad.addColorStop(0.6, `rgba(182,182,174,${a * 0.5})`);
      grad.addColorStop(1, 'rgba(172,172,164,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, gy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  render() {
    const ctx = this.ctx;

    // Clear the (above-vignette) label canvas every frame so labels don't
    // smear; drawLabel() repaints whatever's currently in range.
    if (this.labelCtx && this.labelCtx !== ctx) this.labelCtx.clearRect(0, 0, VIEW_W, VIEW_H);

    // Inside a home: the interior replaces the whole world view (UI stays)
    if (this.interior) {
      ctx.drawImage(this.interior, 0, 0, VIEW_W, VIEW_H);
      return;
    }

    const bg = this.images[this.scene.background];

    // Layer 1: background slice for current camera position
    ctx.drawImage(bg, 0, this.cameraY, VIEW_W, VIEW_H, 0, 0, VIEW_W, VIEW_H);

    // Layer 2: NPCs, then player on top
    for (const npc of this.npcs) {
      if (npc.atHome || npc.defeated) continue;
      const npcFlip = npc.moving
        && Math.floor(npc.walkTimer / WALK_FLIP_INTERVAL) % 2 === 1;
      this.drawSprite(this.images[npc.sprite], npc.x, npc.y, npc.rotation, npcFlip, npc.alpha);
    }
    const p = this.player;
    const stepFlip = p.moving
      && Math.floor(p.walkTimer / WALK_FLIP_INTERVAL) % 2 === 1;
    this.drawSprite(
      this.images['assets/images/Player_Overhead_1.png'],
      p.x, p.y, p.rotation, stepFlip,
    );

    // Campfire smoke and other code-drawn effects, above the world/characters
    for (const s of this.smokes) this.drawSmoke(s);

    // Fishing ripples where the bait was cast
    if (this.fishing) this.drawRipples();

    // Name label above the NPC the player could interact with
    const near = this.nearestNpcInRange();
    if (near) this.drawNameLabel(near);

    // Building labels: a door-linked building (b.door set) shows its label ONLY
    // while its door is interactable — same DOOR_RANGE the player needs to press
    // space (2026-07-19, Danny: label visible iff you can interact with it). The
    // label is drawn at b.x,b.y (centered just above the door). Labels without a
    // door (e.g. D4's cave/camp) fall back to their own proximity radius b.r.
    for (const b of this.scene.buildings || []) {
      const anchor = b.door || b;
      const range = b.door ? DOOR_RANGE : b.r;
      if (Math.hypot(anchor.x - p.x, anchor.y - p.y) < range) this.drawLabel(b.label, b.x, b.y);
    }

    // Hidden-collectible labels: same proximity-reveal pattern, no sprite.
    // Label-less interactables (e.g. the silo, 2026-07-10 — the structure
    // itself is the visible thing) draw nothing.
    for (const it of this.interactables) {
      if (it.collected || !it.label) continue;
      const range = it.range ?? INTERACT_RANGE;
      if (Math.hypot(it.x - p.x, it.y - p.y) < range) this.drawLabel(it.label, it.x, it.y);
    }

    // "Go Fishing" prompt above a fishing spot when the player's close enough
    // (not while a cast is already in progress).
    if (!this.fishing) {
      const spot = this.fishingSpotNearby();
      if (spot) this.drawLabel('Go Fishing', spot.x, spot.y);
    }
  }
}
