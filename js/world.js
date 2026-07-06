// World: owns the current scene, player, NPCs, camera, collision, and canvas rendering.
// Layers 1 (scrolling background) and 2 (player/NPC icons) are drawn here.

const VIEW_W = 1920;
const VIEW_H = 1080;
const PLAYER_SPEED = 260; // px/sec
const COLLIDER = 36; // square collider centered on characters
const INTERACT_RANGE = 90;
const SHADOW_OFFSET = 3; // px, always to the bottom-right regardless of rotation
const SHADOW_ALPHA = 0.4;

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
    };

    this.npcs = scene.npcs.map((n) => ({
      ...n,
      patrolIndex: 0,
      waitTimer: 0,
      stuckTimer: 0,
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

  // Shared collision test. `self` is excluded; player and all NPCs block each other.
  collides(x, y, self) {
    const half = COLLIDER / 2;
    const cx = x - half;
    const cy = y - half;
    for (const ob of this.scene.obstacles) {
      if (rectsOverlap(cx, cy, COLLIDER, COLLIDER, ob)) return true;
    }
    const bodies = [this.player, ...this.npcs];
    for (const b of bodies) {
      if (b === self) continue;
      if (rectsOverlap(cx, cy, COLLIDER, COLLIDER,
        { x: b.x - half, y: b.y - half, w: COLLIDER, h: COLLIDER })) return true;
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
      if (!this.collides(nx, p.y, p)) p.x = nx;
      if (!this.collides(p.x, ny, p)) p.y = ny;

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
        npc.stuckTimer = 0;
        continue;
      }

      const step = Math.min(npc.speed * dt, dist);
      const desired = Math.atan2(dy, dx);
      const moved = this.steer(npc, desired, step);

      if (moved) {
        npc.stuckTimer = 0;
      } else {
        // Fully boxed in (e.g. the player is standing in the way):
        // wait politely, then try again.
        npc.stuckTimer += dt;
        if (npc.stuckTimer > 1.5) {
          npc.waitTimer = 1 + Math.random();
          npc.stuckTimer = 0;
        }
      }
    }
  }

  // Greedy local steering: try the desired heading, then progressively wider
  // angles to either side, and take the first free direction. Lets NPCs walk
  // around the player, buildings, trees, and each other.
  steer(body, desired, step) {
    const offsets = [0, 0.5, -0.5, 1.0, -1.0, 1.6, -1.6, 2.2, -2.2];
    for (const off of offsets) {
      const a = desired + off;
      const nx = body.x + Math.cos(a) * step;
      const ny = body.y + Math.sin(a) * step;
      if (!this.collides(nx, ny, body)) {
        body.x = nx;
        body.y = ny;
        body.rotation = a - Math.PI / 2; // icon bottom faces travel direction
        return true;
      }
    }
    return false;
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

  drawSprite(img, x, y, rotation) {
    const ctx = this.ctx;
    const screenY = y - this.cameraY;

    // Drop shadow: offset applied in screen space (before rotating), so it always
    // falls to the bottom-right no matter which way the icon faces.
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = SHADOW_ALPHA;
    ctx.translate(x + SHADOW_OFFSET, screenY + SHADOW_OFFSET);
    ctx.rotate(rotation || 0);
    ctx.drawImage(this.silhouetteOf(img), -img.width / 2, -img.height / 2);
    ctx.restore();

    ctx.save();
    ctx.translate(x, screenY);
    ctx.rotate(rotation || 0);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  }

  drawNameLabel(npc) {
    const ctx = this.ctx;
    const img = this.images[npc.sprite];
    const x = npc.x;
    const y = npc.y - this.cameraY - img.height / 2 - 14;
    ctx.save();
    ctx.font = '22px MedievalSharp, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = '#fff';
    ctx.fillText(npc.name, x, y);
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

    // Name label above the NPC the player could interact with
    const near = this.nearestNpcInRange();
    if (near) this.drawNameLabel(near);
  }
}
