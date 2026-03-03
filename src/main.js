import { inject } from "@vercel/analytics";
inject();

// ============= PARTICLE BACKGROUND =============
(function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width, height;
  const particles = [];
  const PARTICLE_COUNT = 45;
  const COLORS = [
    "rgba(107, 138, 255, 0.4)",
    "rgba(139, 92, 246, 0.35)",
    "rgba(59, 130, 246, 0.3)",
    "rgba(46, 213, 115, 0.2)",
    "rgba(168, 85, 247, 0.25)"
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.2 - 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.005
    };
  }

  function init() {
    resize();
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += p.pulseSpeed;

      // Wrap around
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
      const currentSize = p.size * (0.8 + 0.2 * Math.sin(p.pulse));

      ctx.beginPath();
      ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${currentOpacity})`);
      ctx.fill();

      // Glow effect
      ctx.beginPath();
      ctx.arc(p.x, p.y, currentSize * 3, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${currentOpacity * 0.15})`);
      ctx.fill();
    }

    // Draw connections between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const lineOpacity = (1 - dist / 120) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(107, 138, 255, ${lineOpacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);
  init();
  animate();
})();

const localWords = {
  aleatorio: [
    ["volcán", "montaña"],
    ["wifi", "bluetooth"],
    ["mango", "papaya"],
    ["biblioteca", "museo"],
    ["satélite", "cohete"]
  ],
  comida: [
    ["pizza", "lasaña"],
    ["taco", "burrito"],
    ["café", "té"],
    ["sushi", "ramen"]
  ],
  lugares: [
    ["aeropuerto", "terminal"],
    ["hospital", "clínica"],
    ["playa", "isla"],
    ["escuela", "universidad"]
  ],
  objetos: [
    ["teclado", "ratón"],
    ["paraguas", "impermeable"],
    ["linterna", "vela"],
    ["reloj", "cronómetro"]
  ],
  tecnologia: [
    ["nube", "servidor"],
    ["robot", "drone"],
    ["python", "javascript"],
    ["token", "contraseña"]
  ],
  deportes: [
    ["fútbol", "rugby"],
    ["natación", "waterpolo"],
    ["tenis", "bádminton"],
    ["boxeo", "karate"]
  ],
  animales: [
    ["gato", "león"],
    ["águila", "halcón"],
    ["delfín", "tiburón"],
    ["abeja", "avispa"]
  ],
  profesiones: [
    ["doctor", "enfermero"],
    ["abogado", "juez"],
    ["chef", "pastelero"],
    ["piloto", "astronauta"]
  ],
  peliculas: [
    ["terror", "suspenso"],
    ["comedia", "parodia"],
    ["marvel", "dc"],
    ["pixar", "dreamworks"]
  ],
  musica: [
    ["guitarra", "bajo"],
    ["reggaetón", "trap"],
    ["piano", "órgano"],
    ["rock", "punk"]
  ],
  historia: [
    ["egipto", "roma"],
    ["revolución", "independencia"],
    ["medieval", "renacimiento"],
    ["samurái", "ninja"]
  ],
  naturaleza: [
    ["volcán", "géiser"],
    ["tsunami", "huracán"],
    ["bosque", "selva"],
    ["río", "cascada"]
  ],
  adulto: [
    ["tequila", "mezcal"],
    ["reggaetón", "perreo"],
    ["resaca", "cruda"],
    ["strip poker", "verdad o reto"],
    ["ligue", "cita"]
  ]
};

const themes = [
  { key: "aleatorio", label: "Aleatorio" },
  { key: "comida", label: "Comida" },
  { key: "lugares", label: "Lugares" },
  { key: "objetos", label: "Objetos" },
  { key: "tecnologia", label: "Tecnología" },
  { key: "deportes", label: "Deportes" },
  { key: "animales", label: "Animales" },
  { key: "profesiones", label: "Profesiones" },
  { key: "peliculas", label: "Películas" },
  { key: "musica", label: "Música" },
  { key: "historia", label: "Historia" },
  { key: "naturaleza", label: "Naturaleza" },
  { key: "adulto", label: "+18 🔥", adult: true }
];

const AI_CACHE_KEY = "impostorAiCacheV1";

const playersInput = document.getElementById("players");
const impostorsInput = document.getElementById("impostors");
const whitesInput = document.getElementById("whites");
const toggleAdvancedBtn = document.getElementById("toggleAdvancedBtn");
const advancedOptions = document.getElementById("advancedOptions");
const themeChips = document.getElementById("themeChips");
const adultThemesToggle = document.getElementById("adultThemesToggle");
const modeLocalInput = document.getElementById("modeLocal");
const modeAiInput = document.getElementById("modeAi");
const statusBox = document.getElementById("statusBox");
const statusEl = document.getElementById("status");
const aiIndicator = document.getElementById("aiIndicator");
const aiIndicatorText = document.getElementById("aiIndicatorText");
const menuSection = document.getElementById("menuSection");
const controlsSection = document.getElementById("controlsSection");
const helpSection = document.getElementById("helpSection");
const menuHomeBtn = document.getElementById("menuHomeBtn");
const menuPlayBtn = document.getElementById("menuPlayBtn");
const menuHelpBtn = document.getElementById("menuHelpBtn");
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

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

const dealSection = document.getElementById("dealSection");
const roundSection = document.getElementById("roundSection");
const handoffScreen = document.getElementById("handoffScreen");
const swipeScreen = document.getElementById("swipeScreen");
const readyBtn = document.getElementById("readyBtn");
const nextBtn = document.getElementById("nextBtn");
const coverBtn = document.getElementById("coverBtn");
const dealHint = document.getElementById("dealHint");
const roleCard = document.getElementById("roleCard");
const swipeTrack = document.getElementById("swipeTrack");
const revealOverlay = document.getElementById("revealOverlay");
const swipeLevelButtons = document.querySelectorAll(".swipe-level");

const revealAllBtn = document.getElementById("revealAllBtn");
const finalResult = document.getElementById("finalResult");

const timerDisplay = document.getElementById("timerDisplay");
const roundStatus = document.getElementById("roundStatus");
const startTimerBtn = document.getElementById("startTimerBtn");
const pauseTimerBtn = document.getElementById("pauseTimerBtn");
const resetTimerBtn = document.getElementById("resetTimerBtn");
const timerPresetButtons = document.querySelectorAll(".timer-preset");

const voteList = document.getElementById("voteList");
const calculateVotesBtn = document.getElementById("calculateVotesBtn");
const voteResult = document.getElementById("voteResult");

const state = {
  round: null,
  revealIndex: 0,
  roleIsVisible: false,
  modeIsAi: false,
  selectedTheme: "aleatorio",
  includeAdultTheme: false,
  showAdvanced: false,
  timerSeconds: 120,
  timerTotalSeconds: 120,
  timerHandle: null,
  swipeStartY: 0,
  swipeStartX: 0,
  swipeDragging: false,
  swipePointerId: null,
  swipeAxisLocked: false,
  swipeVerticalGesture: false,
  swipeOffset: 0,
  swipeSensitivity: "suave",
  playerNames: [],
  showNames: false,
  aiCache: loadAiCache()
};

function setStatus(text, type = "success") {
  statusBox.classList.remove("hidden", "error", "loading", "success");
  statusBox.classList.add(type === "error" ? "error" : type === "loading" ? "loading" : "success");
  statusEl.textContent = text;
}

function setRoundStatus(text) {
  roundStatus.textContent = text || "";
}

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const seconds = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function renderTimer() {
  timerDisplay.textContent = formatTime(state.timerSeconds);
}

function stopTimer() {
  if (state.timerHandle) {
    clearInterval(state.timerHandle);
    state.timerHandle = null;
  }
}

function setTimerMinutes(minutes) {
  stopTimer();
  state.timerTotalSeconds = minutes * 60;
  state.timerSeconds = state.timerTotalSeconds;
  renderTimer();
  setRoundStatus("Tiempo configurado.");
}

function startTimer() {
  if (state.timerHandle || state.timerSeconds <= 0) return;
  state.timerHandle = setInterval(() => {
    state.timerSeconds -= 1;
    renderTimer();

    if (state.timerSeconds <= 0) {
      stopTimer();
      setRoundStatus("⏰ Tiempo terminado. Pasen a votación.");
    }
  }, 1000);
}

function pauseTimer() {
  stopTimer();
  setRoundStatus("Temporizador pausado.");
}

function resetTimer() {
  stopTimer();
  state.timerSeconds = state.timerTotalSeconds;
  renderTimer();
  setRoundStatus("");
}

function shuffle(array) {
  const copy = [...array];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildRoles(playerCount, impostorCount, whiteCount, secretWord, decoyWord) {
  const roles = [];

  for (let player = 1; player <= playerCount; player += 1) {
    const name = getPlayerName(player);
    roles.push({
      player,
      name,
      role: "civil",
      word: secretWord,
      tip: "Da una pista específica, sin decir la palabra literal."
    });
  }

  const order = shuffle([...Array(playerCount).keys()]);

  for (let index = 0; index < impostorCount; index += 1) {
    const playerIndex = order[index];
    roles[playerIndex] = {
      ...roles[playerIndex],
      role: "impostor",
      word: decoyWord,
      tip: "Disimula y detecta qué palabra están describiendo los demás."
    };
  }

  if (whiteCount > 0) {
    for (let index = impostorCount; index < impostorCount + whiteCount; index += 1) {
      const playerIndex = order[index];
      roles[playerIndex] = {
        ...roles[playerIndex],
        role: "agente fantasma",
        word: "(sin palabra)",
        tip: "Improvisa pistas vagas para sobrevivir a la votación."
      };
    }
  }

  return roles;
}

function getThemePool(themeKey, includeAdult) {
  if (themeKey === "aleatorio") {
    const keys = Object.keys(localWords).filter(key => key !== "aleatorio" && (includeAdult || key !== "adulto"));
    return keys.flatMap(key => localWords[key]);
  }

  if (themeKey === "adulto" && !includeAdult) {
    return getThemePool("aleatorio", false);
  }

  return localWords[themeKey] ?? localWords.aleatorio;
}

function getLocalPack(themeKey, includeAdult) {
  const pool = getThemePool(themeKey, includeAdult);
  const pair = pickRandom(pool);
  return {
    secretWord: pair[0],
    decoyWord: pair[1],
    aiContext: "",
    source: "local"
  };
}

function loadAiCache() {
  try {
    const raw = sessionStorage.getItem(AI_CACHE_KEY);
    if (!raw) return new Map();
    const parsed = JSON.parse(raw);
    return new Map(Object.entries(parsed));
  } catch {
    return new Map();
  }
}

function saveAiCache() {
  const plain = Object.fromEntries(state.aiCache.entries());
  sessionStorage.setItem(AI_CACHE_KEY, JSON.stringify(plain));
}

function getCacheKey(themeKey, includeAdult) {
  return `${themeKey}|adult:${includeAdult ? "1" : "0"}`;
}

function pullFromCache(cacheKey) {
  const current = state.aiCache.get(cacheKey);
  if (!Array.isArray(current) || current.length === 0) return null;
  const picked = current.shift();
  state.aiCache.set(cacheKey, current);
  saveAiCache();
  return picked;
}

async function fetchAiBatch({ theme, includeAdult, count = 5 }) {
  const response = await fetch("/api/word-pack", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theme, includeAdult, count })
  });

  if (!response.ok) {
    throw new Error(`Backend respondió ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data.packs) || data.packs.length === 0) {
    throw new Error("El backend no devolvió packs válidos.");
  }

  return data.packs.map(item => ({
    secretWord: String(item.secretWord || "").trim(),
    decoyWord: String(item.decoyWord || "").trim(),
    aiContext: String(item.aiContext || "Contexto generado por IA.").trim(),
    source: "ai"
  })).filter(item => item.secretWord && item.decoyWord);
}

async function getAiPack({ theme, includeAdult }) {
  const cacheKey = getCacheKey(theme, includeAdult);
  const cached = pullFromCache(cacheKey);

  if (cached) {
    return cached;
  }

  const batch = await fetchAiBatch({ theme, includeAdult, count: 5 });
  const [first, ...rest] = batch;

  state.aiCache.set(cacheKey, rest);
  saveAiCache();

  return first;
}

async function createRound() {
  const playerCount = Number(playersInput.value);
  const impostorCount = Number(impostorsInput.value);
  const whiteCount = state.showAdvanced ? Number(whitesInput.value) : 0;
  const theme = state.selectedTheme;
  const useAi = modeAiInput.checked;

  if (playerCount < 3 || playerCount > 24) {
    throw new Error("Jugadores fuera de rango (3-24).");
  }

  if (impostorCount < 1 || impostorCount > 3) {
    throw new Error("Configura entre 1 y 3 impostores.");
  }

  if (whiteCount < 0 || whiteCount > 2) {
    throw new Error("Fantasma debe estar entre 0 y 2.");
  }

  if (impostorCount + whiteCount >= playerCount) {
    throw new Error("Impostores + fantasmas debe ser menor que jugadores.");
  }

  let pack;
  state.modeIsAi = useAi;

  if (useAi) {
    setStatus("Generando pack con IA...", "loading");
    try {
      pack = await getAiPack({ theme, includeAdult: state.includeAdultTheme });
    } catch (error) {
      console.warn("IA no disponible, usando local:", error.message);
      pack = {
        ...getLocalPack(theme, state.includeAdultTheme),
        aiContext: "IA no disponible. Se usó pack local.",
        source: "fallback"
      };
    }
  } else {
    pack = getLocalPack(theme, state.includeAdultTheme);
    setStatus("Ronda creada con palabras locales.", "success");
  }

  const roles = buildRoles(playerCount, impostorCount, whiteCount, pack.secretWord, pack.decoyWord);

  return {
    createdAt: new Date().toISOString(),
    theme,
    includeAdultTheme: state.includeAdultTheme,
    ...pack,
    roles
  };
}

function getRoleEmoji(role) {
  return role === "impostor" ? "🕵️" : role === "agente fantasma" ? "👻" : "👤";
}

function showCurrentPlayerPrompt() {
  const current = state.revealIndex + 1;
  const total = state.round.roles.length;
  const name = state.round.roles[state.revealIndex].name;
  dealHint.textContent = `Pasa el celular a ${name} (${current} de ${total}).`;
  updateDealProgress();
}

function renderRoleCard() {
  const item = state.round.roles[state.revealIndex];
  const roleName = item.role === "agente fantasma" ? "Fantasma" : item.role;
  const maybeContext = state.round.source !== "local" && state.round.aiContext
    ? `<p class="role-context">${escapeHtml(state.round.aiContext)}</p>`
    : "";

  roleCard.innerHTML = `
    <span class="role-emoji">${getRoleEmoji(item.role)}</span>
    <h3 class="role-name">${escapeHtml(item.name)} · ${escapeHtml(roleName)}</h3>
    <p class="role-word">${escapeHtml(item.word)}</p>
    <p class="role-tip">${escapeHtml(item.tip)}</p>
    ${maybeContext}
  `;
}

function showHandoffScreen() {
  handoffScreen.classList.remove("hidden");
  swipeScreen.classList.add("hidden");
  nextBtn.classList.add("hidden");
  coverBtn.classList.add("hidden");
  state.roleIsVisible = false;
  resetOverlayPosition();
  showCurrentPlayerPrompt();
}

function showSwipeScreen() {
  renderRoleCard();
  handoffScreen.classList.add("hidden");
  swipeScreen.classList.remove("hidden");
  nextBtn.classList.add("hidden");
  coverBtn.classList.add("hidden");
  state.roleIsVisible = false;
  resetOverlayPosition();
}

function revealRoleFully() {
  const height = swipeTrack.getBoundingClientRect().height;
  revealOverlay.style.transition = "transform 0.2s ease";
  revealOverlay.style.transform = `translateY(-${height}px)`;
  revealOverlay.style.opacity = "0";
  state.swipeOffset = height;
  state.roleIsVisible = true;
  nextBtn.classList.remove("hidden");
  coverBtn.classList.remove("hidden");

  if (navigator.vibrate) {
    navigator.vibrate(20);
  }
}

function resetOverlayPosition() {
  revealOverlay.style.transition = "transform 0.2s ease";
  revealOverlay.style.transform = "translateY(0px)";
  revealOverlay.style.opacity = "1";
  state.swipeOffset = 0;
  state.swipeDragging = false;
  state.swipePointerId = null;
  state.swipeAxisLocked = false;
  state.swipeVerticalGesture = false;
}

function coverRoleAgain() {
  state.roleIsVisible = false;
  nextBtn.classList.add("hidden");
  coverBtn.classList.add("hidden");
  resetOverlayPosition();
}

function getSwipeThreshold() {
  const height = swipeTrack.getBoundingClientRect().height;
  const base = Math.max(120, Math.min(220, Math.floor(height * 0.42)));
  const multiplier = state.swipeSensitivity === "estricto"
    ? 1.2
    : state.swipeSensitivity === "normal"
      ? 1
      : 0.78;
  return Math.round(base * multiplier);
}

function setSwipeSensitivity(level) {
  state.swipeSensitivity = level;
  for (const button of swipeLevelButtons) {
    button.classList.toggle("active", button.dataset.swipeLevel === level);
  }
}

function onSwipeStart(clientX, clientY, pointerId = null) {
  if (state.roleIsVisible) return;
  state.swipeStartX = clientX;
  state.swipeStartY = clientY;
  state.swipeDragging = true;
  state.swipePointerId = pointerId;
  state.swipeAxisLocked = false;
  state.swipeVerticalGesture = false;
  revealOverlay.style.transition = "none";
}

function onSwipeMove(clientX, clientY) {
  if (!state.swipeDragging || state.roleIsVisible) return;

  const deltaY = state.swipeStartY - clientY;
  const deltaX = Math.abs(state.swipeStartX - clientX);

  if (!state.swipeAxisLocked) {
    const activationDistance = 10;
    if (Math.abs(deltaY) < activationDistance && deltaX < activationDistance) {
      return;
    }
    state.swipeAxisLocked = true;
    state.swipeVerticalGesture = Math.abs(deltaY) > deltaX;
  }

  if (!state.swipeVerticalGesture) {
    return;
  }

  const delta = Math.max(0, state.swipeStartY - clientY);
  const maxHeight = swipeTrack.getBoundingClientRect().height;
  const offset = Math.min(delta, maxHeight);
  state.swipeOffset = offset;
  revealOverlay.style.transform = `translateY(-${offset}px)`;
  const progress = Math.min(1, offset / maxHeight);
  revealOverlay.style.opacity = String(1 - progress * 0.85);
}

function onSwipeEnd() {
  if (!state.swipeDragging || state.roleIsVisible) return;
  state.swipeDragging = false;
  const threshold = getSwipeThreshold();

  if (state.swipeVerticalGesture && state.swipeOffset >= threshold) {
    revealRoleFully();
  } else {
    resetOverlayPosition();
  }
}

function goNextPlayer() {
  if (!state.round || !state.roleIsVisible) return;

  state.revealIndex += 1;
  state.roleIsVisible = false;

  if (state.revealIndex >= state.round.roles.length) {
    dealSection.classList.add("hidden");
    roundSection.classList.remove("hidden");
    setGamePhase("debate");
    gameProgressBar.style.width = "100%";
    buildVoteUI();
    resetTimer();
    return;
  }

  showHandoffScreen();
}

function buildVoteUI() {
  if (!state.round) return;

  voteList.innerHTML = "";
  voteResult.classList.add("hidden");
  voteResult.textContent = "";

  const players = state.round.roles.map(item => item.player);

  for (const player of players) {
    const row = document.createElement("div");
    row.className = "vote-row";

    const name = state.round.roles.find(r => r.player === player)?.name || `Jugador ${player}`;

    const label = document.createElement("label");
    label.setAttribute("for", `vote-${player}`);
    label.textContent = `${name} vota`;

    const select = document.createElement("select");
    select.id = `vote-${player}`;

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Selecciona sospechoso";
    select.appendChild(defaultOption);

    for (const suspect of players) {
      if (suspect === player) continue;
      const suspectName = state.round.roles.find(r => r.player === suspect)?.name || `Jugador ${suspect}`;
      const option = document.createElement("option");
      option.value = String(suspect);
      option.textContent = suspectName;
      select.appendChild(option);
    }

    row.appendChild(label);
    row.appendChild(select);
    voteList.appendChild(row);
  }
}

function calculateVotes() {
  if (!state.round) return;

  const voteSelects = Array.from(voteList.querySelectorAll("select"));
  const tally = new Map();

  for (const select of voteSelects) {
    const vote = Number(select.value);
    if (!vote) continue;
    tally.set(vote, (tally.get(vote) || 0) + 1);
  }

  voteResult.classList.remove("hidden");

  if (tally.size === 0) {
    voteResult.textContent = "Aún no hay votos registrados.";
    return;
  }

  const entries = [...tally.entries()].sort((a, b) => b[1] - a[1]);
  const maxVotes = entries[0][1];
  const winners = entries.filter(([, count]) => count === maxVotes).map(([player]) => {
    return state.round.roles.find(r => r.player === player)?.name || `Jugador ${player}`;
  });

  voteResult.textContent = winners.length > 1
    ? `Empate entre ${winners.join(", ")} con ${maxVotes} votos.`
    : `${winners[0]} es el más votado con ${maxVotes} votos.`;
}

function revealFinal() {
  if (!state.round) return;

  const themeLabel = themes.find(item => item.key === state.round.theme)?.label || state.round.theme;
  const rows = state.round.roles
    .map(item => {
      const cssRole = item.role === "agente fantasma" ? "fantasma" : item.role;
      const visibleRole = item.role === "agente fantasma" ? "Fantasma" : item.role;
      return `
        <div class="result-row">
          <span>${escapeHtml(item.name)}</span>
          <span><span class="badge ${cssRole}">${escapeHtml(visibleRole)}</span></span>
          <span>${escapeHtml(item.word)}</span>
        </div>
      `;
    })
    .join("");

  finalResult.innerHTML = `
    <div class="result-header">
      <span>Tema: ${escapeHtml(themeLabel)}</span>
      <span>Civiles: ${escapeHtml(state.round.secretWord)}</span>
      <span>Impostor: ${escapeHtml(state.round.decoyWord)}</span>
    </div>
    ${rows}
  `;

  finalResult.classList.remove("hidden");
}

function updateModeIndicator() {
  const isAiEnabled = modeAiInput.checked;
  aiIndicatorText.textContent = isAiEnabled ? "Modo: IA (Gemini)" : "Modo: Local";
  aiIndicator.classList.toggle("ai-active", isAiEnabled);
}

function enterGameMode() {
  appEl.classList.add("in-game");
  gameScreen.classList.remove("hidden");
  setGamePhase("reparto");
}

function exitGameMode() {
  appEl.classList.remove("in-game");
  gameScreen.classList.add("hidden");
  dealSection.classList.add("hidden");
  roundSection.classList.add("hidden");
}

function setGamePhase(phase) {
  gamePhaseLabel.textContent = phase === "reparto" ? "Reparto" : phase === "debate" ? "Debate" : phase;
}

function updateDealProgress() {
  if (!state.round) return;
  const current = state.revealIndex + 1;
  const total = state.round.roles.length;
  const pct = Math.round((state.revealIndex / total) * 100);
  gameProgressBar.style.width = `${pct}%`;
  dealCounter.textContent = `${current} / ${total}`;
}

function setActiveMenuTab(tab) {
  const pairs = [
    [menuHomeBtn, tab === "home"],
    [menuPlayBtn, tab === "play"],
    [menuHelpBtn, tab === "help"]
  ];

  for (const [button, active] of pairs) {
    button.classList.toggle("active", active);
  }
}

function showMainView(view) {
  menuSection.classList.toggle("hidden", view !== "home");
  controlsSection.classList.toggle("hidden", view !== "play");
  helpSection.classList.toggle("hidden", view !== "help");
  setActiveMenuTab(view);
}

function getPlayerName(playerNumber) {
  if (state.showNames && state.playerNames[playerNumber - 1]) {
    return state.playerNames[playerNumber - 1];
  }
  return `Jugador ${playerNumber}`;
}

function renderPlayerNameInputs() {
  const count = Number(playersInput.value) || 6;
  playerNamesContainer.innerHTML = "";

  for (let i = 1; i <= count; i += 1) {
    const wrapper = document.createElement("div");
    wrapper.className = "player-name-input";

    const num = document.createElement("span");
    num.className = "pn-number";
    num.textContent = i;

    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 16;
    input.placeholder = `Jugador ${i}`;
    input.value = state.playerNames[i - 1] || "";
    input.addEventListener("input", () => {
      state.playerNames[i - 1] = input.value.trim();
    });

    wrapper.appendChild(num);
    wrapper.appendChild(input);
    playerNamesContainer.appendChild(wrapper);
  }
}

function playSorteoAnimation(roles) {
  return new Promise(resolve => {
    sorteoSection.classList.remove("hidden");
    sorteoCards.innerHTML = "";

    const cards = [];
    for (let i = 0; i < roles.length; i += 1) {
      const card = document.createElement("div");
      card.className = "sorteo-card";
      card.style.setProperty("--delay", `${i * 0.08}s`);
      card.textContent = "?";
      sorteoCards.appendChild(card);
      cards.push(card);
    }

    let revealed = 0;
    const revealInterval = setInterval(() => {
      if (revealed >= cards.length) {
        clearInterval(revealInterval);
        setTimeout(() => {
          sorteoSection.classList.add("hidden");
          resolve();
        }, 600);
        return;
      }

      const role = roles[revealed];
      const card = cards[revealed];
      const roleClass = role.role === "impostor"
        ? "impostor-card"
        : role.role === "agente fantasma"
          ? "ghost-card"
          : "civil-card";

      card.classList.add("sorted", roleClass);
      card.textContent = role.role === "impostor" ? "🕵️" : role.role === "agente fantasma" ? "👻" : "✓";

      if (navigator.vibrate) navigator.vibrate(10);
      revealed += 1;
    }, 180);
  });
}

function renderThemeChips() {
  themeChips.innerHTML = "";

  const visibleThemes = themes.filter(theme => !theme.adult || state.includeAdultTheme);

  for (const theme of visibleThemes) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `theme-chip${theme.adult ? " adult" : ""}${theme.key === state.selectedTheme ? " active" : ""}`;
    chip.textContent = theme.label;
    chip.setAttribute("role", "radio");
    chip.setAttribute("aria-checked", String(theme.key === state.selectedTheme));
    chip.addEventListener("click", () => {
      state.selectedTheme = theme.key;
      renderThemeChips();
    });
    themeChips.appendChild(chip);
  }

  if (!visibleThemes.some(theme => theme.key === state.selectedTheme)) {
    state.selectedTheme = "aleatorio";
    renderThemeChips();
  }
}

function resetRound() {
  stopTimer();
  state.round = null;
  state.revealIndex = 0;
  state.roleIsVisible = false;
  state.timerSeconds = state.timerTotalSeconds;

  exitGameMode();
  finalResult.classList.add("hidden");
  voteList.innerHTML = "";
  voteResult.classList.add("hidden");
  voteResult.textContent = "";
  setRoundStatus("");
  renderTimer();
  showMainView("home");
  updateModeIndicator();
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      fullscreenBtn.textContent = "✕";
      fullscreenBtn.setAttribute("aria-label", "Salir de pantalla completa");
    } else {
      await document.exitFullscreen();
      fullscreenBtn.textContent = "⛶";
      fullscreenBtn.setAttribute("aria-label", "Pantalla completa");
    }
  } catch {
    setStatus("Tu navegador no soporta pantalla completa aquí.", "error");
  }
}

startBtn.addEventListener("click", async () => {
  try {
    startBtn.disabled = true;
    state.round = await createRound();
    state.revealIndex = 0;
    finalResult.classList.add("hidden");

    await playSorteoAnimation(state.round.roles);

    enterGameMode();
    dealSection.classList.remove("hidden");
    roundSection.classList.add("hidden");
    gameProgressBar.style.width = "0%";

    showHandoffScreen();

    if (state.round.source === "ai") {
      setStatus("✅ Ronda creada con IA (cache activa).", "success");
    } else if (state.round.source === "fallback") {
      setStatus("⚠️ IA no respondió. Se creó ronda local.", "error");
    } else {
      setStatus("✅ Ronda creada en modo local.", "success");
    }
  } catch (error) {
    console.error(error);
    setStatus(error.message || "No se pudo crear la ronda.", "error");
  } finally {
    startBtn.disabled = false;
  }
});

readyBtn.addEventListener("click", showSwipeScreen);
nextBtn.addEventListener("click", goNextPlayer);
coverBtn.addEventListener("click", coverRoleAgain);

revealOverlay.addEventListener("pointerdown", event => {
  onSwipeStart(event.clientX, event.clientY, event.pointerId);
});

window.addEventListener("pointermove", event => {
  if (!state.swipeDragging) return;
  if (state.swipePointerId !== null && event.pointerId !== state.swipePointerId) return;
  onSwipeMove(event.clientX, event.clientY);
});

window.addEventListener("pointerup", event => {
  if (!state.swipeDragging) return;
  if (state.swipePointerId !== null && event.pointerId !== state.swipePointerId) return;
  onSwipeEnd();
});

window.addEventListener("pointercancel", () => {
  if (!state.swipeDragging) return;
  resetOverlayPosition();
});

revealAllBtn.addEventListener("click", revealFinal);
resetBtn.addEventListener("click", resetRound);

quitGameBtn.addEventListener("click", () => {
  if (state.round && !confirm("¿Seguro que quieres salir de la partida?")) return;
  resetRound();
});

newRoundBtn.addEventListener("click", () => {
  exitGameMode();
  showMainView("play");
});

backHomeBtn.addEventListener("click", () => {
  resetRound();
});

modeLocalInput.addEventListener("change", updateModeIndicator);
modeAiInput.addEventListener("change", updateModeIndicator);
startTimerBtn.addEventListener("click", startTimer);
pauseTimerBtn.addEventListener("click", pauseTimer);
resetTimerBtn.addEventListener("click", resetTimer);
calculateVotesBtn.addEventListener("click", calculateVotes);
fullscreenBtn.addEventListener("click", toggleFullscreen);

for (const button of timerPresetButtons) {
  button.addEventListener("click", () => {
    const minutes = Number(button.dataset.minutes || 2);
    setTimerMinutes(minutes);
  });
}

toggleAdvancedBtn.addEventListener("click", () => {
  state.showAdvanced = !state.showAdvanced;
  advancedOptions.classList.toggle("hidden", !state.showAdvanced);
});

menuHomeBtn.addEventListener("click", () => {
  showMainView("home");
});

menuPlayBtn.addEventListener("click", () => {
  showMainView("play");
});

menuHelpBtn.addEventListener("click", () => {
  showMainView("help");
});

menuStartBtn.addEventListener("click", () => {
  showMainView("play");
});

menuHowToBtn.addEventListener("click", () => {
  showMainView("help");
});

toggleNamesBtn.addEventListener("click", () => {
  state.showNames = !state.showNames;
  playerNamesContainer.classList.toggle("hidden", !state.showNames);
  toggleNamesBtn.textContent = state.showNames ? "✕ Ocultar nombres" : "✏️ Personalizar nombres";
  if (state.showNames) renderPlayerNameInputs();
});

playersInput.addEventListener("change", () => {
  if (state.showNames) renderPlayerNameInputs();
});

adultThemesToggle.addEventListener("change", () => {
  state.includeAdultTheme = adultThemesToggle.checked;
  if (!state.includeAdultTheme && state.selectedTheme === "adulto") {
    state.selectedTheme = "aleatorio";
  }
  renderThemeChips();
});

for (const button of swipeLevelButtons) {
  button.addEventListener("click", () => {
    const level = button.dataset.swipeLevel || "normal";
    setSwipeSensitivity(level);
  });
}

renderThemeChips();
setSwipeSensitivity("suave");
renderPlayerNameInputs();
resetRound();
