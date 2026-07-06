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

const dialogState = { open: false, selected: 0, npc: null, onClose: null };

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
  $('dialog-line').textContent = npc.dialog.line;
  $('dialog-portrait').src = npc.portrait;

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
  if (key === ' ' || key === 'Enter') chooseResponse();
  if (key === 'Escape') closeDialog();
}

function chooseResponse() {
  // Placeholder: every response just closes the dialog for now.
  closeDialog();
}

function closeDialog() {
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
