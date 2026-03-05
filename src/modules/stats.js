import { escapeHtml, showToast, showConfirmModal } from "./ui.js";

const STATS_KEY = "impostorStatsV1";
const CUSTOM_PACKS_KEY = "impostorCustomPacksV1";

// ============= STATS / HISTORY =============
export function loadStats() {
    try { return JSON.parse(localStorage.getItem(STATS_KEY)) || { gamesPlayed: 0, rounds: [] }; }
    catch { return { gamesPlayed: 0, rounds: [] }; }
}
export function saveStats(s) { try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch { } }

export function recordRound(round) {
    const s = loadStats();
    s.gamesPlayed += 1;
    s.rounds.push({
        date: new Date().toISOString(),
        theme: round.theme,
        playerCount: (round.allRoles || round.roles).length,
        impostors: (round.allRoles || round.roles).filter(r => r.role === "impostor").map(r => r.name),
        secretWord: round.secretWord,
        decoyWord: round.decoyWord,
        source: round.source
    });
    if (s.rounds.length > 50) s.rounds = s.rounds.slice(-50);
    saveStats(s);
}

export function renderStats(themesList) {
    const el = document.getElementById("statsContent");
    if (!el) return;
    const s = loadStats();
    if (s.gamesPlayed === 0) {
        el.innerHTML = '<p class="help-text" style="text-align:center;padding:20px">🎮 Aún no hay partidas. ¡Juega tu primera ronda!</p>';
        return;
    }
    const tc = {};
    for (const r of s.rounds) tc[r.theme] = (tc[r.theme] || 0) + 1;
    const topCategories = Object.entries(tc).sort((a, b) => b[1] - a[1]);
    const top = topCategories.length > 0 ? topCategories[0] : null;
    const topLabel = top ? (themesList.find(t => t.key === top[0])?.label || top[0]) : "N/A";
    const avg = Math.round(s.rounds.reduce((a, r) => a + r.playerCount, 0) / Math.max(1, s.rounds.length));
    const recent = s.rounds.slice(-5).reverse();
    el.innerHTML = `
    <div class="stats-summary">
      <div class="stat-box"><strong>${s.gamesPlayed}</strong><br>Partidas Top</div>
      <div class="stat-box"><strong>${avg}</strong><br>Jugadores (Prom)</div>
      <div class="stat-box"><strong>${escapeHtml(topLabel)}</strong><br>Tema favorito</div>
    </div>
    <h3 style="margin-top:20px">Últimas 5 partidas:</h3>
    <ul class="stats-list">
      ${recent.map(r => `
        <li>
          <div class="stat-list-head">Tema: ${escapeHtml(r.theme)} <span>${new Date(r.date).toLocaleDateString()}</span></div>
          <div class="stat-list-body">
            Jugadores: ${r.playerCount} | Impostores: ${r.impostors.join(", ") || "N/A"}<br>
            <small style="opacity:0.7">Civil: ${escapeHtml(r.secretWord)} | Impostor: ${escapeHtml(r.decoyWord)}</small>
          </div>
        </li>
      `).join("")}
    </ul>
    <button class="btn-danger p-2 rounded w-full font-bold mt-4 reset-stats-btn" style="padding:10px; border-radius:12px; border:none; color:white; font-size:1rem; cursor:pointer;" id="deleteStatsBtn">
      🗑️ Borrar Historial
    </button>
  `;

    document.getElementById("deleteStatsBtn").addEventListener("click", () => {
        showConfirmModal("¿Seguro que quieres borrar el historial de puntajes?", () => {
            saveStats({ gamesPlayed: 0, rounds: [] });
            renderStats(themesList);
            showToast("Historial borrado");
        });
    });
}

// ============= CUSTOM PACKS =============
export function loadCustomPacks() {
    try { return JSON.parse(localStorage.getItem(CUSTOM_PACKS_KEY)) || []; } catch { return []; }
}
function saveCustomPacks(p) {
    try { localStorage.setItem(CUSTOM_PACKS_KEY, JSON.stringify(p)); } catch { }
}
export function unregisterCustomPack(i, themesList, localWords, SFX, renderThemeChipsCb) {
    showConfirmModal("¿Seguro que quieres borrar este pack personalizado?", () => {
        const p = loadCustomPacks();
        p.splice(i, 1);
        saveCustomPacks(p);
        refreshCustomThemes(themesList, localWords);
        renderThemeChipsCb();
        renderCustomPacks(themesList, localWords, SFX, renderThemeChipsCb);
        showToast("Pack personalizado borrado");
    }, SFX);
}

export function refreshCustomThemes(themesList, localWords) {
    const defaultThemesCount = 14;
    while (themesList.length > defaultThemesCount) themesList.pop();
    for (const k of Object.keys(localWords)) { if (k.startsWith("custom_")) delete localWords[k]; }
    const packs = loadCustomPacks();
    for (let i = 0; i < packs.length; i++) {
        const pk = "custom_" + i;
        themesList.push({ key: pk, label: packs[i].name });
        localWords[pk] = packs[i].pairs;
    }
}

export function renderCustomPacks(themesList, localWords, SFX, renderThemeChipsCb) {
    const el = document.getElementById("customPacksList");
    if (!el) return;
    const p = loadCustomPacks();
    if (p.length === 0) { el.innerHTML = '<p class="help-text">No hay packs aún.</p>'; return; }
    el.innerHTML = p.map((pack, i) => `
    <div class="custom-pack-item" style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; margin-bottom:10px;">
      <div><strong>${escapeHtml(pack.name)}</strong><br><small>${pack.pairs.length} pares</small></div>
      <button class="secondary" data-del="${i}" style="padding:6px 12px">🗑️</button>
    </div>
  `).join("");
    el.querySelectorAll("button[data-del]").forEach(b => {
        b.addEventListener("click", () => unregisterCustomPack(b.dataset.del, themesList, localWords, SFX, renderThemeChipsCb));
    });
}

export function initCustomPacksForm(themesList, localWords, SFX, renderThemeChipsCb) {
    const customPacksPanel = document.getElementById("customPacksPanel");
    const toggleCustomPacksBtn = document.getElementById("toggleCustomPacksBtn");
    const addCustomPackBtn = document.getElementById("addCustomPackBtn");

    if (toggleCustomPacksBtn) {
        toggleCustomPacksBtn.addEventListener("click", () => {
            customPacksPanel.classList.toggle("hidden");
            renderCustomPacks(themesList, localWords, SFX, renderThemeChipsCb);
        });
    }

    if (addCustomPackBtn) {
        addCustomPackBtn.addEventListener("click", () => {
            const n = document.getElementById("customPackName").value.trim();
            const raw = document.getElementById("customPackWords").value.trim();
            if (!n || !raw) return showToast("Llena el nombre y pon palabras.", "error");
            const ps = raw.split("\n").map(l => l.split(",").map(w => w.trim()).filter(Boolean)).filter(p => p.length > 1);
            if (ps.length < 5) return showToast("Ingresa al menos 5 pares válidos (palabra1, palabra2)", "error");
            const allPacks = loadCustomPacks();
            if (allPacks.length >= 10) return showToast("Máximo 10 packs.", "error");
            allPacks.push({ name: n, pairs: ps.slice(0, 100) });
            saveCustomPacks(allPacks);
            refreshCustomThemes(themesList, localWords);
            document.getElementById("customPackName").value = "";
            document.getElementById("customPackWords").value = "";
            renderCustomPacks(themesList, localWords, SFX, renderThemeChipsCb);
            renderThemeChipsCb();
            showToast("Pack de palabras creado con éxito. ¡Selecciónalo arriba!");
        });
    }
}
