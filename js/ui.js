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

export function initTopbarStubs() {
  $('btn-inventory').addEventListener('click', () => toast('Inventory — coming soon.'));
  $('btn-menu').addEventListener('click', () => toast('Menu — coming soon.'));
}
