// Layer 4: fixed UI — HUD, interaction hint, placeholder dialog, toasts.
// Also handles scaling the 1920x1080 stage to fit the browser window.

import { categoryFor, CATEGORY_SLOTS, SLOT_LABEL, statLineFor } from './data/items.js';

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

// mode: 'text' (normal line + response list) or 'grid' (a vendor's Buy/Sell
// item grid has taken over the response box — see dialogGridState below).
const dialogState = { open: false, selected: 0, npc: null, onClose: null, typing: false, mode: 'text' };

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
  $('dialog-role').textContent = npc.role || '';
  startTyping(npc.dialog.line);

  // An unoccupied building (npc.isPlace, e.g. "Your House") has no portrait
  // — that slot shows a "Contents" list instead, built once here since which
  // mode is active doesn't change for the life of one open dialog. NPCs
  // still get the usual slide-in-from-the-right portrait.
  const portraitFrame = $('portrait-frame');
  const contentsFrame = $('dialog-contents');
  if (npc.isPlace) {
    portraitFrame.classList.add('hidden');
    contentsFrame.classList.remove('hidden');
    renderContentsList(npc.contents);
  } else {
    portraitFrame.classList.remove('hidden');
    contentsFrame.classList.add('hidden');
    // Portrait: slide in quickly from the right, fading 0% -> 100% opacity.
    // Remove + reflow + re-add so the CSS animation replays on every open.
    const portrait = $('dialog-portrait');
    portrait.src = npc.portrait;
    portrait.classList.remove('portrait-enter');
    void portrait.offsetWidth; // force reflow
    portrait.classList.add('portrait-enter');
  }

  renderResponses(npc.dialog.responses);

  // Vendors get the portrait-on-the-left shop layout (see #dialog.vendor in
  // style.css); everyone else keeps the standard portrait-on-the-right one.
  // A vendor's name/title + their own gold live in the header ABOVE the box.
  const isVendor = !!npc.vendor;
  $('dialog').classList.toggle('vendor', isVendor);
  $('vendor-header').classList.toggle('hidden', !isVendor);
  if (isVendor) {
    $('vendor-name').textContent = npc.name;
    $('vendor-title').textContent = npc.role || '';
    setVendorGold(npc.gold || 0);
  }

  // Defensive reset: a dialog always opens in text mode (greeting shown,
  // grid + arrow shown, grid hidden), even if the last one was closed
  // mid-shop-grid somehow (closeDialog() also resets this).
  dialogState.mode = 'text';
  $('dialog-line').classList.remove('hidden');
  $('dialog-shop').classList.add('hidden');
  $('dialog-arrow').classList.remove('hidden');
  $('dialog-responses').classList.remove('hidden');

  $('dialog').classList.remove('hidden');
  refreshSelection();
}

// items: [{id, name}] — the "Contents" list shown in a place's dialog
// (instead of a portrait). Re-called whenever an item is taken so the list
// stays in sync with what's actually left in the room.
function renderContentsList(items) {
  const list = $('contents-list');
  list.innerHTML = '';
  if (!items || !items.length) {
    const li = document.createElement('li');
    li.className = 'contents-empty';
    li.textContent = 'Nothing here.';
    list.appendChild(li);
    return;
  }
  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'contents-item';
    li.textContent = item.name;
    list.appendChild(li);
  });
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
  // The vendor Buy/Sell grid takes over the response box's keyboard focus
  // entirely while open — Left/Right move the tile selection, Space trades,
  // Escape returns to the Buy/Sell/Leave response list (not a full close).
  if (dialogState.mode === 'grid') { dialogGridKey(key); return; }
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
// it (portrait/contents-list slot stays put) — used when a response grants
// something and the conversation continues instead of ending: an NPC's
// follow-up thank-you line, or a place's room refreshing after an item is
// taken. responseEffects defaults to none (a plain closing line). `contents`
// is optional — pass it (a place's updated [{id,name}] list) to re-render
// the Contents list; omitted for ordinary NPC dialog.
export function updateDialogContent({ line, responses, responseEffects, contents }) {
  // Only replay the typewriter effect if the line actually changed — a
  // place's room refreshing after taking an item (2026-07-09 fix, Danny:
  // "the description text only needs to build in one time") passes back the
  // same static description every call, which previously re-typed it from
  // scratch each time. An NPC's real thank-you follow-up line still animates
  // normally since it *is* new text.
  const lineChanged = line !== dialogState.npc?.dialog?.line;
  dialogState.npc = {
    ...dialogState.npc,
    dialog: { ...dialogState.npc.dialog, line, responses, responseEffects: responseEffects || [] },
    ...(contents ? { contents } : {}),
  };
  dialogState.selected = 0;
  if (lineChanged) {
    startTyping(line);
  } else {
    clearInterval(typeTimer);
    typeTimer = null;
    dialogState.typing = false;
    $('dialog-line').textContent = line;
  }
  renderResponses(responses);
  if (contents) renderContentsList(contents);
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
  received.classList.remove('gave');
  // A vendor visit that ends mid-grid (e.g. the player just walks off — Esc
  // in grid mode only backs out one level, so this is the only other way to
  // leave a grid open) shouldn't leave stale state for the next dialog.
  dialogGridState.open = false;
  dialogGridState.popoutOpen = false;
  $('vendor-popout').classList.remove('open');
  dialogState.mode = 'text';
  $('dialog-shop').classList.add('hidden');
  $('dialog-line').classList.remove('hidden');
  $('dialog-arrow').classList.remove('hidden');
  $('dialog-responses').classList.remove('hidden');
  $('dialog').classList.remove('vendor');
  $('vendor-header').classList.add('hidden');
  if (dialogState.onClose) dialogState.onClose();
}

// Item-transfer reveal, both directions (2026-07-10): RECEIVED (caret
// pointing down, block drops in from above — the item "arriving") and GAVE
// (caret pointing up, block rises in from below — the item "leaving", e.g.
// feeding Gaffer his corn). One shared element/#dialog-received block; the
// .gave class flips the caret and the entrance animation. Caller is
// responsible for actually mutating inventory state first — this is purely
// the visual beat.
function showItemTransfer(itemDef, mode) {
  $('received-image').src = itemDef.image;
  $('received-image').alt = itemDef.name;
  $('received-name').textContent = itemDef.name;
  const el = $('dialog-received');
  el.classList.toggle('gave', mode === 'gave');
  el.querySelector('.received-label').textContent = mode === 'gave' ? 'Gave' : 'Received';
  el.classList.remove('hidden');
  el.classList.remove('received-enter');
  void el.offsetWidth; // force reflow so the animation replays
  el.classList.add('received-enter');
}

export function showReceivedItem(itemDef) {
  showItemTransfer(itemDef, 'received');
}

export function showGaveItem(itemDef) {
  showItemTransfer(itemDef, 'gave');
}

// ---- Info banner (shared, 2026-07-16) ----
// One top banner (battle-status styled) for every transient notice. `gold`
// gives quest events the medieval-gold heading treatment; the window itself
// is the same either way, so pop-ups read consistently across the game.
let toastTimer = null;

function showBanner(text, { ms = 2500, gold = false } = {}) {
  const el = $('toast');
  const txt = $('toast-text');
  txt.textContent = text;
  txt.classList.toggle('banner-gold', gold);
  el.classList.remove('hidden');
  el.classList.remove('toast-enter');
  void el.offsetWidth; // force reflow so the drop-in replays
  el.classList.add('toast-enter');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), ms);
}

export function toast(message, ms = 2500) {
  showBanner(message, { ms });
}

// Quest lifecycle events use the same banner, gold-styled as their own beat.
function showQuestToast(text) {
  showBanner(text, { ms: 3500, gold: true });
}

export function showQuestAdded(questName) {
  showQuestToast(`Quest Added: ${questName}`);
}

export function showQuestCompleted(questName) {
  showQuestToast(`Quest Completed: ${questName}`);
}

// ---- Vendor Buy/Sell grid (2026-07-15, expanded 2026-07-16) ----
// Part of the dialogue window itself: picking "Buy" or "Sell" (an ordinary
// dialogue response, see main.js's buildVendorDialog) calls showDialogGrid(),
// which swaps the greeting (top box, right of the portrait) for the item
// grid. The Buy/Sell/Leave choices stay visible in the response box; the grid
// just takes keyboard focus (the response arrow hides). Navigation is true 2D
// (arrows move a lit selection across rows/columns); Space opens a per-item
// dropdown (#vendor-popout: Buy/Sell · Inspect · Cancel). main.js owns the
// gold/inventory mutation via onSelect and re-hands fresh lists to
// refreshDialogGrid; ui.js is presentation + nav only.
const dialogGridState = {
  open: false, kind: 'buy', items: [], playerGold: 0, vendorGold: 0,
  focus: 0, cols: 1, emptyText: '',
  onSelect: null, onInspect: null, onBack: null,
  popoutOpen: false, popoutFocus: 0,
};

export function isDialogGridOpen() { return dialogGridState.open; }

export function showDialogGrid({ kind, items, playerGold, vendorGold, emptyText, onSelect, onInspect, onBack }) {
  Object.assign(dialogGridState, {
    open: true, kind: kind || 'buy', items: items || [],
    playerGold: playerGold || 0, vendorGold: vendorGold || 0,
    emptyText: emptyText || '', onSelect, onInspect, onBack,
    focus: 0, popoutOpen: false, popoutFocus: 0,
  });
  dialogState.mode = 'grid';
  $('dialog-shop-label').textContent = kind === 'sell' ? 'Sell' : 'Buy';
  // Top box: grid takes the greeting's place. Bottom box: responses stay put,
  // but the arrow hides since focus is on the grid now.
  $('dialog-line').classList.add('hidden');
  $('dialog-shop').classList.remove('hidden');
  $('dialog-arrow').classList.add('hidden');
  setVendorGold(dialogGridState.vendorGold);
  renderDialogGrid();
}

function setVendorGold(g) {
  const el = $('vendor-gold-value');
  if (el) el.textContent = Number(g).toLocaleString();
}

function affordable(it) {
  return dialogGridState.kind === 'buy'
    ? dialogGridState.playerGold >= it.price      // player can pay
    : dialogGridState.vendorGold >= it.value;     // vendor can pay
}

function renderDialogGrid() {
  const items = dialogGridState.items;
  if (dialogGridState.focus >= items.length) dialogGridState.focus = Math.max(0, items.length - 1);
  const grid = $('dialog-shop-grid');
  grid.innerHTML = '';
  if (!items.length) {
    const p = document.createElement('p');
    p.className = 'items-empty';
    p.textContent = dialogGridState.emptyText;
    grid.appendChild(p);
    return;
  }
  items.forEach((it, i) => {
    const tile = buildDialogGridTile(it, i);
    tile.classList.toggle('focused', i === dialogGridState.focus);
    grid.appendChild(tile);
  });
  measureGridCols();
}

// Column count = how many tiles share the first tile's offsetTop. Needed for
// up/down (±cols) 2D navigation, since the grid is auto-fill and the count
// depends on the rendered width.
function measureGridCols() {
  const tiles = $('dialog-shop-grid').querySelectorAll('.item-tile');
  if (!tiles.length) { dialogGridState.cols = 1; return; }
  const top0 = tiles[0].offsetTop;
  let cols = 0;
  for (const t of tiles) { if (t.offsetTop === top0) cols++; else break; }
  dialogGridState.cols = Math.max(1, cols);
}

function buildDialogGridTile(it, i) {
  const buying = dialogGridState.kind === 'buy';
  const tile = document.createElement('div');
  tile.className = 'item-tile';
  if (!affordable(it)) tile.classList.add('unaffordable');
  const frame = document.createElement('div');
  frame.className = 'item-frame';
  const img = document.createElement('img');
  img.className = 'item-image';
  img.src = it.image; img.alt = it.name;
  frame.appendChild(img);
  const label = document.createElement('div');
  label.className = 'item-label';
  label.textContent = it.name;
  if (!buying && it.qty > 1) {
    const qty = document.createElement('span'); qty.className = 'item-qty'; qty.textContent = ` (${it.qty})`;
    label.appendChild(qty);
  }
  const price = document.createElement('div');
  price.className = 'item-price';
  price.textContent = String(buying ? it.price : it.value);
  tile.appendChild(frame);
  tile.appendChild(label);
  tile.appendChild(price);
  tile.addEventListener('mouseenter', () => { if (!dialogGridState.popoutOpen) { dialogGridState.focus = i; refreshDialogGridFocus(); } });
  tile.addEventListener('click', () => { dialogGridState.focus = i; refreshDialogGridFocus(); openVendorPopout(); });
  return tile;
}

function refreshDialogGridFocus() {
  const tiles = $('dialog-shop-grid').querySelectorAll('.item-tile');
  tiles.forEach((el, i) => el.classList.toggle('focused', i === dialogGridState.focus));
  const cur = tiles[dialogGridState.focus];
  if (cur) cur.scrollIntoView({ block: 'nearest' });
}

// Called by main.js after a trade — repaint with the new gold + item list.
// Keeps the current selection where possible.
export function refreshDialogGrid({ items, playerGold, vendorGold } = {}) {
  if (items) dialogGridState.items = items;
  if (playerGold != null) dialogGridState.playerGold = playerGold;
  if (vendorGold != null) { dialogGridState.vendorGold = vendorGold; setVendorGold(vendorGold); }
  if (dialogGridState.open) renderDialogGrid();
}

// ---- The per-item dropdown (#vendor-popout) ----
function vendorPopoutActionEls() {
  return Array.from(document.querySelectorAll('#vendor-popout .popout-action'))
    .filter((el) => !el.classList.contains('disabled'));
}

function openVendorPopout() {
  const it = dialogGridState.items[dialogGridState.focus];
  if (!it) return;
  const buying = dialogGridState.kind === 'buy';
  const trade = $('vendor-popout-trade');
  trade.textContent = buying ? 'Buy' : 'Sell';
  // Can't buy what you can't afford / can't sell what the vendor can't afford.
  trade.classList.toggle('disabled', !affordable(it));
  const tile = $('dialog-shop-grid').querySelectorAll('.item-tile')[dialogGridState.focus];
  positionVendorPopout(tile);
  dialogGridState.popoutOpen = true;
  dialogGridState.popoutFocus = 0;
  $('vendor-popout').classList.add('open');
  refreshVendorPopoutFocus();
}

function closeVendorPopout() {
  dialogGridState.popoutOpen = false;
  $('vendor-popout').classList.remove('open');
}

function refreshVendorPopoutFocus() {
  const enabled = vendorPopoutActionEls();
  document.querySelectorAll('#vendor-popout .popout-action').forEach((el) => el.classList.remove('focused'));
  enabled.forEach((el, i) => el.classList.toggle('focused', i === dialogGridState.popoutFocus));
}

function runVendorPopoutAction(action) {
  const it = dialogGridState.items[dialogGridState.focus];
  closeVendorPopout();
  if (!it) return;
  if (action === 'trade') { if (dialogGridState.onSelect) dialogGridState.onSelect(it.id); }
  else if (action === 'inspect') { if (dialogGridState.onInspect) dialogGridState.onInspect(it.id); }
  // 'cancel' just closes.
}

// Same screen-space -> stage-space conversion as the inventory popout, since
// #vendor-popout also lives inside the CSS-scaled #ui. Positioned flush under
// the focused tile.
function positionVendorPopout(anchorEl) {
  if (!anchorEl) return;
  const stageRect = $('stage').getBoundingClientRect();
  const tileRect = anchorEl.getBoundingClientRect();
  const scale = stageRect.width / 1920;
  const pop = $('vendor-popout');
  pop.style.left = `${(tileRect.left - stageRect.left) / scale}px`;
  pop.style.top = `${(tileRect.bottom - stageRect.top) / scale}px`;
  pop.style.width = `${tileRect.width / scale}px`;
}

function dialogGridKey(key) {
  // Dropdown open: it owns the keys (up/down between actions, Space confirm,
  // Escape closes just the dropdown back to the grid).
  if (dialogGridState.popoutOpen) {
    const acts = vendorPopoutActionEls();
    if (key === 'Escape') { closeVendorPopout(); return; }
    if (key === 'ArrowUp') { dialogGridState.popoutFocus = (dialogGridState.popoutFocus + acts.length - 1) % acts.length; refreshVendorPopoutFocus(); return; }
    if (key === 'ArrowDown') { dialogGridState.popoutFocus = (dialogGridState.popoutFocus + 1) % acts.length; refreshVendorPopoutFocus(); return; }
    if (key === ' ' || key === 'Enter') { const el = acts[dialogGridState.popoutFocus]; if (el) runVendorPopoutAction(el.dataset.action); return; }
    return;
  }
  // Grid nav.
  const items = dialogGridState.items;
  const n = items.length;
  if (key === 'Escape') { hideDialogGrid(); return; }
  if (!n) return;
  const cols = dialogGridState.cols || 1;
  let f = dialogGridState.focus;
  if (key === 'ArrowLeft') f = Math.max(0, f - 1);
  else if (key === 'ArrowRight') f = Math.min(n - 1, f + 1);
  else if (key === 'ArrowUp') f = f - cols >= 0 ? f - cols : f;
  else if (key === 'ArrowDown') f = f + cols < n ? f + cols : f;
  else if (key === ' ' || key === 'Enter') { openVendorPopout(); return; }
  else return;
  dialogGridState.focus = f;
  refreshDialogGridFocus();
}

// Wire the dropdown's action rows for mouse users (keyboard path above goes
// through dialogGridKey). Called once from main.js boot.
export function initVendorGrid() {
  document.querySelectorAll('#vendor-popout .popout-action').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (el.classList.contains('disabled')) return;
      runVendorPopoutAction(el.dataset.action);
    });
  });
  document.addEventListener('click', (e) => {
    if (!dialogGridState.popoutOpen) return;
    if ($('vendor-popout').contains(e.target)) return;
    if (e.target.closest('.item-tile')) return;
    closeVendorPopout();
  });
}

// Leaves grid mode and returns keyboard focus to the response list — used by
// Escape (dialogGridKey) and defensively by closeDialog(). onBack restores the
// Buy/Sell/Leave response content in the same window.
function hideDialogGrid() {
  if (!dialogGridState.open) return;
  const cb = dialogGridState.onBack;
  closeVendorPopout();
  dialogGridState.open = false;
  dialogState.mode = 'text';
  $('dialog-shop').classList.add('hidden');
  $('dialog-line').classList.remove('hidden');
  $('dialog-arrow').classList.remove('hidden');
  $('dialog-responses').classList.remove('hidden');
  if (cb) cb();
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
  const root = $(name);
  root.classList.remove('hidden');
  // Always land on the top tab, tab-list focus (Level 0) — a fresh,
  // predictable starting point every time the panel opens, regardless of
  // where the player left off last time.
  const firstTab = root.querySelector('.panel-tab');
  if (firstTab) setActiveTab(root, firstTab.dataset.tab);
  audioFocusIndex = 0;
  gridFocusIndex = 0;
  sectionIndex = 0;
  setNavLevel(root, 'tabs');
}

function closePanel(name) {
  panelState[name] = false;
  $(name).classList.add('hidden');
  closeItemPopout();
  navLevel = 'tabs';
}

// ---- Keyboard-only navigation ----
// A panel is navigated in levels, each one step deeper than the last, and
// Escape always steps back exactly one level (I/M can still close from
// anywhere):
//   Level 0 "tabs"    Up/Down cycle the active tab. Space enters it.
//                      Escape closes the whole panel.
//   Level 1 "content"  varies per tab — Audio: Up/Down move between the
//                      Music/Effects rows, Left/Right adjust the focused
//                      one. Items: Left/Right move tile focus, Space opens
//                      the action popout (Level 2). Escape returns to the
//                      tab list (Level 0).
//   Level 2 "popout"   (Items only) Up/Down move between the popout's
//                      enabled actions, Space confirms. Escape closes just
//                      the popout, back to the item grid (Level 1).
// The gold arrow indicator lives on whichever level currently has focus:
// on the active tab at Level 0, on the focused row/tile at Level 1 — see
// setNavLevel() and the .content-mode CSS toggle.

const SLIDER_STEP = 5; // percent, per arrow key press
let audioFocusIndex = 0; // 0 = music, 1 = sfx
let navLevel = 'tabs'; // 'tabs' | 'content' — Level 2 (popout) is tracked separately via isPopoutOpen()

// Equipment/Weapons are a stack of subcategory sections (one per equip slot
// — see items.js's CATEGORY_SLOTS), each with its own item grid; Up/Down
// switch which section has focus (sectionIndex), Left/Right walk that
// section's grid. Magic/Items have exactly one implicit section (their
// single flat grid), so sectionIndex is simply unused/always 0 there.

function activePanelName() {
  if (panelState.menu) return 'menu';
  if (panelState.inventory) return 'inventory';
  return null;
}

function currentTabName(root) {
  const active = root.querySelector('.panel-tab.active');
  return active ? active.dataset.tab : null;
}

// Move focus between Level 0 (tab list) and Level 1 (that tab's content),
// updating which gold arrow is visible to match.
function setNavLevel(root, level) {
  navLevel = level;
  root.querySelector('.panel-tabs').classList.toggle('content-mode', level === 'content');
  refreshAudioFocus();
  refreshGridFocus();
}

function cycleTab(root, dir) {
  const tabs = Array.from(root.querySelectorAll('.panel-tab'));
  const idx = tabs.findIndex((el) => el.classList.contains('active'));
  const next = tabs[(idx + dir + tabs.length) % tabs.length];
  setActiveTab(root, next.dataset.tab);
  audioFocusIndex = 0;
  gridFocusIndex = 0;
  sectionIndex = 0;
  refreshAudioFocus();
  refreshGridFocus();
}

function refreshAudioFocus() {
  const rows = document.querySelectorAll('#menu .slider-row');
  rows.forEach((row, i) => row.classList.toggle('focused', navLevel === 'content' && i === audioFocusIndex));
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

  // Level 2: the item action popout, when open, owns the keyboard entirely.
  if (isPopoutOpen()) {
    const actions = popoutActionEls();
    if (key === 'Escape') { closeItemPopout(); return; }
    if (key === 'ArrowUp') { popoutActionIndex = (popoutActionIndex + actions.length - 1) % actions.length; refreshPopoutFocus(); return; }
    if (key === 'ArrowDown') { popoutActionIndex = (popoutActionIndex + 1) % actions.length; refreshPopoutFocus(); return; }
    if (key === ' ' || key === 'Enter') { runPopoutAction(actions[popoutActionIndex].dataset.action); return; }
    return;
  }

  const tab = currentTabName(root);

  // Level 1: inside the active tab's content.
  if (navLevel === 'content') {
    if (key === 'Escape') { setNavLevel(root, 'tabs'); return; }

    if (tab === 'audio') {
      if (key === 'ArrowUp') { audioFocusIndex = (audioFocusIndex + 1) % 2; refreshAudioFocus(); return; }
      if (key === 'ArrowDown') { audioFocusIndex = (audioFocusIndex + 1) % 2; refreshAudioFocus(); return; }
      if (key === 'ArrowLeft') { adjustAudioSlider(-1); return; }
      if (key === 'ArrowRight') { adjustAudioSlider(1); return; }
      return;
    }

    // Items has no equip-slots zone — its grid is always focused, same as
    // Magic's (Magic's 6 spell slots aren't wired to real state yet, so
    // there's nothing to zone-switch to there either; extend this once real
    // magic items/slots exist, matching the equipment/weapons branch below).
    if (tab === 'items' || tab === 'magic') {
      if (key === 'ArrowLeft') { moveGridFocus(-1); return; }
      if (key === 'ArrowRight') { moveGridFocus(1); return; }
      if (key === ' ' || key === 'Enter') {
        const els = currentGridEls(tab);
        if (!els.length) return;
        const t = els[gridFocusIndex];
        openItemPopout(t.dataset.itemId, t);
      }
      return;
    }

    // Equipment/Weapons (2026-07-09 rework): a stack of subcategory sections
    // (Head/Clothing/Feet/Hands, or Main Hand/Off Hand), each its own item
    // grid. Up/Down switch which section has focus; Left/Right walk that
    // section's grid; Space opens the action popout for the focused tile
    // (Equip/Unequip is its primary action for gear — see primaryActionFor).
    if (tab === 'equipment' || tab === 'weapons') {
      const sectionCount = Math.max(document.querySelectorAll(`#${tab}-sections .item-grid`).length, 1);
      if (key === 'ArrowUp') { sectionIndex = (sectionIndex - 1 + sectionCount) % sectionCount; gridFocusIndex = 0; refreshGridFocus(); return; }
      if (key === 'ArrowDown') { sectionIndex = (sectionIndex + 1) % sectionCount; gridFocusIndex = 0; refreshGridFocus(); return; }
      if (key === 'ArrowLeft') { moveGridFocus(-1); return; }
      if (key === 'ArrowRight') { moveGridFocus(1); return; }
      if (key === ' ' || key === 'Enter') {
        const els = currentGridEls(tab);
        if (!els.length) return;
        const t = els[gridFocusIndex];
        openItemPopout(t.dataset.itemId, t);
      }
      return;
    }

    // Stats/Quests have no interactive content yet — nothing to move focus
    // between, just wait for Escape.
    return;
  }

  // Level 0: the tab list.
  if (key === 'Escape') { closeAllPanels(); return; }
  if (key === 'ArrowUp') { cycleTab(root, -1); return; }
  if (key === 'ArrowDown') { cycleTab(root, 1); return; }
  if (key === ' ' || key === 'Enter') { setNavLevel(root, 'content'); return; }
}

// ---- Inventory tabs (Equipment / Weapons / Magic / Items, 2026-07-09) ----
// Every owned item belongs to exactly one of these four categories (derived
// from its catalog `slot` via items.js's categoryFor()) and only ever
// renders in that one tab's grid — an equippable item like the dagger does
// NOT also show up in Items. Equipment/Weapons additionally break their
// items down into per-slot sections (Head, Clothing, Main Hand, ... — see
// renderCategoryTab, below); Magic/Items have one flat grid each. Tile
// layout within any one grid is a flattened, row-major list (not true 2D
// nav) so Left/Right can walk it without conflicting with Up/Down's
// tab-cycling (Level 0) / section-switching (Level 1) role.

// Magic/Items each have one flat grid with a fixed id; Equipment/Weapons
// instead have N per-slot grids built dynamically into their #<tab>-sections
// container (see renderCategoryTab), so they're looked up by DOM position
// (sectionIndex) rather than a fixed id — see activeGridEl().
const CATEGORY_GRID_ID = { magic: 'magic-items-grid', items: 'items-grid' };

let gridFocusIndex = 0;
let sectionIndex = 0; // which subcategory section has focus, Equipment/Weapons only
let itemsHandlers = null; // { onAction(itemId, action) }, set via initItemsPanel
let popoutActionIndex = 0;

function activeGridEl(tab) {
  if (tab === 'equipment' || tab === 'weapons') {
    const grids = Array.from(document.querySelectorAll(`#${tab}-sections .item-grid`));
    return grids[Math.min(sectionIndex, grids.length - 1)] || null;
  }
  return $(CATEGORY_GRID_ID[tab]) || null;
}

function currentGridEls(tab) {
  const grid = activeGridEl(tab);
  return grid ? Array.from(grid.querySelectorAll('.item-tile')) : [];
}

function moveGridFocus(dir) {
  const tab = currentTabName($(activePanelName()));
  const els = currentGridEls(tab);
  if (!els.length) return;
  gridFocusIndex = (gridFocusIndex + dir + els.length) % els.length;
  refreshGridFocus();
}

// Clears focus across every tile in the tab (all sections, for Equipment/
// Weapons — only one section is ever focused at a time) then marks the
// currently-focused one, if the panel is at Level 1 content.
function refreshGridFocus() {
  const name = activePanelName();
  if (!name) return;
  const tab = currentTabName($(name));
  const allSelector = (tab === 'equipment' || tab === 'weapons')
    ? `#${tab}-sections .item-tile`
    : `#${CATEGORY_GRID_ID[tab]} .item-tile`;
  document.querySelectorAll(allSelector).forEach((el) => el.classList.remove('focused'));
  if (navLevel !== 'content') return;
  const els = currentGridEls(tab);
  els.forEach((el, i) => el.classList.toggle('focused', i === gridFocusIndex));
}

// Renders the whole Inventory panel — Equipment/Weapons as per-slot
// subcategory sections, Magic/Items as one flat grid each — from inventory
// state + the item catalog. inventory: [{id, qty}], catalog:
// { id: {name, image, description, questItem, slot?, heal?, damage?,
// attackBonus?, defenseBonus?} }. equipment (2026-07-08): { slot: itemId |
// null } — used only to mark which tile is currently equipped (a gold-
// outlined frame + .equipped-badge) and to feed openItemPopout()'s
// Equip/Unequip toggle; still read straight off the tile's dataset, same as
// the existing quest flag, keeping this module presentation-only
// (categoryFor()/CATEGORY_SLOTS/statLineFor() are small pure functions,
// imported for their logic, not game data — same spirit).
export function updateItemsPanel(inventory, catalog, equipment = {}) {
  renderCategoryTab('equipment', inventory, catalog, equipment);
  renderCategoryTab('weapons', inventory, catalog, equipment);
  renderCategoryGrid('magic', inventory, catalog, equipment);
  renderCategoryGrid('items', inventory, catalog, equipment);
  const name = activePanelName();
  if (name) {
    const count = currentGridEls(currentTabName($(name))).length;
    if (count) gridFocusIndex = Math.min(gridFocusIndex, count - 1);
  }
  refreshGridFocus();
}

// Equipment/Weapons (2026-07-09 rework): one header+grid section per equip
// slot (items.js's CATEGORY_SLOTS), each listing every owned item for that
// slot — sections always render (even empty) so the tab's layout stays
// stable as items are gained/equipped.
function renderCategoryTab(tab, inventory, catalog, equipment) {
  const container = $(`${tab}-sections`);
  if (!container) return;
  container.innerHTML = '';

  (CATEGORY_SLOTS[tab] || []).forEach((slot) => {
    const section = document.createElement('div');
    section.className = 'category-section';

    const header = document.createElement('div');
    header.className = 'category-section-header';
    header.textContent = SLOT_LABEL[slot] || slot;
    section.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'item-grid';
    const entries = inventory.filter((entry) => catalog[entry.id]?.slot === slot);
    if (!entries.length) {
      const p = document.createElement('p');
      p.className = 'items-empty';
      p.textContent = 'Nothing here yet.';
      grid.appendChild(p);
    } else {
      entries.forEach((entry) => grid.appendChild(buildItemTile(entry, catalog[entry.id], equipment)));
    }
    section.appendChild(grid);
    container.appendChild(section);
  });
}

// Magic/Items: a single flat grid, unchanged in spirit from before the
// Equipment/Weapons rework — just filtered to that one category.
function renderCategoryGrid(category, inventory, catalog, equipment) {
  const grid = $(CATEGORY_GRID_ID[category]);
  if (!grid) return;
  grid.innerHTML = '';

  const entries = inventory.filter((entry) => {
    const def = catalog[entry.id];
    return def && categoryFor(def) === category;
  });

  if (!entries.length) {
    const p = document.createElement('p');
    p.className = 'items-empty';
    p.textContent = 'Nothing here yet.';
    grid.appendChild(p);
    return;
  }

  entries.forEach((entry) => grid.appendChild(buildItemTile(entry, catalog[entry.id], equipment)));
}

// Shared tile builder for every grid (Equipment/Weapons sections and the
// flat Magic/Items grids alike). Click support finds its own grid/section at
// click time (rather than being passed an index) so the same tile works
// whether it lives in a per-slot section or a flat grid.
function buildItemTile(entry, def, equipment) {
  const equipped = !!def.slot && equipment[def.slot] === entry.id;

  const tile = document.createElement('div');
  tile.className = 'item-tile';
  tile.dataset.itemId = entry.id;
  tile.dataset.itemName = def.name;
  tile.dataset.quest = def.questItem ? '1' : '';
  tile.dataset.slot = def.slot || '';
  tile.dataset.equipped = equipped ? '1' : '';
  // Consumables (def.heal) get a dedicated "Use" popout row — their primary
  // action is Equip/Unequip (battle Use slot, 2026-07-10), so out-of-battle
  // drinking needs its own entry. Same dataset-only pattern as quest/slot.
  tile.dataset.usable = def.heal ? '1' : '';
  tile.classList.toggle('equipped', equipped);

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
  } else if (equipped) {
    // Equipped gear gets the same corner-ribbon treatment as quest items,
    // but with a black checkmark instead of a star (2026-07-09, Danny's
    // mockup) — see .equipped-badge in style.css.
    const badge = document.createElement('div');
    badge.className = 'equipped-badge';
    frame.appendChild(badge);
  }

  const label = document.createElement('div');
  label.className = 'item-label';
  // The tile shows the item's *name* — kept consistent with how it's
  // named everywhere else (the received-item reveal, Inspect's description).
  label.textContent = def.name;
  if (entry.qty > 1) {
    const qty = document.createElement('span');
    qty.className = 'item-qty';
    qty.textContent = ` (${entry.qty})`;
    label.appendChild(qty);
  }

  tile.appendChild(frame);
  tile.appendChild(label);

  const stat = statLineFor(def);
  if (stat) {
    const statEl = document.createElement('div');
    statEl.className = 'item-stat';
    statEl.textContent = stat;
    tile.appendChild(statEl);
  }

  tile.addEventListener('click', () => {
    const grid = tile.closest('.item-grid');
    const tab = tile.closest('.tab-pane')?.dataset.pane;
    if (tab === 'equipment' || tab === 'weapons') {
      const grids = Array.from(document.querySelectorAll(`#${tab}-sections .item-grid`));
      sectionIndex = Math.max(0, grids.indexOf(grid));
    }
    const tiles = Array.from(grid.querySelectorAll('.item-tile'));
    gridFocusIndex = Math.max(0, tiles.indexOf(tile));
    // Clicking a tile is a mouse shortcut for "enter this tab's content,
    // then open its popout" in one step, so keep nav-level state in sync
    // for anyone mixing mouse and keyboard/controller input.
    setNavLevel($('inventory'), 'content');
    openItemPopout(entry.id, tile);
  });

  return tile;
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
  return $('item-popout').classList.contains('open');
}

function popoutActionEls() {
  return Array.from(document.querySelectorAll('#item-popout .popout-action')).filter(
    (el) => !el.classList.contains('disabled') && !el.classList.contains('hidden')
  );
}

function refreshPopoutFocus() {
  const enabled = popoutActionEls();
  document.querySelectorAll('#item-popout .popout-action').forEach((el) => el.classList.remove('focused'));
  enabled.forEach((el, i) => el.classList.toggle('focused', i === popoutActionIndex));
}

let popoutItemId = null;

// The popout's top button changes meaning per item (read straight off the
// tile's own dataset — set in updateItemsPanel() — so this module still
// never needs to import the item catalog): Equip/Unequip for gear
// (dataset.slot set), Use for potions... but ui.js can't tell "has a heal
// amount" from the tile alone, so a tile with no slot always gets a plain
// "Use" button — main.js's onItemAction() is what actually knows whether
// that does anything (heals, or the "nothing happens yet" stub).
function primaryActionFor(anchorEl) {
  const slot = anchorEl.dataset.slot;
  if (slot) return anchorEl.dataset.equipped === '1'
    ? { label: 'Unequip', action: 'unequip' }
    : { label: 'Equip', action: 'equip' };
  return { label: 'Use', action: 'use' };
}

function openItemPopout(itemId, anchorEl) {
  popoutItemId = itemId;
  popoutActionIndex = 0;
  // No title row (2026-07-09) — the item's name already shows on the tile
  // itself, directly above where the popout expands from.
  const primary = primaryActionFor(anchorEl);
  const primaryEl = $('popout-primary');
  primaryEl.textContent = primary.label;
  primaryEl.dataset.action = primary.action;
  // Consumables get a second "Use" row under Equip/Unequip (see index.html).
  $('popout-use').classList.toggle('hidden', anchorEl.dataset.usable !== '1');
  // An equipped item can't be removed out from under itself — unequip it
  // first, same spirit as the existing quest-item restriction below.
  document.querySelector('#item-popout .popout-action[data-action="remove"]')
    .classList.toggle('disabled', anchorEl.dataset.quest === '1' || anchorEl.dataset.equipped === '1');
  positionPopout(anchorEl);
  $('item-popout').classList.add('open');
  refreshPopoutFocus();
}

function closeItemPopout() {
  const el = $('item-popout');
  if (el) el.classList.remove('open');
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
// Width is matched to the tile itself (2026-07-09, was a fixed min-width) so
// the popout visually reads as that tile's own frame expanding downward,
// flush against its left/right edges, rather than a separate floating menu.
function positionPopout(anchorEl) {
  const stageRect = $('stage').getBoundingClientRect();
  const tileRect = anchorEl.getBoundingClientRect();
  const scale = stageRect.width / 1920;
  const x = (tileRect.left - stageRect.left) / scale;
  const y = (tileRect.bottom - stageRect.top) / scale;
  const width = tileRect.width / scale;
  const popout = $('item-popout');
  popout.style.left = `${x}px`;
  popout.style.top = `${y}px`;
  popout.style.width = `${width}px`;
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

// ---- Quests tab (Menu) ----
// Read-only list — no Level 1 interactive content, so panelKey()'s "no
// interactive rows yet" fallthrough already covers keyboard nav here.

function renderQuestRow(quest, def) {
  const row = document.createElement('div');
  row.className = 'quest-row';

  const text = document.createElement('div');
  text.className = 'quest-text';
  const name = document.createElement('div');
  name.className = 'quest-name';
  name.textContent = def.name;
  const desc = document.createElement('div');
  desc.className = 'quest-desc';
  desc.textContent = def.description;
  text.append(name, desc);

  const icon = document.createElement('span');
  icon.className = 'quest-icon';
  if (quest.status === 'completed') { icon.classList.add('done'); icon.textContent = '✓'; }
  else if (quest.status === 'failed') { icon.classList.add('failed'); icon.textContent = '✕'; }

  row.append(text, icon);
  return row;
}

// quests: [{id, status}], catalog: { id: {name, description} } — see
// js/data/quests.js. Active quests list first; completed/failed quests sink
// below a "Completed" subhead (failed ones marked with a red X instead of a
// green check, but still grouped there per Danny's spec).
export function updateQuestsPanel(quests, catalog) {
  const list = $('quest-list');
  list.innerHTML = '';

  if (!quests.length) {
    const p = document.createElement('p');
    p.className = 'quests-empty';
    p.textContent = 'No quests yet.';
    list.appendChild(p);
    return;
  }

  const active = quests.filter((q) => q.status === 'active');
  const resolved = quests.filter((q) => q.status === 'completed' || q.status === 'failed');

  active.forEach((q) => {
    const def = catalog[q.id];
    if (def) list.appendChild(renderQuestRow(q, def));
  });

  if (resolved.length) {
    const heading = document.createElement('div');
    heading.className = 'section-subhead';
    heading.textContent = 'Completed';
    list.appendChild(heading);
    resolved.forEach((q) => {
      const def = catalog[q.id];
      if (def) list.appendChild(renderQuestRow(q, def));
    });
  }
}

export function initPanels(audio) {
  ['menu', 'inventory'].forEach((name) => {
    const root = $(name);
    root.querySelectorAll('.panel-tab').forEach((tabEl) => {
      // A mouse click on a tab is a shortcut for "select this tab, back at
      // the tab list" (Level 0) — the slider/item content underneath still
      // works by direct click/drag regardless of nav level, so clicking a
      // tab doesn't need to also "enter" it the way Space does.
      tabEl.addEventListener('click', () => {
        setActiveTab(root, tabEl.dataset.tab);
        audioFocusIndex = 0;
        gridFocusIndex = 0;
        sectionIndex = 0;
        setNavLevel(root, 'tabs');
      });
    });
    // Clicking the dark backdrop (outside the panel box) closes it too —
    // there's no close button (I/M toggle, or Escape, close it instead, so
    // the panel stays fully controller/keyboard-navigable).
    root.addEventListener('click', (e) => { if (e.target === root) closePanel(name); });
  });

  $('btn-menu').addEventListener('click', toggleMenu);
  $('btn-inventory').addEventListener('click', toggleInventory);

  initSlider('music', audio.getMusicVolume(), audio.setMusicVolume);
  initSlider('sfx', audio.getSfxVolume(), audio.setSfxVolume);
}

// ---- Battle (2026-07-08, action row reworked to slot-based 2026-07-09) ----
// Turn-based combat overlay — main.js owns the actual fight (whose turn,
// hit/miss/damage via js/battle.js's dice), this module only renders it and
// reports back which action/target the player picked. The action row is the
// mockup's five labeled diamond slots — Main Hand / Off Hand / Magic / Use /
// Flee — each showing the equipped item's art + a sub-label, all filled per
// player turn by showBattleActions(). `mode` gates battleKey() so key
// mashing during an enemy's turn (nothing to respond to) or before the
// first turn is a no-op:
//   'idle'   nothing to do — waiting on an enemy turn (see main.js's
//            runQueue/ENEMY_TURN_DELAY_MS pacing).
//   'action' the action row has focus. Space reports the selected slot's
//            data-action through handlers.onAction(action).
//   'target' Main/Off Hand was chosen — Left/Right cycle alive enemies,
//            Space confirms (handlers.onConfirmTarget), Escape cancels back
//            to 'action' without spending the turn.
const battleUiState = {
  open: false,
  mode: 'idle',
  handlers: null, // { onAction(action), onConfirmTarget(enemy) }
  enemies: [], // live object refs shared with main.js's battleState.enemies — health mutates in place, so re-rendering always reflects the current fight
  enemySlots: [], // [{ el, enemy }], in render order — rebuilt each renderBattleEnemies() call
  actionIndex: 0,
  targetIndex: 0,
};

export function isBattleOpen() { return battleUiState.open; }

export function openBattle({ enemies, onAction, onConfirmTarget }) {
  battleUiState.open = true;
  battleUiState.mode = 'idle';
  battleUiState.handlers = { onAction, onConfirmTarget };
  battleUiState.actionIndex = 0;
  renderBattleEnemies(enemies);
  $('battle').classList.remove('hidden');
}

export function closeBattle() {
  battleUiState.open = false;
  battleUiState.mode = 'idle';
  battleUiState.handlers = null;
  $('battle').classList.add('hidden');
}

// Status line with auto-colored damage numbers (per the mockup: "+1 damage
// done" green, "−2 damage taken" red): any +N / −N / -N token in the text is
// wrapped in a .dmg-pos/.dmg-neg span. Built with DOM nodes, not innerHTML,
// so message text can never inject markup.
export function setBattleMessage(text) {
  const el = $('battle-message');
  el.textContent = '';
  String(text).split(/([+−-]\d+)/g).forEach((part) => {
    if (/^\+\d+$/.test(part)) {
      const span = document.createElement('span');
      span.className = 'dmg-pos';
      span.textContent = part;
      el.appendChild(span);
    } else if (/^[−-]\d+$/.test(part)) {
      const span = document.createElement('span');
      span.className = 'dmg-neg';
      span.textContent = part;
      el.appendChild(span);
    } else if (part) {
      el.appendChild(document.createTextNode(part));
    }
  });
}

// Rebuilds the enemy row from scratch every call (health, defeated state,
// and — if we're mid target-select — which one's highlighted all change
// together). Cheap enough at 1-4 enemies to not bother diffing. Structure
// per slot (matched to the mockup): a cropping window the portrait fills
// top-anchored (big art, cropped at the bottom), the health bar overlapping
// the portrait's bottom edge, and the name centered below.
export function renderBattleEnemies(enemies) {
  battleUiState.enemies = enemies;
  const box = $('battle-enemies');
  box.innerHTML = '';
  battleUiState.enemySlots = enemies.map((enemy) => {
    const defeated = enemy.health <= 0;
    const slot = document.createElement('div');
    slot.className = 'enemy-slot' + (defeated ? ' defeated' : '');

    const windowEl = document.createElement('div');
    windowEl.className = 'enemy-portrait-window';
    const portrait = document.createElement('img');
    portrait.className = 'enemy-portrait';
    portrait.src = enemy.portrait;
    portrait.alt = enemy.name;
    windowEl.appendChild(portrait);

    const bar = document.createElement('div');
    bar.className = 'bar enemy-health-bar';
    const bg = document.createElement('div');
    bg.className = 'bar-bg';
    const fill = document.createElement('div');
    fill.className = 'bar-fill health';
    fill.style.width = `${Math.max(0, (enemy.health / enemy.maxHealth) * 100)}%`;
    bg.appendChild(fill);
    bar.appendChild(bg);
    const hpText = document.createElement('span');
    hpText.className = 'enemy-health-value';
    hpText.textContent = `${Math.max(0, enemy.health)}/${enemy.maxHealth}`;
    bar.appendChild(hpText);

    const name = document.createElement('span');
    name.className = 'enemy-name';
    name.textContent = defeated ? `${enemy.name} (defeated)` : enemy.name;

    slot.append(windowEl, bar, name);
    box.appendChild(slot);
    return { el: slot, enemy };
  });
  refreshTargetFocus();
}

function aliveSlots() {
  return battleUiState.enemySlots.filter((s) => s.enemy.health > 0);
}

function actionEls() {
  return Array.from($('battle-actions').querySelectorAll('.battle-action'));
}

function refreshActionFocus() {
  actionEls().forEach((el, i) => el.classList.toggle('focused', battleUiState.mode === 'action' && i === battleUiState.actionIndex));
}

function refreshTargetFocus() {
  battleUiState.enemySlots.forEach((s) => s.el.classList.remove('targeted'));
  if (battleUiState.mode !== 'target') return;
  const alive = aliveSlots();
  const s = alive[battleUiState.targetIndex];
  if (s) s.el.classList.add('targeted');
}

// Called by main.js's runQueue() whenever it's actually the player's turn —
// fills every action slot (item art in the diamond, sub-label under it,
// disabled state) and hands the action row keyboard focus. `slots` is keyed
// by data-action: { mainhand: {sub, image}, offhand: {sub, image, disabled},
// magic: {sub}, use: {sub, image, disabled}, flee: {sub} } — any field
// omitted clears/enables that part.
export function showBattleActions(slots) {
  battleUiState.mode = 'action';
  battleUiState.actionIndex = 0; // Main Hand — never disabled (unarmed still works)
  actionEls().forEach((el) => {
    const cfg = slots[el.dataset.action] || {};
    el.classList.toggle('disabled', !!cfg.disabled);
    el.querySelector('.battle-action-sub').textContent = cfg.sub || ' ';
    const img = el.querySelector('.battle-action-img');
    if (cfg.image) {
      img.src = cfg.image;
      img.classList.remove('hidden');
    } else {
      img.classList.add('hidden');
      img.removeAttribute('src');
    }
  });
  refreshActionFocus();
}

// A weapon slot was chosen — hand focus to the enemy row. Reads its own
// alive list off battleUiState.enemies (not an argument) so it can't go
// stale relative to what's actually rendered. Returns false if there's no
// one to target (callers must then re-show the action menu themselves —
// same "no action left without a live keyboard handler" rule as
// showPlayerActions in main.js).
export function startTargeting() {
  if (!aliveSlots().length) return false;
  battleUiState.mode = 'target';
  battleUiState.targetIndex = 0;
  refreshTargetFocus();
  refreshActionFocus(); // clears the action row's highlight while targeting
  return true;
}

// Left/Right skip disabled action slots (an empty Off Hand, Use with no
// potions) so keyboard focus can never land on one; Flee is never disabled,
// so this can't spin forever.
function cycleAction(dir) {
  const els = actionEls();
  let i = battleUiState.actionIndex;
  for (let n = 0; n < els.length; n += 1) {
    i = (i + dir + els.length) % els.length;
    if (!els[i].classList.contains('disabled')) break;
  }
  battleUiState.actionIndex = i;
  refreshActionFocus();
}

export function battleKey(key) {
  if (!battleUiState.open) return;
  const h = battleUiState.handlers;

  if (battleUiState.mode === 'target') {
    const alive = aliveSlots();
    if (key === 'Escape') { battleUiState.mode = 'action'; refreshTargetFocus(); refreshActionFocus(); return; }
    if (key === 'ArrowLeft') { battleUiState.targetIndex = (battleUiState.targetIndex - 1 + alive.length) % alive.length; refreshTargetFocus(); return; }
    if (key === 'ArrowRight') { battleUiState.targetIndex = (battleUiState.targetIndex + 1) % alive.length; refreshTargetFocus(); return; }
    if (key === ' ' || key === 'Enter') {
      const target = alive[battleUiState.targetIndex]?.enemy;
      if (!target) return;
      battleUiState.mode = 'idle';
      refreshTargetFocus();
      h?.onConfirmTarget?.(target);
    }
    return;
  }

  if (battleUiState.mode !== 'action') return; // an enemy turn is resolving — nothing to do yet
  if (key === 'ArrowLeft') { cycleAction(-1); return; }
  if (key === 'ArrowRight') { cycleAction(1); return; }
  if (key === ' ' || key === 'Enter') {
    const el = actionEls()[battleUiState.actionIndex];
    if (!el || el.classList.contains('disabled')) return;
    battleUiState.mode = 'idle';
    refreshActionFocus();
    h?.onAction?.(el.dataset.action);
  }
}

// Mouse support for the action row + enemy targeting, mirroring how the
// dialog responses and item tiles work (click, or hover to move keyboard
// focus without selecting). Action slots are static HTML so this only
// needs to run once; enemy slots are rebuilt every renderBattleEnemies()
// call, so their clicks are handled via delegation on the container instead.
export function initBattle() {
  actionEls().forEach((el, i) => {
    el.addEventListener('click', () => {
      if (battleUiState.mode !== 'action' || el.classList.contains('disabled')) return;
      battleUiState.actionIndex = i;
      battleKey(' ');
    });
    el.addEventListener('mouseenter', () => {
      if (battleUiState.mode !== 'action' || el.classList.contains('disabled')) return;
      battleUiState.actionIndex = i;
      refreshActionFocus();
    });
  });
  $('battle-enemies').addEventListener('click', (e) => {
    if (battleUiState.mode !== 'target') return;
    const slotEl = e.target.closest('.enemy-slot');
    const idx = slotEl ? aliveSlots().findIndex((s) => s.el === slotEl) : -1;
    if (idx === -1) return;
    battleUiState.targetIndex = idx;
    battleKey(' ');
  });
}

// ---- Game Over ----
// Shown when the player's health hits 0 in battle (main.js's endBattle()).
// The only way out is Try Again — no Escape/backdrop-click dismissal, since
// there's nothing to "cancel" back to.

let gameOverHandlers = null;

export function isGameOverOpen() {
  return !$('game-over').classList.contains('hidden');
}

export function showGameOver() {
  $('game-over').classList.remove('hidden');
}

export function hideGameOver() {
  $('game-over').classList.add('hidden');
}

export function initGameOver(handlers) {
  gameOverHandlers = handlers;
  $('btn-try-again').addEventListener('click', () => gameOverHandlers?.onRestart?.());
}
