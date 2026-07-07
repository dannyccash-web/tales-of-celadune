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

export function updateHud(stats) {
  $('health-fill').style.width = `${(stats.health / stats.healthMax) * 100}%`;
  $('health-value').textContent = `${stats.health}/${stats.healthMax}`;
  $('magic-fill').style.width = `${(stats.magic / stats.magicMax) * 100}%`;
  $('magic-value').textContent = `${stats.magic}/${stats.magicMax}`;
  $('gold-value').textContent = stats.gold.toLocaleString();
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

export function openDialog(npc, onClose) {
  dialogState.open = true;
  dialogState.selected = 0;
  dialogState.npc = npc;
  dialogState.onClose = onClose || null;

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

  const box = $('dialog-responses');
  box.innerHTML = '';
  npc.dialog.responses.forEach((text, i) => {
    const el = document.createElement('span');
    el.className = 'response';
    el.textContent = text;
    el.addEventListener('click', () => { dialogState.selected = i; chooseResponse(); });
    el.addEventListener('mouseenter', () => { dialogState.selected = i; refreshSelection(); });
    box.appendChild(el);
  });

  $('dialog').classList.remove('hidden');
  refreshSelection();
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
  // Placeholder: every response just closes the dialog for now.
  closeDialog();
}

function closeDialog() {
  clearInterval(typeTimer);
  typeTimer = null;
  dialogState.typing = false;
  dialogState.open = false;
  $('dialog').classList.add('hidden');
  if (dialogState.onClose) dialogState.onClose();
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
}

function openPanel(name) {
  panelState[name] = true;
  $(name).classList.remove('hidden');
  if (name === 'menu') { audioFocusIndex = 0; refreshAudioFocus(); }
}

function closePanel(name) {
  panelState[name] = false;
  $(name).classList.add('hidden');
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

  if (key === 'Escape') { closeAllPanels(); return; }
  if (key === 'ArrowUp') { cycleTab(root, -1); return; }
  if (key === 'ArrowDown') { cycleTab(root, 1); return; }

  const onAudio = currentTabName(root) === 'audio';
  if (key === ' ' || key === 'Enter') {
    if (onAudio) { audioFocusIndex = (audioFocusIndex + 1) % 2; refreshAudioFocus(); }
    return;
  }
  if (key === 'ArrowLeft') { if (onAudio) adjustAudioSlider(-1); return; }
  if (key === 'ArrowRight') { if (onAudio) adjustAudioSlider(1); return; }
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
