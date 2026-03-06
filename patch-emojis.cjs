const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'main.js');
let c = fs.readFileSync(filePath, 'utf8');
let changes = 0;

// 1. Add missing DOM references after existing ones
const domRefTarget = 'const playersInput = document.getElementById("players");';
const extraRefs = [
    'const categorySection = document.getElementById("categorySection");',
    'const categoryGrid = document.getElementById("categoryGrid");',
    'const backFromCategoryBtn = document.getElementById("backFromCategoryBtn");',
    'const selectedCategoryName = document.getElementById("selectedCategoryName");',
    'const changeCategoryBtn = document.getElementById("changeCategoryBtn");',
    'const btnCreateCustomPackHeader = document.getElementById("btnCreateCustomPackHeader");',
    'const startGameBtn = document.getElementById("startGameBtn");',
].join('\n');
if (c.includes(domRefTarget) && !c.includes('categorySection = document.getElementById')) {
    c = c.replace(domRefTarget, domRefTarget + '\n' + extraRefs);
    changes++;
}

// 2. Add renderThemeChips function before // ============= INIT =============
const initTarget = '// ============= INIT =============';
const renderThemeChipsFunc = `
// ============= CATEGORY RENDERING =============
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
    
    if (t.adult) {
      card.style.background = \`linear-gradient(135deg, \${style.color}, var(--bg))\`;
      card.style.border = \`2px solid \${style.color}\`;
      card.innerHTML = \`
        <div class="category-card-icon" style="font-size: 2.2rem; margin-bottom: 4px;">\${style.icon}</div>
        <div class="category-card-label" style="font-size: 0.85rem;">\${escapeHtml(t.label.replace(/🔥|🍻|🔞|📦|/g, '').trim())}</div>
      \`;
    } else {
      card.style.background = \`linear-gradient(135deg, \${style.color}, var(--bg))\`;
      card.innerHTML = \`
        <div class="category-card-icon">\${style.icon}</div>
        <div class="category-card-label">\${escapeHtml(t.label.replace(/🔥|🍻|🔞|📦|/g, '').trim())}</div>
      \`;
    }

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

  if (!visible.some(t => t.key === state.selectedTheme)) {
    state.selectedTheme = "aleatorio";
  }
}
`;
if (c.includes(initTarget) && !c.includes('function renderThemeChips()')) {
    c = c.replace(initTarget, renderThemeChipsFunc + '\n' + initTarget);
    changes++;
}

// 3. Update showMainView to handle categorySection
const oldShowMain = '  menuSection.classList.toggle("hidden", view !== "home");\r\n  controlsSection.classList.toggle("hidden", view !== "play" && view !== "peda");';
const newShowMain = '  menuSection.classList.toggle("hidden", view !== "home");\r\n  if (categorySection) categorySection.classList.toggle("hidden", view !== "categories");\r\n  controlsSection.classList.toggle("hidden", view !== "play" && view !== "peda");';
if (c.includes(oldShowMain)) {
    c = c.replace(oldShowMain, newShowMain);
    changes++;
}

// 4. Update menuStartBtn and menuPlayBtn to go to "categories"
c = c.replace('if (menuPlayBtn) menuPlayBtn.addEventListener("click", () => showMainView("play"));', 'if (menuPlayBtn) menuPlayBtn.addEventListener("click", () => showMainView("categories"));');
c = c.replace('menuStartBtn.addEventListener("click", () => showMainView("play"));', 'if (menuStartBtn) menuStartBtn.addEventListener("click", () => showMainView("categories"));');

// Add listeners for missing buttons if they appear in index.html
const extraListeners = [
    'if (backFromCategoryBtn) backFromCategoryBtn.addEventListener("click", () => showMainView("home"));',
    'if (changeCategoryBtn) changeCategoryBtn.addEventListener("click", () => showMainView("categories"));'
].join('\n');
if (!c.includes('backFromCategoryBtn.addEventListener')) {
    c = c.replace(initTarget, extraListeners + '\n\n' + initTarget);
}

// 5. Null-check adultThemesToggle crash
const oldAdult = 'adultThemesToggle.addEventListener("change", () => {';
const newAdult = 'if (adultThemesToggle) adultThemesToggle.addEventListener("change", () => {';
if (c.includes(oldAdult)) {
    c = c.replace(oldAdult, newAdult);
    changes++;
}

// Fix startGameBtn id to point to startBtn if necessary in index.html. Actually we don't need to change startBtn ID if it's already bound, verify_ui tests can click startGameBtn if we bind it.
// Let's bind startGameBtn to the startBtn logic if it exists.
if (!c.includes('startGameBtn.addEventListener')) {
    c = c.replace('startBtn.addEventListener("click",', 'if (startGameBtn) startGameBtn.addEventListener("click", () => { if(startBtn) startBtn.click(); });\nstartBtn.addEventListener("click",');
}

fs.writeFileSync(filePath, c, 'utf8');
console.log('Applied UI fixes: ' + changes);
