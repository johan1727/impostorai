// patch-v2.cjs — Safe UTF-8 patch for main.js (applied on e340934 baseline)
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'main.js');
let c = fs.readFileSync(filePath, 'utf8');

let changes = 0;

// === FIX 1: setStatus() — remove references to statusBox/statusEl that don't exist in HTML ===
const oldSetStatus = [
    'function setStatus(text, type = "success") {',
    '  statusBox.classList.remove("hidden", "error", "loading", "success");',
    '  statusBox.classList.add(type === "error" ? "error" : type === "loading" ? "loading" : "success");',
    '  statusEl.textContent = text;',
    '  showToast(text, type);',
    '}'
].join('\r\n');
const newSetStatus = [
    'function setStatus(text, type = "success") {',
    '  showToast(text, type);',
    '}'
].join('\r\n');
if (c.includes(oldSetStatus)) { c = c.replace(oldSetStatus, newSetStatus); changes++; console.log('FIX 1: setStatus patched'); }
else console.warn('FIX 1: setStatus target not found');

// === FIX 2: clearStatsBtn — replace native confirm() with showConfirmModal() ===
const oldConfirm = 'if (confirm("\\u00bfBorrar todo el historial?")) {';
const newConfirm = 'showConfirmModal("\\u00bfBorrar todo el historial?", () => {';
if (c.includes(oldConfirm)) {
    c = c.replace(oldConfirm, newConfirm);
    // Also fix the closing brace: change `}` to `});`
    // The pattern is: showToast("Historial borrado");\r\n    }\r\n  });\r\n}
    // We need to change `    }` (closing the if) to `    });` (closing the callback)
    c = c.replace(
        'showToast("Historial borrado");\r\n    }\r\n  });\r\n}',
        'showToast("Historial borrado");\r\n    });\r\n  });\r\n}'
    );
    changes++;
    console.log('FIX 2: clearStatsBtn confirm patched');
} else console.warn('FIX 2: confirm target not found');

// === FIX 3: enterGameMode — hide nav bar ===
const oldEnterGame = [
    'function enterGameMode() {',
    '  appEl.classList.add("in-game");',
    '  gameScreen.classList.remove("hidden");',
    '  setGamePhase("reparto");',
    '}'
].join('\r\n');
const newEnterGame = [
    'function enterGameMode() {',
    '  appEl.classList.add("in-game");',
    '  gameScreen.classList.remove("hidden");',
    '  setGamePhase("reparto");',
    '  // Hide nav bar during gameplay',
    '  const topNav = document.querySelector(".app-header");',
    '  if (topNav) topNav.style.display = "none";',
    '}'
].join('\r\n');
if (c.includes(oldEnterGame)) { c = c.replace(oldEnterGame, newEnterGame); changes++; console.log('FIX 3: enterGameMode patched'); }
else console.warn('FIX 3: enterGameMode not found');

// === FIX 4: exitGameMode — restore nav bar ===
const oldExitGame = [
    'function exitGameMode() {',
    '  appEl.classList.remove("in-game");',
    '  gameScreen.classList.add("hidden");',
    '  dealSection.classList.add("hidden");',
    '  roundSection.classList.add("hidden");',
    '}'
].join('\r\n');
const newExitGame = [
    'function exitGameMode() {',
    '  appEl.classList.remove("in-game");',
    '  gameScreen.classList.add("hidden");',
    '  dealSection.classList.add("hidden");',
    '  roundSection.classList.add("hidden");',
    '  // Restore nav bar',
    '  const topNav = document.querySelector(".app-header");',
    '  if (topNav) topNav.style.display = "";',
    '}'
].join('\r\n');
if (c.includes(oldExitGame)) { c = c.replace(oldExitGame, newExitGame); changes++; console.log('FIX 4: exitGameMode patched'); }
else console.warn('FIX 4: exitGameMode not found');

// === FIX 5: showMainView — call exitGameMode to prevent game overlay ===
const oldShowMain = 'function showMainView(view) {\r\n  menuSection.classList.toggle("hidden", view !== "home");';
const newShowMain = 'function showMainView(view) {\r\n  exitGameMode();\r\n  menuSection.classList.toggle("hidden", view !== "home");';
if (c.includes(oldShowMain)) { c = c.replace(oldShowMain, newShowMain); changes++; console.log('FIX 5: showMainView patched'); }
else console.warn('FIX 5: showMainView not found');

// === FIX 6: showCurrentPlayerPrompt — big name display ===
const oldPrompt = '  dealHint.textContent = `Pasa el celular a ${state.round.roles[state.revealIndex].name} (${cur} de ${tot}).`;';
const newPrompt = [
    '  const pName = escapeHtml(state.round.roles[state.revealIndex].name);',
    '  dealHint.innerHTML = `',
    '    <div style="font-size:2.5rem;margin-bottom:8px">\\ud83c\\udfaf</div>',
    '    <div style="font-size:1.1rem;color:var(--text2);margin-bottom:4px">Pasa el celular a</div>',
    '    <h2 style="font-size:2.2rem;margin:0;color:var(--accent);line-height:1.1">${pName}</h2>',
    '    <div style="font-size:0.95rem;color:var(--text2);margin-top:12px;font-weight:600">Jugador ${cur} de ${tot}</div>',
    '  `;'
].join('\r\n');
if (c.includes(oldPrompt)) { c = c.replace(oldPrompt, newPrompt); changes++; console.log('FIX 6: handoff prompt patched'); }
else console.warn('FIX 6: handoff prompt not found');

// === FIX 7: renderRoleCard — improved role display ===
const oldRoleCard = [
    '  roleCard.innerHTML = `',
    '    <span class="role-emoji">${getRoleEmoji(item.role)}</span>',
    '    <h3 class="${roleClass}">${escapeHtml(item.name)} \\u00b7 ${escapeHtml(roleName)}</h3>',
    '    <p class="${wordClass}">${escapeHtml(item.word)}</p>',
    '    <p class="role-tip">${escapeHtml(item.tip)}</p>',
    '  `;'
].join('\r\n');
const newRoleCard = [
    '  roleCard.innerHTML = `',
    '    <span class="role-emoji" style="border-radius:50%;background:var(--surface);width:80px;height:80px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;box-shadow:0 4px 12px rgba(0,0,0,0.15)">${getRoleEmoji(item.role)}</span>',
    '    <h3 class="${roleClass}" style="opacity:0.9">Eres: ${escapeHtml(roleName)}</h3>',
    '    <p class="${wordClass}" style="font-size:2.2rem!important;margin:16px 0!important;font-weight:900!important;line-height:1.1">${escapeHtml(item.word)}</p>',
    '    <p class="role-tip" style="background:rgba(0,0,0,0.2);padding:12px;border-radius:8px;margin-top:16px;border:1px solid rgba(255,255,255,0.05)">${escapeHtml(item.tip)}</p>',
    '  `;'
].join('\r\n');
if (c.includes(oldRoleCard)) { c = c.replace(oldRoleCard, newRoleCard); changes++; console.log('FIX 7: roleCard patched'); }
else console.warn('FIX 7: roleCard not found');

// === FIX 8: revealFinal — show impostor names in banner ===
const oldCivilsWin = '    const civilsWin = votedRole?.role === "impostor";\r\n\r\n    let banner = "";';
const newCivilsWin = [
    '    const civilsWin = votedRole?.role === "impostor";',
    '',
    '    // Compute impostor names for display',
    '    const allImpostors = (state.round.allRoles || state.round.roles)',
    '      .filter(r => r.role === "impostor")',
    '      .map(r => r.name);',
    '    const impStr = allImpostors.map(n => `<strong style="color:var(--accent)">${escapeHtml(n)}</strong>`).join(" y ");',
    '',
    '    let banner = "";'
].join('\r\n');
if (c.includes(oldCivilsWin)) { c = c.replace(oldCivilsWin, newCivilsWin); changes++; console.log('FIX 8: revealFinal impostor names patched'); }
else console.warn('FIX 8: revealFinal target not found');

// Update the banner texts to include impostor names
const banners = [
    { old: 'Descubrieron al impostor.</div>`', new_: 'Descubrieron al impostor.<br><small>\\ud83d\\udd75\\ufe0f Impostores: ${impStr}</small></div>`' },
    { old: 'Los civiles fallaron.</div>`', new_: 'Los civiles fallaron.<br><small>\\ud83d\\udd75\\ufe0f Impostores: ${impStr}</small></div>`' }
];
for (const b of banners) {
    if (c.includes(b.old)) { c = c.replace(b.old, b.new_); changes++; }
}

// === FIX 9: Show +18 and Peda always in category filter ===
const oldFilter = 'const visible = themes.filter(t => !t.adult || state.includeAdultTheme);';
const newFilter = 'const visible = themes; // Always show +18 and Peda in the grid';
if (c.includes(oldFilter)) { c = c.replace(oldFilter, newFilter); changes++; console.log('FIX 9: +18 always visible'); }
else console.warn('FIX 9: theme filter not found');

// Auto-enable adult toggle when selecting adult category
const oldThemeClick = '      state.selectedTheme = t.key;\r\n      SFX.click();';
const newThemeClick = [
    '      state.selectedTheme = t.key;',
    '      if (t.adult) {',
    '        state.includeAdultTheme = true;',
    '        const adultToggle = document.getElementById("adultThemesToggle");',
    '        if (adultToggle) adultToggle.checked = true;',
    '      }',
    '      SFX.click();'
].join('\r\n');
if (c.includes(oldThemeClick)) { c = c.replace(oldThemeClick, newThemeClick); changes++; console.log('FIX 9b: auto-enable adult toggle patched'); }
else console.warn('FIX 9b: theme click not found');

// === FIX 10: null-check resetBtn, menuHowToBtn, toggleNamesBtn, menuHomeBtn, menuPlayBtn ===
const nullCheckIds = ['resetBtn', 'menuHowToBtn', 'toggleNamesBtn', 'menuHomeBtn', 'menuPlayBtn'];
for (const id of nullCheckIds) {
    const pattern = `${id}.addEventListener`;
    if (c.includes(pattern)) {
        // Wrap in if check
        c = c.replace(
            new RegExp(`^(${id}\\.addEventListener)`, 'gm'),
            `if (${id}) ${id}.addEventListener`
        );
        changes++;
        console.log(`FIX 10: null-check added for ${id}`);
    }
}

// Write it back
fs.writeFileSync(filePath, c, 'utf8');
console.log(`\nDone! Applied ${changes} patches.`);
