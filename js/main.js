// Tales of Celadune — entry point.
// Loads assets, builds the world for the current scene, runs the game loop.

import sceneD3 from './data/d3.js';
import { World } from './world.js';
import * as ui from './ui.js';
import * as audio from './audio.js';
import ITEMS from './data/items.js';
import QUESTS from './data/quests.js';

const stats = {
  health: 5, healthMax: 5, magic: 5, magicMax: 10, gold: 0,
  level: 4, xp: 1240, xpMax: 2000, attack: 14, defense: 9, speed: 11, luck: 6,
};
const state = { started: false };

// Inventory *state* — what the player actually has, [{id, qty}], referencing
// js/data/items.js (the game-wide catalog) by id. Kept here alongside stats
// rather than in world/ui, which stay presentation-only.
const inventory = [];

function addItem(id, qty = 1) {
  const existing = inventory.find((it) => it.id === id);
  if (existing) existing.qty += qty; else inventory.push({ id, qty });
  ui.updateItemsPanel(inventory, ITEMS);
}

function removeItem(id, qty = 1) {
  const existing = inventory.find((it) => it.id === id);
  if (!existing) return;
  existing.qty -= qty;
  if (existing.qty <= 0) inventory.splice(inventory.indexOf(existing), 1);
  ui.updateItemsPanel(inventory, ITEMS);
}

// Quest *state* — which quests the player has been given and their status,
// [{id, status}] (status: 'active' | 'completed' | 'failed'), referencing
// js/data/quests.js (the catalog) by id. Started only via startQuest() so a
// quest is never added twice.
const quests = [];

function startQuest(id) {
  if (quests.find((q) => q.id === id)) return; // already have it — no duplicates
  const def = QUESTS[id];
  if (!def) return;
  quests.push({ id, status: 'active' });
  ui.updateQuestsPanel(quests, QUESTS);
  ui.showQuestAdded(def.name);
}

function questStatus(id) {
  return quests.find((q) => q.id === id)?.status || 'none';
}

// An NPC's dialog can vary by quest status (e.g. Mirelle offers the crate
// once, then asks about its status on later visits instead of handing over
// a second one) via an optional dialogByQuestStatus map on the NPC — see
// js/data/d3.js. Falls back to the NPC's plain `dialog` if no variant
// matches the current status (including 'none', before the quest exists).
function resolveNpcDialog(npc) {
  if (!npc.dialogByQuestStatus) return npc.dialog;
  for (const [questId, variants] of Object.entries(npc.dialogByQuestStatus)) {
    const variant = variants[questStatus(questId)];
    if (variant) return variant;
  }
  return npc.dialog;
}

const input = { up: false, down: false, left: false, right: false };

const KEYMAP = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
};

function loadImages(sources) {
  return Promise.all(sources.map((src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve([src, img]);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  }))).then(Object.fromEntries);
}

async function boot() {
  const scene = sceneD3;
  const sources = [
    scene.background,
    'assets/images/Player_Overhead_1.png',
    ...scene.npcs.map((n) => n.sprite),
    ...scene.npcs.filter((n) => n.home).map((n) => n.home.interior),
  ];
  const images = await loadImages([...new Set(sources)]);

  // Canvas text (NPC name labels) needs the webfont ready before first draw
  try { await document.fonts.load('22px MedievalSharp'); } catch { /* fallback font */ }

  const canvas = document.getElementById('game');
  const world = new World(canvas, scene, images);
  window.world = world; // debug handle
  window.quests = quests; // debug handle

  ui.initStage();
  ui.initPanels(audio);
  ui.updateHud(stats);
  ui.updateStatsPanel(stats);
  ui.initItemsPanel({ onAction: onItemAction });
  ui.updateItemsPanel(inventory, ITEMS);
  ui.updateQuestsPanel(quests, QUESTS);

  // Start screen: theme music now (or on first gesture if autoplay is blocked),
  // then cross-fade to the overworld track when the game starts.
  audio.play(audio.TRACKS.theme);
  const retryTheme = () => {
    if (!state.started && !audio.nowPlaying()) audio.play(audio.TRACKS.theme);
  };
  window.addEventListener('pointerdown', retryTheme);
  window.addEventListener('keydown', retryTheme);

  function startGame() {
    if (state.started) return;
    state.started = true;
    document.getElementById('start-screen').classList.add('hidden');
    audio.play(audio.TRACKS.overworld, 1500);
  }
  document.getElementById('btn-start').addEventListener('click', startGame);

  // A response can carry an optional effect (dialog.responseEffects, parallel
  // to dialog.responses) — damage (Gaffer's bite), a plain toast message,
  // startQuest (adds a quest + fires the "Quest Added" banner), and/or
  // grantItem (e.g. Mirelle's vegetable crate). grantItem returns true so
  // ui.chooseResponse() keeps the dialog open for the follow-up thank-you
  // line instead of closing immediately.
  function applyResponseEffect(npc, index) {
    const effect = npc.dialog.responseEffects?.[index];
    if (!effect) return;
    if (effect.damage) {
      stats.health = Math.max(0, stats.health - effect.damage);
      ui.updateHud(stats);
      ui.flashHealthDamage();
    }
    if (effect.startQuest) startQuest(effect.startQuest);
    if (effect.grantItem) {
      addItem(effect.grantItem, effect.qty ?? 1);
      ui.showReceivedItem(ITEMS[effect.grantItem]);
      if (effect.thankYou) {
        ui.updateDialogContent({ line: effect.thankYou, responses: ['Leave.'] });
      }
      return true;
    }
    if (effect.message) ui.toast(effect.message);
  }

  // Popout actions (Use / Inspect / Remove) from the Items tab.
  function onItemAction(itemId, action) {
    const def = ITEMS[itemId];
    if (!def) return;
    if (action === 'inspect') { ui.toast(def.description); return; }
    if (action === 'remove') { removeItem(itemId); return; }
    if (action === 'use') { ui.toast('Nothing happens... yet.'); }
  }

  // Every NPC dialog opens through here so the per-character voice clip
  // (audio.DIALOGUE_SFX, keyed by npc.id) and response-effect handling are
  // consistent whether the NPC was approached directly or met at their door.
  function openNpcDialog(npc, onClose) {
    const voice = audio.DIALOGUE_SFX[npc.id];
    if (voice) audio.sfx(voice, 1.0);
    ui.openDialog({ ...npc, dialog: resolveNpcDialog(npc) }, onClose, applyResponseEffect);
  }

  function interact() {
    const npc = world.nearestNpcInRange();
    if (npc) { openNpcDialog(npc); return; }

    const item = world.nearestInteractableInRange();
    if (item) {
      item.collected = true;
      if (item.reward?.gold) {
        stats.gold += item.reward.gold;
        ui.updateHud(stats);
        ui.toast(`You found ${item.reward.gold} gold!`);
      } else {
        ui.toast('You found something!');
      }
      return;
    }

    const homeNpc = world.homeNpcNearDoor();
    if (homeNpc) {
      if (homeNpc.atHome) {
        audio.sfx(audio.SFX.door); // player steps inside
        world.interior = images[homeNpc.home.interior];
        openNpcDialog(homeNpc, () => {
          audio.sfx(audio.SFX.door); // ...and back out
          world.interior = null;
        });
      } else {
        ui.toast('The door is locked.');
      }
    }
  }

  window.addEventListener('keydown', (e) => {
    if (!state.started) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startGame(); }
      return;
    }
    if (ui.isDialogOpen()) {
      e.preventDefault();
      ui.dialogKey(e.key);
      return;
    }
    // I/M toggle the panels from anywhere in the world, and also switch
    // straight from one panel to the other (or close) while one is open —
    // toggleInventory/toggleMenu already handle all three cases.
    if (e.key === 'i' || e.key === 'I') { e.preventDefault(); ui.toggleInventory(); return; }
    if (e.key === 'm' || e.key === 'M') { e.preventDefault(); ui.toggleMenu(); return; }
    if (ui.isAnyPanelOpen()) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Escape'].includes(e.key)) {
        e.preventDefault();
        ui.panelKey(e.key);
      }
      return;
    }
    if (KEYMAP[e.key]) { input[KEYMAP[e.key]] = true; e.preventDefault(); }
    if (e.key === ' ') {
      e.preventDefault();
      interact();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (KEYMAP[e.key]) { input[KEYMAP[e.key]] = false; e.preventDefault(); }
  });

  let last = performance.now();
  let lastEdgeMessage = 0;

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    const locked = ui.isDialogOpen() || ui.isAnyPanelOpen() || !state.started;
    world.update(dt, input, locked);
    world.render();

    audio.setWalking(!locked && world.player.moving);

    if (world.edgeMessage && now - lastEdgeMessage > 3000) {
      ui.toast(world.edgeMessage);
      lastEdgeMessage = now;
    }

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

boot().catch((err) => {
  document.body.innerHTML = `<p style="color:#fff;font:20px sans-serif;padding:40px">${err.message}</p>`;
});
