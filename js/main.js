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
  audio.sfx(audio.SFX.item);
}

function removeItem(id, qty = 1) {
  const existing = inventory.find((it) => it.id === id);
  if (!existing) return;
  existing.qty -= qty;
  if (existing.qty <= 0) inventory.splice(inventory.indexOf(existing), 1);
  ui.updateItemsPanel(inventory, ITEMS);
  audio.sfx(audio.SFX.item);
}

// Centralized gold/health mutators (mirroring addItem/removeItem) so every
// gold change or point of damage plays its sound from one place, regardless
// of source — collectibles today, shops/battle later.
function addGold(amount) {
  stats.gold += amount;
  ui.updateHud(stats);
  audio.sfx(audio.SFX.gold);
}

function damagePlayer(amount) {
  stats.health = Math.max(0, stats.health - amount);
  ui.updateHud(stats);
  ui.flashHealthDamage();
  audio.sfx(audio.SFX.hurt);
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
    // Places (isPlace: true, e.g. "Your House") have no sprite — they're
    // always atHome and never rendered as a walking body — so skip them here.
    ...scene.npcs.filter((n) => n.sprite).map((n) => n.sprite),
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
    if (effect.damage) damagePlayer(effect.damage);
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

  // Builds the dialog "view" for an unoccupied building (a place, not an
  // NPC) — blank role, its description standing in for a dialogue line, and
  // one "Take {item name}" response per item still in the room (plus
  // Leave.). `place.items` is the WORLD's own copy of the room's remaining
  // item ids (js/world.js shallow-copies each npc off scene data, so
  // reassigning it here — always via non-mutating .filter(), never
  // .splice()/.push() — never touches the original scene module data).
  function buildPlaceView(place) {
    const contents = place.items.map((id) => ({ id, name: ITEMS[id]?.name || id }));
    const takeResponses = place.items.map((id) => `Take ${ITEMS[id]?.name || id}`);
    const takeEffects = place.items.map((id) => ({ takeItem: id }));
    return {
      ...place,
      role: '',
      contents,
      dialog: {
        line: place.description,
        responses: [...takeResponses, 'Leave.'],
        responseEffects: [...takeEffects, null],
      },
    };
  }

  // A "Take X" response removes that item from the room, grants it to the
  // player (same received-item reveal as Mirelle's vegetable crate), and
  // rebuilds the room's dialog in place — same "stay open, refresh content"
  // mechanism as the quest-thank-you flow (see ui.updateDialogContent()).
  function applyPlaceResponse(place, npcView, index) {
    const effect = npcView.dialog.responseEffects?.[index];
    if (!effect?.takeItem) return; // Leave. (or nothing) — close normally
    place.items = place.items.filter((id) => id !== effect.takeItem);
    addItem(effect.takeItem, 1);
    ui.showReceivedItem(ITEMS[effect.takeItem]);
    const refreshed = buildPlaceView(place);
    ui.updateDialogContent({
      line: refreshed.dialog.line,
      responses: refreshed.dialog.responses,
      responseEffects: refreshed.dialog.responseEffects,
      contents: refreshed.contents,
    });
    return true; // keep browsing the room
  }

  // Every NPC dialog opens through here so the per-character voice clip
  // (audio.DIALOGUE_SFX, keyed by npc.id) and response-effect handling are
  // consistent whether the NPC was approached directly or met at their door.
  // Places (isPlace: true) branch off to their own view/response builders —
  // they have no voice clip and no quest-status dialog variants.
  function openNpcDialog(npc, onClose) {
    if (npc.isPlace) {
      ui.openDialog(buildPlaceView(npc), onClose, (npcView, index) => applyPlaceResponse(npc, npcView, index));
      return;
    }
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
        addGold(item.reward.gold);
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
