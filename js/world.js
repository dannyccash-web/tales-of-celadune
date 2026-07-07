// World: owns the current scene, player, NPCs, camera, collision, and canvas rendering.
// Layers 1 (scrolling background) and 2 (player/NPC icons) are drawn here.

import * as audio from './audio.js';

const VIEW_W = 1920;
const VIEW_H = 1080;
const PLAYER_SPEED = 130; // px/sec
const WALK_FLIP_INTERVAL = 0.25; // s — icon mirrors while walking to suggest steps
const COLLIDER = 36; // square collider centered on characters
const INTERACT_RANGE = 90;
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
        ...(startsHome ? { x: n.home.door.x, y: n.home.door.y } : {}),
      };
    });

    // Invisible collectibles: no sprite, just a proximity label + one-time
    // reward. `collected` lives on the instance (not the scene data) so a
    // fresh World always starts with everything available.
    this.interactables = (scene.interactables || []).map((it) => ({ ...it, collected: false }));

    this.cameraY = 0;
    this.interior = null; // interior image while a home dialog is open
    this.edgeMessage = null; // set when player pushes on a scene exit
  }

  // Nearest not-yet-collected interactable within range (defaults to the
  // same radius as NPC interaction), or null.
  nearestInteractableInRange() {
    let best = null;
    let bestDist = Infinity;
    for (const it of this.interactables) {
      if (it.collected) continue;
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
      if (npc.atHome) continue;
      const d = Math.hypot(npc.x - this.player.x, npc.y - this.player.y);
      if (d < bestDist) { best = npc; bestDist = d; }
    }
    return best;
  }

  // NPC whose home door the player is standing near (for spacebar interaction)
  homeNpcNearDoor() {
    for (const npc of this.npcs) {
      if (!npc.home) continue;
      const d = Math.hypot(npc.home.door.x - this.player.x, npc.home.door.y - this.player.y);
      if (d < INTERACT_RANGE) return npc;
    }
    return null;
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
      if (b === self || b.atHome) continue;
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
    this.edgeMessage = null;
    const p = this.player;
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

    // Camera: horizontal fixed (world width == viewport width); vertical follows
    // player, clamped so Layer 1 never scrolls past its edges.
    this.cameraY = Math.min(Math.max(p.y - VIEW_H / 2, 0), this.scene.height - VIEW_H);
  }

  checkExit(edge) {
    const p = this.player;
    const exit = this.scene.exits.find((e) =>
      e.edge === edge && p.y >= (e.yMin ?? 0) && p.y <= (e.yMax ?? this.scene.height));
    if (exit) {
      this.edgeMessage = `The path continues to ${exit.to} — that scene isn’t built yet.`;
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
  walkToward(npc, target, dt) {
    const dx = target.x - npc.x;
    const dy = target.y - npc.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 4) return true;

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

  updateRoutine(npc, dt) {
    const step = npc.routine[npc.routineIndex];
    switch (step.do) {
      case 'leaveHome':
        audio.sfx(audio.SFX.door);
        npc.x = npc.home.door.x;
        npc.y = npc.home.door.y;
        npc.atHome = false;
        npc.alpha = 0;
        npc.fading = 'in'; // advanceRoutine fires when the fade completes
        break;
      case 'wait':
        npc.timer += dt;
        if (npc.timer >= step.s) this.advanceRoutine(npc);
        break;
      case 'goto':
        if (this.walkToward(npc, step, dt)) this.advanceRoutine(npc);
        break;
      case 'goHome':
        if (this.walkToward(npc, npc.home.door, dt)) {
          audio.sfx(audio.SFX.door);
          npc.fading = 'out'; // atHome + advance when the fade completes
        }
        break;
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
    const ctx = this.ctx;
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

  render() {
    const ctx = this.ctx;

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
      if (npc.atHome) continue;
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

    // Name label above the NPC the player could interact with
    const near = this.nearestNpcInRange();
    if (near) this.drawNameLabel(near);

    // Building labels when the player is close by
    for (const b of this.scene.buildings || []) {
      if (Math.hypot(b.x - p.x, b.y - p.y) < b.r) this.drawLabel(b.label, b.x, b.y);
    }

    // Hidden-collectible labels: same proximity-reveal pattern, no sprite
    for (const it of this.interactables) {
      if (it.collected) continue;
      const range = it.range ?? INTERACT_RANGE;
      if (Math.hypot(it.x - p.x, it.y - p.y) < range) this.drawLabel(it.label, it.x, it.y);
    }
  }
}
