// Tales of Celadune — entry point.
// Loads assets, builds the world for the current scene, runs the game loop.

import sceneD3 from './data/d3.js';
import { World } from './world.js';
import * as ui from './ui.js';
import * as audio from './audio.js';

const stats = {
  health: 5, healthMax: 10, magic: 5, magicMax: 10, gold: 0,
  level: 4, xp: 1240, xpMax: 2000, attack: 14, defense: 9, speed: 11, luck: 6,
};
const state = { started: false };

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

  ui.initStage();
  ui.initPanels(audio);
  ui.updateHud(stats);
  ui.updateStatsPanel(stats);

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

  function interact() {
    const npc = world.nearestNpcInRange();
    if (npc) { ui.openDialog(npc); return; }

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
        ui.openDialog(homeNpc, () => {
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
