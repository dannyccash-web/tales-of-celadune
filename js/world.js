// World: owns the current scene, player, NPCs, camera, collision, and canvas rendering.
// Layers 1 (scrolling background) and 2 (player/NPC icons) are drawn here.

const VIEW_W = 1920;
const VIEW_H = 1080;
const PLAYER_SPEED = 260; // px/sec
const PLAYER_COLLIDER = 36; // square collider centered on the player
const INTERACT_RANGE = 90;

function rectsOverlap(ax, ay, aw, ah, b) {
  return ax < b.x + b.w && ax + aw > b.x && ay < b.y + b.h && ay + ah > b.y;
}

export class World {
  constructor(canvas, scene, images) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.scene = scene;
    this.images = images; // { [src]: HTMLImageElement }

    this.player = {
      x: scene.spawn.x,
      y: scene.spawn.y,
      rotation: Math.PI, // facing up (front of icon = bottom)
      moving: false,
    };

    this.npcs = scene.npcs.map((n) => ({
      ...n,
      patrolIndex: 0,
      waitTimer: 0,
    }));

    this.cameraY = 0;
    this.edgeMessage = null; // set when player pushes on a scene exit
  }

  nearestNpcInRange() {
    let best = null;
    let bestDist = INTERACT_RANGE;
    for (const npc of this.npcs) {
      const d = Math.hypot(npc.x - this.player.x, npc.y - this.player.y);
      if (d < bestDist) { best = npc; bestDist = d; }
    }
    return best;
  }

  collides(x, y) {
    const half = PLAYER_COLLIDER / 2;
    const cx = x - half;
    const cy = y - half;
    for (const ob of this.scene.obstacles) {
      if (rectsOverlap(cx, cy, PLAYER_COLLIDER, PLAYER_COLLIDER, ob)) return true;
    }
    for (const npc of this.npcs) {
      if (rectsOverlap(cx, cy, PLAYER_COLLIDER, PLAYER_COLLIDER,
        { x: npc.x - 20, y: npc.y - 20, w: 40, h: 40 })) return true;
    }
    return false;
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
    if (p.moving) {
      const len = Math.hypot(dx, dy);
      const step = PLAYER_SPEED * dt;
      const nx = p.x + (dx / len) * step;
      const ny = p.y + (dy / len) * step;

      // Front of the icon (its bottom) faces the direction of travel
      p.rotation = Math.atan2(dy, dx) - Math.PI / 2;

      // Axis-separated movement so the player slides along walls
      if (!this.collides(nx, p.y)) p.x = nx;
      if (!this.collides(p.x, ny)) p.y = ny;

      // Scene edges: exits lead to adjacent scenes (not built yet); otherwise clamp
      const half = PLAYER_COLLIDER / 2;
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
    for (const npc of this.npcs) {
      if (!npc.patrol || npc.patrol.length < 2) continue;
      if (npc.waitTimer > 0) { npc.waitTimer -= dt; continue; }
      const target = npc.patrol[npc.patrolIndex];
      const dx = target.x - npc.x;
      const dy = target.y - npc.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 2) {
        npc.patrolIndex = (npc.patrolIndex + 1) % npc.patrol.length;
        npc.waitTimer = 2 + Math.random() * 3;
        continue;
      }
      const step = Math.min(npc.speed * dt, dist);
      npc.x += (dx / dist) * step;
      npc.y += (dy / dist) * step;
      npc.rotation = Math.atan2(dy, dx) - Math.PI / 2;
    }
  }

  drawSprite(img, x, y, rotation) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y - this.cameraY);
    ctx.rotate(rotation || 0);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  }

  render() {
    const ctx = this.ctx;
    const bg = this.images[this.scene.background];

    // Layer 1: background slice for current camera position
    ctx.drawImage(bg, 0, this.cameraY, VIEW_W, VIEW_H, 0, 0, VIEW_W, VIEW_H);

    // Layer 2: NPCs, then player on top
    for (const npc of this.npcs) {
      this.drawSprite(this.images[npc.sprite], npc.x, npc.y, npc.rotation);
    }
    this.drawSprite(
      this.images['assets/images/Player_Overhead_1.png'],
      this.player.x, this.player.y, this.player.rotation,
    );
  }
}
