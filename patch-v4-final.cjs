// patch-v4-final.cjs
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'main.js');
let c = fs.readFileSync(filePath, 'utf8');

// 1. RE-DECLARAR REFERENCIAS DOM
console.log("Patching DOM references...");
const domRefsOld = `// ============= DOM REFS =============
const playersInput = document.getElementById("players");
const impostorsInput = document.getElementById("impostors");
const whitesInput = document.getElementById("whites");
const toggleAdvancedBtn = document.getElementById("toggleAdvancedBtn");
const advancedOptions = document.getElementById("advancedOptions");
const themeChips = document.getElementById("themeChips");
const adultThemesToggle = document.getElementById("adultThemesToggle");
const spanishOnlyToggle = document.getElementById("spanishOnlyToggle");
const statusBox = document.getElementById("statusBox");
const statusEl = document.getElementById("status");
const menuSection = document.getElementById("menuSection");
const controlsSection = document.getElementById("controlsSection");
const helpSection = document.getElementById("helpSection");
const statsSection = document.getElementById("statsSection");
const menuHomeBtn = document.getElementById("menuHomeBtn");
const menuPlayBtn = document.getElementById("menuPlayBtn");
const menuHelpBtn = document.getElementById("menuHelpBtn");
const menuStatsBtn = document.getElementById("menuStatsBtn");
const menuPedaBtn = document.getElementById("menuPedaBtn");
const menuStartBtn = document.getElementById("menuStartBtn");
const menuHowToBtn = document.getElementById("menuHowToBtn");
const toggleNamesBtn = document.getElementById("toggleNamesBtn");
const playerNamesContainer = document.getElementById("playerNamesContainer");
const sorteoSection = document.getElementById("sorteoSection");
const sorteoCards = document.getElementById("sorteoCards");
const gameScreen = document.getElementById("gameScreen");
const quitGameBtn = document.getElementById("quitGameBtn");
const gamePhaseLabel = document.getElementById("gamePhaseLabel");
const gameProgressBar = document.getElementById("gameProgressBar");
const dealCounter = document.getElementById("dealCounter");
const newRoundBtn = document.getElementById("newRoundBtn");
const backHomeBtn = document.getElementById("backHomeBtn");
const appEl = document.querySelector(".app");
const startBtn = document.getElementById("startBtn");`;

const domRefsNew = `// ============= DOM REFS =============
const playersInput = document.getElementById("players");
const impostorsInput = document.getElementById("impostors");
const whitesInput = document.getElementById("whites");
const toggleAdvancedBtn = document.getElementById("toggleAdvancedBtn");
const advancedOptions = document.getElementById("advancedOptions");
const themeChips = document.getElementById("themeChips");
const adultThemesToggle = document.getElementById("adultThemesToggle");
const spanishOnlyToggle = document.getElementById("spanishOnlyToggle");
const menuSection = document.getElementById("menuSection");
const controlsSection = document.getElementById("controlsSection");
const helpSection = document.getElementById("helpSection");
const statsSection = document.getElementById("statsSection");

// Screens
const categorySection = document.getElementById("categorySection");
const categoryGrid = document.getElementById("categoryGrid");
const sorteoSection = document.getElementById("sorteoSection");
const sorteoCards = document.getElementById("sorteoCards");
const gameScreen = document.getElementById("gameScreen");

// Buttons & Nav
const menuHomeBtn = document.getElementById("menuHomeBtn");
const menuPlayBtn = document.getElementById("menuPlayBtn");
const menuHelpBtn = document.getElementById("menuHelpBtn");
const menuStatsBtn = document.getElementById("menuStatsBtn");
const menuPedaBtn = document.getElementById("menuPedaBtn");
const menuStartBtn = document.getElementById("menuStartBtn");
const menuHowToBtn = document.getElementById("menuHowToBtn");
const toggleNamesBtn = document.getElementById("toggleNamesBtn");
const backFromCategoryBtn = document.getElementById("backFromCategoryBtn");
const backFromSetupBtn = document.getElementById("backFromSetupBtn");
const changeCategoryBtn = document.getElementById("changeCategoryBtn");
const addPlayerRowBtn = document.getElementById("addPlayerRowBtn");
const minusImpostorBtn = document.getElementById("minusImpostorBtn");
const plusImpostorBtn = document.getElementById("plusImpostorBtn");
const startGameBtn = document.getElementById("startGameBtn");
const quitGameBtn = document.getElementById("quitGameBtn");
const newRoundBtn = document.getElementById("newRoundBtn");
const backHomeBtn = document.getElementById("backHomeBtn");

// Displays
const playerNamesContainer = document.getElementById("playerNamesContainer");
const selectedCategoryName = document.getElementById("selectedCategoryName");
const impostorCountDisplay = document.getElementById("impostorCountDisplay");
const btnPlayersCount = document.getElementById("btnPlayersCount");
const gamePhaseLabel = document.getElementById("gamePhaseLabel");
const gameProgressBar = document.getElementById("gameProgressBar");
const dealCounter = document.getElementById("dealCounter");
const appEl = document.querySelector(".app");

// Compatibility mapping
const startBtn = startGameBtn;
const statusBox = { classList: { add: () => {}, remove: () => {} } };
const statusEl = { textContent: "" };`;

if (c.includes(domRefsOld)) {
    c = c.replace(domRefsOld, domRefsNew);
}

// 2. Add renderThemeChips
console.log("Adding renderThemeChips...");
const renderThemeChipsFunc = `
function renderThemeChips() {
  if (!categoryGrid) return;
  categoryGrid.innerHTML = "";

  const categoryStyles = {
    aleatorio: { color: "#ff7b54", icon: "🎲" },
    comida: { color: "#00e676", icon: "🍔" },
    lugares: { color: "#e040fb", icon: "📍" },
    objetos: { color: "#4dabf7", icon: "🔧" },
    tecnologia: { color: "#26c6da", icon: "💻" },
    deportes: { color: "#ffd600", icon: "⚽" },
    animales: { color: "#ff9100", icon: "🐱" },
    profesiones: { color: "#7c4dff", icon: "💼" },
    peliculas: { color: "#ff6b81", icon: "🎬" },
    musica: { color: "#ab47bc", icon: "🎵" },
    historia: { color: "#8d6e63", icon: "📜" },
    naturaleza: { color: "#66bb6a", icon: "🌿" },
    adulto: { color: "#ff4757", icon: "🔞" },
    peda: { color: "#feca57", icon: "🍻" },
    default: { color: "#c8b8d8", icon: "✨" }
  };

  const visible = themes;

  for (const t of visible) {
    const style = categoryStyles[t.key] || categoryStyles.default;
    const card = document.createElement("button");
    card.type = "button";
    card.className = "category-card";
    
    card.style.background = \`linear-gradient(135deg, \${style.color}, var(--bg))\`;
    card.innerHTML = \`
      <div class="category-card-icon">\${style.icon}</div>
      <div class="category-card-label">\${escapeHtml(t.label.replace(/🔥|🍻|🔞|📦|/g, '').trim())}</div>
    \`;

    card.addEventListener("click", () => {
      state.selectedTheme = t.key;
      if (t.adult) {
        state.includeAdultTheme = true;
        if (adultThemesToggle) adultThemesToggle.checked = true;
      }
      SFX.click();

      if (selectedCategoryName) {
        selectedCategoryName.textContent = \`\${style.icon} \${t.label.replace(/🔥|🍻|🔞|📦|/g, '').trim()}\`;
      }

      showMainView("play");
    });
    
    categoryGrid.appendChild(card);
  }
}`;
if (!c.includes("function renderThemeChips")) {
    c = c.replace("// ============= TIMER =============", renderThemeChipsFunc + "\n\n// ============= TIMER =============");
}

// 3. Update showMainView
console.log("Updating showMainView...");
const oldShowMain = `function showMainView(view) {
  exitGameMode();
  if (menuSection) menuSection.classList.toggle("hidden", view !== "home");
  if (categorySection) categorySection.classList.toggle("hidden", view !== "categories");
  if (controlsSection) controlsSection.classList.toggle("hidden", view !== "play" && view !== "peda");`;
c = c.replace(/function showMainView\(view\) \{\r?\n  exitGameMode\(\);\r?\n  menuSection\.classList\.toggle\("hidden", view !== "home"\);\r?\n  if \(categorySection\) categorySection\.classList\.toggle\("hidden", view !== "categories"\);\r?\n  controlsSection\.classList\.toggle\("hidden", view !== "play" && view !== "peda"\);/, oldShowMain); // reset if needed
c = c.replace(oldShowMain, oldShowMain); // no-op just to be sure
// Actually let's use a simpler replace
c = c.replace(/menuSection\.classList\.toggle\("hidden", view !== "home"\);/, 'if (menuSection) menuSection.classList.toggle("hidden", view !== "home");');
c = c.replace(/controlsSection\.classList\.toggle\("hidden", view !== "play" && view !== "peda"\);/, 'if (categorySection) categorySection.classList.toggle("hidden", view !== "categories");\n  if (controlsSection) controlsSection.classList.toggle("hidden", view !== "play" && view !== "peda");');

// 4. HANDLERS
console.log("Adding handlers...");
const newHandlers = `
function updateUISettings() {
  const impVal = impostorsInput ? impostorsInput.value : "1";
  if (impostorCountDisplay) impostorCountDisplay.textContent = impVal;
  if (btnPlayersCount) btnPlayersCount.textContent = state.playerNames.length;
}

if (minusImpostorBtn) minusImpostorBtn.addEventListener("click", () => {
  if (!impostorsInput) return;
  const v = Math.max(1, parseInt(impostorsInput.value) - 1);
  impostorsInput.value = v;
  updateUISettings();
  SFX.click();
});

if (plusImpostorBtn) plusImpostorBtn.addEventListener("click", () => {
  if (!impostorsInput) return;
  const v = Math.min(5, parseInt(impostorsInput.value) + 1);
  impostorsInput.value = v;
  updateUISettings();
  SFX.click();
});

if (addPlayerRowBtn) addPlayerRowBtn.addEventListener("click", () => {
  state.playerNames.push("");
  renderPlayerNameInputs();
  updateUISettings();
  SFX.click();
});

if (backFromCategoryBtn) backFromCategoryBtn.addEventListener("click", () => showMainView("home"));
if (backFromSetupBtn) backFromSetupBtn.addEventListener("click", () => showMainView("categories"));
if (changeCategoryBtn) changeCategoryBtn.addEventListener("click", () => showMainView("categories"));

if (menuStartBtn) {
  menuStartBtn.addEventListener("click", () => showMainView("categories"));
}
if (menuPlayBtn) {
  menuPlayBtn.addEventListener("click", () => showMainView("categories"));
}
`;
if (!c.includes("function updateUISettings")) {
    c = c.replace("// ============= EVENT LISTENERS =============", newHandlers + "\n// ============= EVENT LISTENERS =============");
}

// 5. ADJUST renderPlayerNameInputs
console.log("Adjusting renderPlayerNameInputs...");
c = c.replace(/const count = parseInt\(playersInput\.value\) \|\| 3;/, 'if (state.playerNames.length < 3) while(state.playerNames.length < 3) state.playerNames.push("");\n  const count = state.playerNames.length;\n  if (playersInput) playersInput.value = count;');

// 6. Null checks for listeners
console.log("Applying null checks...");
const risky = ["readyBtn", "nextBtn", "coverBtn", "revealAllBtn", "quitGameBtn", "newRoundBtn", "backHomeBtn", "startTimerBtn", "pauseTimerBtn", "resetTimerBtn", "fullscreenBtn", "adultThemesToggle", "menuHelpBtn", "menuStartBtn", "menuPlayBtn"];
risky.forEach(id => {
    // Escaped string concatenation to avoid syntax errors in the runner script
    const pattern = id + ".addEventListener";
    const replacement = "if (" + id + ") " + id + ".addEventListener";
    // global search and replace for this specific pattern
    c = c.split(pattern).join(replacement);
});

fs.writeFileSync(filePath, c, 'utf8');
console.log("Patch applied.");
