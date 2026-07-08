// Layer 4: fixed UI — HUD, interaction hint, placeholder dialog, toasts.
// Also handles scaling the 1920x1080 stage to fit the browser window.

const $ = (id) => document.getElementById(id);

export function fitStage() {
  const stage = $('stage');
  const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

export function initStage() {
  fitStage();
  window.addEventListener('resize', fitStage);
}

// The health bar's pixel width scales with the player's max health instead
// of being a fixed CSS size, so it visibly grows as healthMax increases
// later in the game. 30px/point matches the original fixed 300px design at
// healthMax=10; at the new-game default of 5 that's 150px (half width).
const HEALTH_PX_PER_POINT = 30;

export function updateHud(stats) {
  $('health-bar').style.width = `${stats.healthMax * HEALTH_PX_PER_POINT}px`;
  $('health-fill').style.width = `${(stats.health / stats.healthMax) * 100}%`;
  $('health-value').textContent = `${stats.health}/${stats.healthMax}`;
  $('magic-fill').style.width = `${(stats.magic / stats.magicMax) * 100}%`;
  $('magic-value').textContent = `${stats.magic}/${stats.magicMax}`;
  $('gold-value').textContent = stats.gold.toLocaleString();
}

// Flash + glow the health fill (remove/reflow/add pattern so it replays on
// every hit, same trick as the dialog portrait's entrance animation). Call
// this alongside updateHud() whenever the player takes damage.
export function flashHealthDamage() {
  const el = $('health-fill');
  el.classList.remove('flash-damage');
  void el.offsetWidth; // force reflow
  el.classList.add('flash-damage');
}

// ---- Placeholder dialog (full dialog system comes later) ----

const RESPONSE_ROW_H = 53; // matches .response line-height
const ARROW_BASE_TOP = 48; // first row, arrow vertically centered

const dialogState = { open: false, selected: 0, npc: null, onClose: null, typing: false };

// ---- Typewriter effect for the NPC's dialog line ----
const TYPE_MS_PER_CHAR = 22;
let typeTimer = null;

function startTyping(text) {
  clearInterval(typeTimer);
  const el = $('dialog-line');
  el.textContent = '';
  dialogState.typing = true;
  let i = 0;
  typeTimer = setInterval(() => {
    i += 1;
    el.textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(typeTimer);
      typeTimer = null;
      dialogState.typing = false;
    }
  }, TYPE_MS_PER_CHAR);
}

function finishTyping() {
  if (!dialogState.typing) return;
  clearInterval(typeTimer);
  typeTimer = null;
  dialogState.typing = false;
  $('dialog-line').textContent = dialogState.npc.dialog.line;
}

export function isDialogOpen() {
  return dialogState.open;
}

export function openDialog(npc, onClose, onResponse) {
  dialogState.open = true;
  dialogState.selected = 0;
  dialogState.npc = npc;
  dialogState.onClose = onClose || null;
  dialogState.onResponse = onResponse || null;

  $('dialog-name').textContent = npc.name;
  $('dialog-role').textContent = npc.role;
  startTyping(npc.dialog.line);

  // Portrait: slide in quickly from the right, fading 0% -> 100% opacity.
  // Remove + reflow + re-add so the CSS animation replays on every open.
  const portrait = $('dialog-portrait');
  portrait.src = npc.portrait;
  portrait.classList.remove('portrait-enter');
  void portrait.offsetWidth; // force reflow
  portrait.classList.add('portrait-enter');

  renderResponses(npc.dialog.responses);

  $('dialog').classList.remove('hidden');
  refreshSelection();
}

function renderResponses(responses) {
  const box = $('dialog-responses');
  box.innerHTML = '';
  responses.forEach((text, i) => {
    const el = document.createElement('span');
    el.className = 'response';
    el.textContent = text;
    el.addEventListener('click', () => { dialogState.selected = i; chooseResponse(); });
    el.addEventListener('mouseenter', () => { dialogState.selected = i; refreshSelection(); });
    box.appendChild(el);
  });
}

function refreshSelection() {
  const nodes = $('dialog-responses').querySelectorAll('.response');
  nodes.forEach((el, i) => el.classList.toggle('selected', i === dialogState.selected));
  $('dialog-arrow').style.top = `${ARROW_BASE_TOP + dialogState.selected * RESPONSE_ROW_H}px`;
}

export function dialogKey(key) {
  if (!dialogState.open) return;
  const count = dialogState.npc.dialog.responses.length;
  if (key === 'ArrowUp') { dialogState.selected = (dialogState.selected + count - 1) % count; refreshSelection(); }
  if (key === 'ArrowDown') { dialogState.selected = (dialogState.selected + 1) % count; refreshSelection(); }
  if (key === ' ' || key === 'Enter') {
    // First press while typing just reveals the rest of the line.
    if (dialogState.typing) { finishTyping(); return; }
    chooseResponse();
  }
  if (key === 'Escape') closeDialog();
}

function chooseResponse() {
  // Most responses are still placeholders that just close the dialog, but a
  // response can carry a real effect (e.g. Gaffer's bite, or Mirelle's
  // vegetable-crate quest) — the caller that opened the dialog decides what
  // that means, via onResponse. If onResponse returns true, the dialog stays
  // open (used for "here's a thank-you line + here's your item" flows via
  // updateDialogContent/showReceivedItem) instead of auto-closing.
  const stayOpen = dialogState.onResponse
    ? dialogState.onResponse(dialogState.npc, dialogState.selected)
    : false;
  if (!stayOpen) closeDialog();
}

// Swap the open dialog's line + responses in place, without closing/reopening
// it (portrait stays put) — used when a response grants something and the
// NPC gets a follow-up thank-you line instead of the conversation just
// ending. responseEffects defaults to none (a plain closing line).
export function updateDialogContent({ line, responses, responseEffects }) {
  dialogState.npc = {
    ...dialogState.npc,
    dialog: { ...dialogState.npc.dialog, line, responses, responseEffects: responseEffects || [] },
  };
  dialogState.selected = 0;
  startTyping(line);
  renderResponses(responses);
  refreshSelection();
}

function closeDialog() {
  clearInterval(typeTimer);
  typeTimer = null;
  dialogState.typing = false;
  dialogState.open = false;
  $('dialog').classList.add('hidden');
  const received = $('dialog-received');
  received.classList.add('hidden');
  received.classList.remove('received-enter');
  if (dialogState.onClose) dialogState.onClose();
}

// Play the "item received" reveal (gold arrow + label + item frame sliding
// down from the portrait's side). Caller is responsible for actually adding
// the item to inventory state first — this is purely the visual beat.
export function showReceivedItem(itemDef) {
  $('received-image').src = itemDef.image;
  $('received-image').alt = itemDef.name;
  $('received-name').textContent = itemDef.name;
  const el = $('dialog-received');
  el.classList.remove('hidden');
  el.classList.remove('received-enter');
  void el.offsetWidth; // force reflow so the animation replays
  el.classList.add('received-enter');
}

// ---- Toast ----

let toastTimer = null;

export function toast(message, ms = 2500) {
  const el = $('toast');
  el.textContent = message;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), ms);
}

// ---- Menu / Inventory panels ----
// Both share the same tabbed-panel structure (see .panel-box in style.css);
// only one is ever open at a time, mirroring the topbar's two icon buttons.

const panelState = { menu: false, inventory: false };

export function isMenuOpen() { return panelState.menu; }
export function isInventoryOpen() { return panelState.inventory; }
export function isAnyPanelOpen() { return panelState.menu || panelState.inventory; }

function setActiveTab(panelEl, tabName) {
  panelEl.querySelectorAll('.panel-tab').forEach((el) => {
    el.classList.toggle('active', el.dataset.tab === tabName);
  });
  panelEl.querySelectorAll('.tab-pane').forEach((el) => {
    el.classList.toggle('hidden', el.dataset.pane !== tabName);
  });
  closeItemPopout();
}

function openPanel(name) {
  panelState[name] = true;
  $(name).classList.remove('hidden');
  if (name === 'menu') { audioFocusIndex = 0; refreshAudioFocus(); }
}

function closePanel(name) {
  panelState[name] = false;
  $(name).classList.add('hidden');
  closeItemPopout();
}

// ---- Keyboard-only navigation ----
// Up/Down cycle the active tab (instant preview, like a click). Space cycles
// focus between the active tab's adjustable rows (currently just the Audio
// tab's two sliders — everything else is a read-only placeholder for now).
// Left/Right adjust whichever row is focused. Escape always closes.

const SLIDER_STEP = 5; // percent, per arrow key press
let audioFocusIndex = 0; // 0 = music, 1 = sfx

function activePanelName() {
  if (panelState.menu) return 'menu';
  if (panelState.inventory) return 'inventory';
  return null;
}

function currentTabName(root) {
  const active = root.querySelector('.panel-tab.active');
  return active ? active.dataset.tab : null;
}

function cycleTab(root, dir) {
  const tabs = Array.from(root.querySelectorAll('.panel-tab'));
  const idx = tabs.findIndex((el) => el.classList.contains('active'));
  const next = tabs[(idx + dir + tabs.length) % tabs.length];
  setActiveTab(root, next.dataset.tab);
  audioFocusIndex = 0;
  refreshAudioFocus();
  itemFocusIndex = 0;
  refreshItemFocus();
}

function refreshAudioFocus() {
  const rows = document.querySelectorAll('#menu .slider-row');
  rows.forEach((row, i) => row.classList.toggle('focused', i === audioFocusIndex));
}

function adjustAudioSlider(dir) {
  const id = ['music', 'sfx'][audioFocusIndex];
  const input = $(`${id}-slider`);
  input.value = Math.max(0, Math.min(100, Number(input.value) + dir * SLIDER_STEP));
  input.dispatchEvent(new Event('input'));
}

export function panelKey(key) {
  const name = activePanelName();
  if (!name) return;
  const root = $(name);

  // The item action popout, when open, owns the keyboard entirely — Up/Down
  // move between its (non-disabled) actions, Space/Enter confirms, Escape
  // backs out of just the popout (back to grid focus) rather than closing
  // the whole panel.
  if (isPopoutOpen()) {
    const actions = popoutActionEls();
    if (key === 'Escape') { closeItemPopout(); return; }
    if (key === 'ArrowUp') { popoutActionIndex = (popoutActionIndex + actions.length - 1) % actions.length; refreshPopoutFocus(); return; }
    if (key === 'ArrowDown') { popoutActionIndex = (popoutActionIndex + 1) % actions.length; refreshPopoutFocus(); return; }
    if (key === ' ' || key === 'Enter') { runPopoutAction(actions[popoutActionIndex].dataset.action); return; }
    return;
  }

  if (key === 'Escape') { closeAllPanels(); return; }
  if (key === 'ArrowUp') { cycleTab(root, -1); return; }
  if (key === 'ArrowDown') { cycleTab(root, 1); return; }

  const tab = currentTabName(root);

  if (tab === 'items') {
    if (key === 'ArrowLeft') { moveItemFocus(-1); return; }
    if (key === 'ArrowRight') { moveItemFocus(1); return; }
    if (key === ' ' || key === 'Enter') {
      if (!itemTiles.length) return;
      const t = itemTiles[itemFocusIndex];
      openItemPopout(t.id, t.el);
    }
    return;
  }

  const onAudio = tab === 'audio';
  if (key === ' ' || key === 'Enter') {
    if (onAudio) { audioFocusIndex = (audioFocusIndex + 1) % 2; refreshAudioFocus(); }
    return;
  }
  if (key === 'ArrowLeft') { if (onAudio) adjustAudioSlider(-1); return; }
  if (key === 'ArrowRight') { if (onAudio) adjustAudioSlider(1); return; }
}

// ---- Items tab (real inventory grid) ----
// Tile layout is a flattened, row-major list (not true 2D nav) so Left/Right
// can walk it without conflicting with Up/Down's existing tab-cycling role.

let itemTiles = []; // [{ el, id }], in DOM/render order
let itemFocusIndex = 0;
let itemsHandlers = null; // { onAction(itemId, action) }, set via initItemsPanel
let popoutActionIndex = 0;

function moveItemFocus(dir) {
  if (!itemTiles.length) return;
  itemFocusIndex = (itemFocusIndex + dir + itemTiles.length) % itemTiles.length;
  refreshItemFocus();
}

function refreshItemFocus() {
  itemTiles.forEach((t, i) => t.el.classList.toggle('focused', i === itemFocusIndex));
}

// Render the Items tab's tile grid from inventory state + the item catalog.
// inventory: [{id, qty}], catalog: { id: {name, image, description, questItem} }
export function updateItemsPanel(inventory, catalog) {
  const grid = $('items-grid');
  grid.innerHTML = '';
  itemTiles = [];

  if (!inventory.length) {
    const p = document.createElement('p');
    p.className = 'items-empty';
    p.textContent = 'Nothing here yet.';
    grid.appendChild(p);
    closeItemPopout();
    return;
  }

  inventory.forEach((entry, i) => {
    const def = catalog[entry.id];
    if (!def) return;

    const tile = document.createElement('div');
    tile.className = 'item-tile';
    tile.dataset.itemId = entry.id;
    tile.dataset.itemName = def.name;
    tile.dataset.quest = def.questItem ? '1' : '';

    const frame = document.createElement('div');
    frame.className = 'item-frame';
    const img = document.createElement('img');
    img.className = 'item-image';
    img.src = def.image;
    img.alt = def.name;
    frame.appendChild(img);
    if (def.questItem) {
      const badge = document.createElement('div');
      badge.className = 'quest-badge';
      frame.appendChild(badge);
    }

    const label = document.createElement('div');
    label.className = 'item-label';
    label.textContent = def.description || def.name;
    if (entry.qty > 1) {
      const qty = document.createElement('span');
      qty.className = 'item-qty';
      qty.textContent = ` (${entry.qty})`;
      label.appendChild(qty);
    }

    tile.appendChild(frame);
    tile.appendChild(label);
    tile.addEventListener('click', () => {
      itemFocusIndex = i;
      refreshItemFocus();
      openItemPopout(entry.id, tile);
    });

    grid.appendChild(tile);
    itemTiles.push({ el: tile, id: entry.id });
  });

  itemFocusIndex = Math.min(itemFocusIndex, itemTiles.length - 1);
  refreshItemFocus();
}

// Register the handler for popout actions (Use/Inspect/Remove). Cancel is
// handled locally and never reaches the handler.
export function initItemsPanel(handlers) {
  itemsHandlers = handlers;
  $('item-popout').querySelectorAll('.popout-action').forEach((el) => {
    el.addEventListener('click', () => {
      if (el.classList.contains('disabled')) return;
      runPopoutAction(el.dataset.action);
    });
  });
  // Outside click closes the popout (tile clicks handle opening it themselves).
  document.addEventListener('click', (e) => {
    if (!isPopoutOpen()) return;
    if ($('item-popout').contains(e.target)) return;
    if (e.target.closest('.item-tile')) return;
    closeItemPopout();
  });
}

function isPopoutOpen() {
  return !$('item-popout').classList.contains('hidden');
}

function popoutActionEls() {
  return Array.from(document.querySelectorAll('#item-popout .popout-action')).filter(
    (el) => !el.classList.contains('disabled')
  );
}

function refreshPopoutFocus() {
  const enabled = popoutActionEls();
  document.querySelectorAll('#item-popout .popout-action').forEach((el) => el.classList.remove('focused'));
  enabled.forEach((el, i) => el.classList.toggle('focused', i === popoutActionIndex));
}

let popoutItemId = null;

function openItemPopout(itemId, anchorEl) {
  popoutItemId = itemId;
  popoutActionIndex = 0;
  $('popout-title').textContent = anchorEl.dataset.itemName;
  document.querySelector('#item-popout .popout-action[data-action="remove"]')
    .classList.toggle('disabled', anchorEl.dataset.quest === '1');
  positionPopout(anchorEl);
  $('item-popout').classList.remove('hidden');
  refreshPopoutFocus();
}

function closeItemPopout() {
  const el = $('item-popout');
  if (el) el.classList.add('hidden');
  popoutItemId = null;
}

function runPopoutAction(action) {
  if (action !== 'cancel' && itemsHandlers?.onAction) itemsHandlers.onAction(popoutItemId, action);
  closeItemPopout();
}

// #stage is CSS-scaled (see fitStage) rather than laid out at native
// resolution, so an anchor tile's screen-space getBoundingClientRect has to
// be converted back into 1920x1080 "stage space" before being applied as an
// inline position on #item-popout, which lives inside #ui (itself inset:0 of
// the scaled #stage and therefore already in that same coordinate system).
function positionPopout(anchorEl) {
  const stageRect = $('stage').getBoundingClientRect();
  const tileRect = anchorEl.getBoundingClientRect();
  const scale = stageRect.width / 1920;
  const x = Math.min((tileRect.left - stageRect.left) / scale, 1920 - 220);
  const y = (tileRect.bottom - stageRect.top) / scale + 10;
  const popout = $('item-popout');
  popout.style.left = `${x}px`;
  popout.style.top = `${y}px`;
}

export function toggleMenu() {
  if (panelState.menu) { closePanel('menu'); return; }
  closePanel('inventory');
  openPanel('menu');
}

export function toggleInventory() {
  if (panelState.inventory) { closePanel('inventory'); return; }
  closePanel('menu');
  openPanel('inventory');
}

export function closeAllPanels() {
  closePanel('menu');
  closePanel('inventory');
}

function initSlider(id, initial, onChange) {
  const input = $(`${id}-slider`);
  const fill = $(`${id}-fill`);
  const thumb = $(`${id}-thumb`);
  const value = $(`${id}-value`);
  const apply = (pct) => {
    fill.style.width = `${pct}%`;
    thumb.style.left = `${pct}%`;
    value.textContent = `${pct}%`;
  };
  input.value = Math.round(initial * 100);
  apply(Number(input.value));
  input.addEventListener('input', () => {
    const pct = Number(input.value);
    apply(pct);
    onChange(pct / 100);
  });
}

export function updateStatsPanel(stats) {
  $('stat-level').textContent = stats.level;
  $('stat-attack').textContent = stats.attack;
  $('stat-defense').textContent = stats.defense;
  $('stat-speed').textContent = stats.speed;
  $('stat-luck').textContent = stats.luck;
  $('xp-fill').style.width = `${Math.min(100, (stats.xp / stats.xpMax) * 100)}%`;
  $('xp-value').textContent = `${stats.xp.toLocaleString()} / ${stats.xpMax.toLocaleString()}`;
}

export function initPanels(audio) {
  ['menu', 'inventory'].forEach((name) => {
    const root = $(name);
    root.querySelectorAll('.panel-tab').forEach((tabEl) => {
      tabEl.addEventListener('click', () => setActiveTab(root, tabEl.dataset.tab));
    });
    root.querySelector('.panel-close').addEventListener('click', () => closePanel(name));
    // Clicking the dark backdrop (outside the panel box) closes it too.
    root.addEventListener('click', (e) => { if (e.target === root) closePanel(name); });
  });

  $('btn-menu').addEventListener('click', toggleMenu);
  $('btn-inventory').addEventListener('click', toggleInventory);

  initSlider('music', audio.getMusicVolume(), audio.setMusicVolume);
  initSlider('sfx', audio.getSfxVolume(), audio.setSfxVolume);
}
