// Tales of Celadune — entry point.
// Loads assets, builds the world for the current scene, runs the game loop.

import sceneD3 from './data/d3.js';
import { World } from './world.js';
import * as ui from './ui.js';
import * as audio from './audio.js';
import ITEMS from './data/items.js';
import QUESTS from './data/quests.js';
import ENEMIES from './data/enemies.js';
import * as battle from './battle.js';

// Attack/Defense start at 1 (Danny's spec, 2026-07-08 battle system) — real
// combat stats now, not placeholder flavor like the rest of this block.
// Speed keeps its earlier placeholder value (11) but now has real meaning
// too: it drives battle.js's turn order against enemies (kobolds: speed 8),
// so the player generally acts first without needing to touch it further.
const stats = {
  health: 5, healthMax: 5, magic: 5, magicMax: 10, gold: 0,
  level: 4, xp: 1240, xpMax: 2000, attack: 1, defense: 1, speed: 11, luck: 6,
};
const state = { started: false };

// Inventory *state* — what the player actually has, [{id, qty}], referencing
// js/data/items.js (the game-wide catalog) by id. Kept here alongside stats
// rather than in world/ui, which stay presentation-only.
const inventory = [];

// Equip *state* (2026-07-08) — one item id per slot, or null. Equipping
// never removes the item from `inventory`; it's just a separate pointer, so
// the item still shows up (with an "Equipped" marker) in its own category
// tab's grid (Equipment or Weapons — see items.js's categoryFor(), 2026-07-09).
// Only items whose catalog entry has a matching `slot` can go in a given
// slot — see js/data/items.js's schema comment.
const equipment = { head: null, clothing: null, feet: null, hands: null, mainhand: null, offhand: null };

function refreshItemsUi() {
  ui.updateItemsPanel(inventory, ITEMS, equipment);
}

function addItem(id, qty = 1) {
  const existing = inventory.find((it) => it.id === id);
  if (existing) existing.qty += qty; else inventory.push({ id, qty });
  refreshItemsUi();
  audio.sfx(audio.SFX.item);
}

function removeItem(id, qty = 1) {
  const existing = inventory.find((it) => it.id === id);
  if (!existing) return;
  existing.qty -= qty;
  if (existing.qty <= 0) inventory.splice(inventory.indexOf(existing), 1);
  refreshItemsUi();
  audio.sfx(audio.SFX.item);
}

// equipItem/unequipItem are the only two ways `equipment` changes — mirrors
// the addItem/removeItem/addGold/damagePlayer pattern of centralizing a
// piece of state's mutation + its UI refresh + its SFX in one place.
function equipItem(id) {
  const def = ITEMS[id];
  if (!def?.slot) return;
  equipment[def.slot] = id;
  ui.updateEquipmentPanel(equipment, ITEMS);
  refreshItemsUi();
  audio.sfx(audio.SFX.item);
}

function unequipItem(slot) {
  if (!equipment[slot]) return;
  equipment[slot] = null;
  ui.updateEquipmentPanel(equipment, ITEMS);
  refreshItemsUi();
  audio.sfx(audio.SFX.item);
}

// Effective Attack/Defense = base stat + every equipped item's bonus (most
// items grant +0 today — no armor with real bonuses exists yet, but the
// math is here so future gear just needs attackBonus/defenseBonus fields).
// weaponDamage() is what a successful player attack deals: the equipped
// mainhand weapon's damage, or 1 (unarmed) if no weapon is equipped — per
// Danny's spec exactly.
function equipmentBonus(field) {
  return Object.values(equipment).reduce((sum, id) => {
    if (!id) return sum;
    return sum + (ITEMS[id]?.[field] || 0);
  }, 0);
}
function effectiveAttack() { return stats.attack + equipmentBonus('attackBonus'); }
function effectiveDefense() { return stats.defense + equipmentBonus('defenseBonus'); }
function weaponDamage() {
  const mainhand = equipment.mainhand && ITEMS[equipment.mainhand];
  return mainhand?.damage ?? 1;
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
    // Every enemy portrait this scene's battles could use, preloaded up
    // front like everything else — battle art shouldn't pop in mid-fight.
    ...(scene.battles || []).flatMap((b) => b.enemies).map((id) => ENEMIES[id].portrait),
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
  refreshItemsUi();
  ui.updateQuestsPanel(quests, QUESTS);
  ui.updateEquipmentPanel(equipment, ITEMS);
  ui.initEquipmentPanel({
    onSlotActivate: (slot) => {
      if (equipment[slot]) { unequipItem(slot); return; }
      ui.toast('Select an item below to equip.');
    },
  });
  ui.initGameOver({ onRestart: () => respawnAfterDefeat() });
  ui.initBattle();

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

  // Popout actions from the Items tab. Inspect/Remove are unchanged; the
  // primary action (top button) is Equip/Unequip for gear (def.slot set),
  // Use-to-heal for potions (def.heal set), or the old "nothing yet" stub
  // for anything else (e.g. the vegetable crate) — see ui.js's
  // openItemPopout(), which decides the button's label/action to match.
  function onItemAction(itemId, action) {
    const def = ITEMS[itemId];
    if (!def) return;
    if (action === 'inspect') { ui.toast(def.description); return; }
    if (action === 'remove') { removeItem(itemId); return; }
    if (action === 'equip') { equipItem(itemId); return; }
    if (action === 'unequip') { unequipItem(def.slot); return; }
    if (action === 'use') {
      if (def.heal) { ui.toast(usePotion(itemId).message); return; }
      ui.toast('Nothing happens... yet.');
    }
  }

  // Shared by the Items-tab "Use" action and the battle Potion action —
  // consumes one, restores HP (capped at max), and reports back what
  // happened as a {ok, message} pair rather than showing it itself: the two
  // call sites display it differently (a toast outside battle, the battle
  // status line during one — see playerUsePotion()) and firing a toast from
  // in here unconditionally used to visually collide with the battle status
  // bar, which sits in roughly the same spot.
  function usePotion(itemId) {
    const entry = inventory.find((it) => it.id === itemId);
    if (!entry || entry.qty < 1) return { ok: false, message: 'You have no potions.' };
    const def = ITEMS[itemId];
    const before = stats.health;
    removeItem(itemId, 1);
    stats.health = Math.min(stats.healthMax, stats.health + def.heal);
    ui.updateHud(stats);
    const healed = stats.health - before;
    return { ok: true, message: `You drink a ${def.name} and recover ${healed} health.` };
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

  // ---- Battle (2026-07-08) ----
  // Turn-based combat: js/battle.js has the pure dice/turn-order logic;
  // this is the stateful orchestration (whose turn it is, waiting on player
  // input, running the round loop), same division of labor as dialog logic
  // living here while ui.js only renders it. A scene's `battles` array
  // (see js/data/d3.js) defines a door + an enemy id list; world.js's
  // battleNearDoor() is how interact() finds one to start.
  const ENEMY_TURN_DELAY_MS = 900; // pause between enemy turns so messages are readable

  const battleState = {
    active: false,
    enemies: [], // live copies: [{key, id, name, portrait, health, maxHealth, attack, defense, speed, damage}]
    order: [],   // this round's turn queue (mixed 'player' sentinel objects + enemy refs)
    turnPos: 0,
    onEnd: null, // (result) => void, called once the battle is fully resolved
  };

  function aliveEnemies() {
    return battleState.enemies.filter((e) => e.health > 0);
  }

  // Recomputed every round (not just once) via battle.turnOrder — enemies
  // that died last round simply won't be in the alive list anymore.
  function rollRoundOrder() {
    const combatants = [
      { kind: 'player', speed: stats.speed },
      ...aliveEnemies().map((e) => ({ kind: 'enemy', enemy: e, speed: e.speed })),
    ];
    return battle.turnOrder(combatants);
  }

  function startBattle(enemyIds, onEnd) {
    battleState.active = true;
    battleState.enemies = enemyIds.map((id, i) => {
      const def = ENEMIES[id];
      return {
        key: `${id}_${i}`, id, name: def.name, portrait: def.portrait,
        health: def.health, maxHealth: def.health,
        attack: def.attack, defense: def.defense, speed: def.speed, damage: def.damage,
      };
    });
    battleState.onEnd = onEnd || null;
    battleState.order = rollRoundOrder();
    battleState.turnPos = 0;
    ui.openBattle({
      enemies: battleState.enemies,
      onSelectAttack: beginTargeting,
      onSelectMagic: playerUseMagic,
      onSelectPotion: playerUsePotion,
      onSelectFlee: playerFlee,
      onConfirmTarget: playerAttack,
    });
    ui.setBattleMessage('A wild encounter begins!');
    runQueue();
  }

  // Advances through battleState.order. Stops (leaving the action menu up)
  // once it reaches the player's turn; enemy turns resolve themselves with
  // a short delay between each so their messages are readable back to back.
  function runQueue() {
    if (!battleState.active) return;
    if (checkBattleEnd()) return;
    if (battleState.turnPos >= battleState.order.length) {
      battleState.order = rollRoundOrder();
      battleState.turnPos = 0;
    }
    const current = battleState.order[battleState.turnPos];
    if (current.kind === 'player') {
      showPlayerActions();
      return;
    }
    if (current.enemy.health <= 0) {
      // Killed earlier this same round (order is rolled once per round, so a
      // dead enemy's slot can still come up later) — skip its turn, no delay.
      battleState.turnPos += 1;
      runQueue();
      return;
    }
    setTimeout(() => {
      if (!battleState.active) return;
      resolveEnemyTurn(current.enemy);
      ui.renderBattleEnemies(battleState.enemies);
      battleState.turnPos += 1;
      runQueue();
    }, ENEMY_TURN_DELAY_MS);
  }

  function equippedWeaponName() {
    return (equipment.mainhand && ITEMS[equipment.mainhand]?.name) || 'Unarmed';
  }
  function potionCount() {
    return inventory.find((it) => it.id === 'health_potion')?.qty || 0;
  }
  // Re-shows the action menu without advancing battleState.order/turnPos —
  // used both by runQueue() when a fresh player turn comes up, and by any
  // action that doesn't actually spend the turn (Magic's no-spells-yet stub,
  // Potion with none in inventory). ui.battleKey() sets its internal mode to
  // 'idle' the instant an action is selected, *before* the handler runs, so
  // any handler that doesn't end up calling runQueue() again must call this
  // itself or the battle UI is left with no live keyboard handler at all —
  // a real bug caught live 2026-07-09 (selecting Magic appeared to "freeze"
  // the game: the message updated, but no further key press did anything).
  function showPlayerActions() {
    ui.showBattleActions({ weaponName: equippedWeaponName(), potionCount: potionCount() });
  }

  function resolveEnemyTurn(enemy) {
    const hit = battle.resolveAttack(enemy.attack, effectiveDefense());
    if (hit) {
      const dmg = battle.rollDamage(enemy.damage);
      damagePlayer(dmg);
      ui.setBattleMessage(`The ${enemy.name} hits you for ${dmg} damage.`);
    } else {
      ui.setBattleMessage(`The ${enemy.name} attacks but misses.`);
    }
  }

  // Player chose Attack — hand off to ui.js's target-select sub-mode (Left/
  // Right cycle alive enemies, Space confirms via onConfirmTarget below,
  // Escape cancels back to the action menu without spending the turn).
  function beginTargeting() {
    ui.startTargeting();
  }

  function playerAttack(target) {
    const hit = battle.resolveAttack(effectiveAttack(), target.defense);
    if (hit) {
      const dmg = weaponDamage();
      target.health = Math.max(0, target.health - dmg);
      ui.setBattleMessage(`You hit the ${target.name} for ${dmg} damage.`);
      audio.sfx(audio.SFX.hurt);
    } else {
      ui.setBattleMessage(`You attack the ${target.name} but miss.`);
    }
    ui.renderBattleEnemies(battleState.enemies);
    battleState.turnPos += 1;
    runQueue();
  }

  // Magic has no spells to cast yet — an informative no-op that doesn't
  // spend the player's turn, same spirit as a grayed-out menu item but
  // still selectable/readable, matching the mockup's Magic slot being
  // present. Wire real spells into this once the Magic system exists.
  function playerUseMagic() {
    ui.setBattleMessage('You don’t know any spells yet.');
    showPlayerActions(); // no-op action — hand control straight back, see showPlayerActions()'s comment
  }

  // Reuses the same usePotion() the Items-tab "Use" action calls — only
  // spends the turn if it actually healed something (no potions = free
  // no-op, so accidentally picking Potion with an empty bag isn't a wasted
  // turn against three kobolds). Routes the result through the battle
  // status line (not a toast) so it doesn't visually collide with it.
  function playerUsePotion() {
    const result = usePotion('health_potion');
    ui.setBattleMessage(result.message);
    if (!result.ok) { showPlayerActions(); return; } // no-op action — see showPlayerActions()'s comment
    battleState.turnPos += 1;
    runQueue();
  }

  // Always succeeds — no precedent yet for a failable flee, and this keeps
  // early testing/iteration friction-free. Revisit if a real difficulty
  // curve calls for it later.
  function playerFlee() {
    ui.setBattleMessage('You flee the battle!');
    endBattle('fled');
  }

  function checkBattleEnd() {
    if (stats.health <= 0) { endBattle('defeat'); return true; }
    if (battleState.enemies.length && aliveEnemies().length === 0) { endBattle('victory'); return true; }
    return false;
  }

  function endBattle(result) {
    battleState.active = false;
    const onEnd = battleState.onEnd;
    battleState.onEnd = null;
    if (result === 'defeat') {
      ui.closeBattle();
      ui.showGameOver();
      pendingDefeatCallback = onEnd;
      return;
    }
    ui.closeBattle();
    if (result === 'victory') ui.toast('Victory! The kobolds are defeated.');
    if (onEnd) onEnd(result);
  }

  // Set right before showGameOver() so ui.initGameOver's onRestart (wired
  // once, above) knows what to finish up — same "defer the callback" shape
  // as battleState.onEnd, just surviving past endBattle() clearing it.
  let pendingDefeatCallback = null;

  // No real death penalty/checkpoint system yet (2026-07-08 — Danny opted
  // for a Game Over screen over an instant respawn): full-heal and return
  // the player to the scene's spawn point, close the screen, then let the
  // battle's own onEnd run (so e.g. a barn encounter isn't marked cleared —
  // the kobolds are still there to fight again).
  function respawnAfterDefeat() {
    stats.health = stats.healthMax;
    ui.updateHud(stats);
    world.player.x = scene.spawn.x;
    world.player.y = scene.spawn.y;
    ui.hideGameOver();
    const cb = pendingDefeatCallback;
    pendingDefeatCallback = null;
    if (cb) cb('defeat');
  }

  // Debug handle (mirrors window.world/window.quests) — lets a console or
  // an automated test drive/inspect a fight directly, e.g.
  // `battleDebug.state.enemies.forEach(e => e.health = 1)` to force a fast
  // win. NOT named `window.battle` — that collides with the browser's
  // auto-global for `<div id="battle">` (every element with an id becomes
  // `window.<id>`), which silently wins over a plain assignment.
  window.battleDebug = {
    start: startBattle, state: battleState, stats, equipment,
    effectiveAttack, effectiveDefense, weaponDamage,
    playerAttack, playerFlee, playerUsePotion, playerUseMagic, checkBattleEnd,
  };

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
      return;
    }

    // Battle encounters (e.g. the kobolds in the Old Barn) trigger the same
    // way a home door does — proximity + spacebar — see world.battleNearDoor().
    // Only a victory marks it `defeated` (world.js skips defeated ones), so
    // fleeing or losing leaves the encounter fightable again.
    const trigger = world.battleNearDoor();
    if (trigger) {
      startBattle(trigger.enemies, (result) => {
        if (result === 'victory') trigger.defeated = true;
      });
    }
  }

  window.addEventListener('keydown', (e) => {
    if (!state.started) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startGame(); }
      return;
    }
    // Game Over takes priority over everything (I/M included) — the only
    // way out is the Try Again button/key.
    if (ui.isGameOverOpen()) {
      if (['Enter', ' '].includes(e.key)) { e.preventDefault(); respawnAfterDefeat(); }
      return;
    }
    if (ui.isBattleOpen()) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Escape'].includes(e.key)) {
        e.preventDefault();
        ui.battleKey(e.key);
      }
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

    const locked = ui.isDialogOpen() || ui.isAnyPanelOpen() || ui.isBattleOpen() || ui.isGameOverOpen() || !state.started;
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
