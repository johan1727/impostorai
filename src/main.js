import { inject } from "@vercel/analytics";
try { inject(); } catch {}

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
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.x += p.speedX; p.y += p.speedY; p.pulse += p.pulseSpeed;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;
      const co = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
      const cs = p.size * (0.8 + 0.2 * Math.sin(p.pulse));
      ctx.beginPath(); ctx.arc(p.x, p.y, cs, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${co})`); ctx.fill();
      ctx.beginPath(); ctx.arc(p.x, p.y, cs * 3, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${co * 0.15})`); ctx.fill();
    }
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(107, 138, 255, ${(1 - dist / 120) * 0.08})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  window.addEventListener("resize", resize);
  init(); animate();
})();

// ============= WORD POOLS (~400 pares = 800+ palabras) =============
const localWords = {
  aleatorio: [
    ["volc\u00e1n","monta\u00f1a"],["wifi","bluetooth"],["mango","papaya"],["biblioteca","museo"],
    ["sat\u00e9lite","cohete"],["espejo","ventana"],["almohada","coj\u00edn"],["sem\u00e1foro","se\u00f1al"],
    ["anillo","pulsera"],["helado","paleta"],["mochila","maleta"],["l\u00e1piz","bol\u00edgrafo"],
    ["tijeras","cuchillo"],["planeta","estrella"],["alfombra","tapete"],["bicicleta","patineta"],
    ["martillo","destornillador"],["c\u00e1mara","telescopio"],["bater\u00eda","cargador"],["cereza","fresa"],
    ["diamante","rub\u00ed"],["casco","sombrero"],["dado","moneda"],["cortina","persiana"],
    ["chicle","caramelo"],["atardecer","amanecer"],["cable","enchufe"],["grifo","manguera"]
  ],
  comida: [
    ["pizza","lasa\u00f1a"],["taco","burrito"],["caf\u00e9","t\u00e9"],["sushi","ramen"],
    ["hamburguesa","hot dog"],["paella","risotto"],["empanada","arepa"],["croissant","donut"],
    ["ceviche","carpaccio"],["brownie","galleta"],["waffle","panqueque"],["helado","sorbete"],
    ["nachos","quesadilla"],["curry","guiso"],["salm\u00f3n","at\u00fan"],["ensalada","caldo"],
    ["flan","gelatina"],["churros","bu\u00f1uelos"],["guacamole","hummus"],["mole","salsa"],
    ["papas fritas","tostones"],["pasta","fideos"],["pan","tortilla"],["queso","mantequilla"],
    ["pastel","pie"],["tocino","jam\u00f3n"],["arroz","cusc\u00fas"],["yogur","pud\u00edn"]
  ],
  lugares: [
    ["aeropuerto","terminal"],["hospital","cl\u00ednica"],["playa","isla"],["escuela","universidad"],
    ["cine","teatro"],["parque","jard\u00edn"],["estadio","coliseo"],["castillo","palacio"],
    ["supermercado","tienda"],["restaurante","cafeter\u00eda"],["iglesia","catedral"],["banco","oficina"],
    ["estaci\u00f3n","parada"],["zool\u00f3gico","acuario"],["monta\u00f1a","colina"],["r\u00edo","lago"],
    ["cueva","t\u00fanel"],["faro","torre"],["cementerio","cripta"],["granja","rancho"],
    ["lobby","recepci\u00f3n"],["balc\u00f3n","terraza"],["metro","tranv\u00eda"],["desierto","sabana"],
    ["volc\u00e1n","cr\u00e1ter"],["cascada","manantial"],["puente","muelle"],["frontera","aduana"]
  ],
  objetos: [
    ["teclado","rat\u00f3n"],["paraguas","impermeable"],["linterna","vela"],["reloj","cron\u00f3metro"],
    ["espada","escudo"],["llave","candado"],["gafas","lupa"],["br\u00fajula","mapa"],
    ["guitarra","ukulele"],["silla","banco"],["cuchara","tenedor"],["pincel","rodillo"],
    ["aguja","alfiler"],["cadena","cuerda"],["antena","radar"],["campana","silbato"],
    ["corona","tiara"],["dado","ficha"],["escalera","rampa"],["guante","manopla"],
    ["im\u00e1n","br\u00fajula"],["jarr\u00f3n","maceta"],["l\u00e1mpara","foco"],["mapa","globo"],
    ["pa\u00f1uelo","toalla"],["escoba","trapeador"],["botella","jarra"],["sobre","carpeta"]
  ],
  tecnologia: [
    ["nube","servidor"],["robot","drone"],["python","javascript"],["token","contrase\u00f1a"],
    ["pixel","v\u00f3xel"],["wifi","ethernet"],["app","programa"],["USB","HDMI"],
    ["laptop","tablet"],["RAM","disco duro"],["GPS","br\u00fajula"],["firewall","antivirus"],
    ["podcast","blog"],["streaming","descarga"],["emoji","sticker"],["VPN","proxy"],
    ["cookie","cach\u00e9"],["router","modem"],["backup","snapshot"],["c\u00f3digo QR","c\u00f3digo de barras"],
    ["realidad virtual","realidad aumentada"],["inteligencia artificial","machine learning"],
    ["front-end","back-end"],["Linux","Windows"],["dark mode","light mode"],
    ["bluetooth","NFC"],["algoritmo","funci\u00f3n"],["base de datos","hoja de c\u00e1lculo"]
  ],
  deportes: [
    ["f\u00fatbol","rugby"],["nataci\u00f3n","waterpolo"],["tenis","b\u00e1dminton"],["boxeo","karate"],
    ["basketball","volleyball"],["golf","cricket"],["surf","windsurf"],["esqu\u00ed","snowboard"],
    ["atletismo","marat\u00f3n"],["ciclismo","motocross"],["escalada","rappel"],["esgrima","kendo"],
    ["hockey","lacrosse"],["judo","taekwondo"],["patinaje","skateboard"],["polo","equitaci\u00f3n"],
    ["b\u00e9isbol","softball"],["ajedrez","damas"],["ping pong","squash"],["triatl\u00f3n","pentatl\u00f3n"],
    ["arquer\u00eda","tiro"],["lucha libre","sumo"],["remo","kayak"],["parkour","calistenia"],
    ["buceo","snorkel"],["boliche","billar"],["CrossFit","yoga"],["boxeo","MMA"]
  ],
  animales: [
    ["gato","le\u00f3n"],["aguila","halc\u00f3n"],["delf\u00edn","tibur\u00f3n"],["abeja","avispa"],
    ["perro","lobo"],["caballo","cebra"],["oso","panda"],["serpiente","lagarto"],
    ["conejo","liebre"],["loro","guacamaya"],["rana","sapo"],["hormiga","termita"],
    ["vaca","b\u00fafalo"],["ping\u00fcino","foca"],["murci\u00e9lago","b\u00faho"],["mariposa","polilla"],
    ["camale\u00f3n","iguana"],["cuervo","paloma"],["pulpo","calamar"],["tortuga","cocodrilo"],
    ["zorro","coyote"],["ballena","orca"],["medusa","an\u00e9mona"],["cangrejo","langosta"],
    ["gorila","chimpanc\u00e9"],["jirafa","avestruz"],["pavo real","flamenco"],["rata","h\u00e1mster"]
  ],
  profesiones: [
    ["doctor","enfermero"],["abogado","juez"],["chef","pastelero"],["piloto","astronauta"],
    ["bombero","polic\u00eda"],["profesor","tutor"],["arquitecto","ingeniero"],["periodista","editor"],
    ["m\u00fasico","cantante"],["fot\u00f3grafo","camar\u00f3grafo"],["dise\u00f1ador","ilustrador"],["veterinario","bi\u00f3logo"],
    ["electricista","plomero"],["psic\u00f3logo","psiquiatra"],["programador","hacker"],["detective","esp\u00eda"],
    ["carpintero","alba\u00f1il"],["dentista","ortodoncista"],["farmac\u00e9utico","qu\u00edmico"],["actor","comediante"],
    ["escultor","pintor"],["soldado","marinero"],["mec\u00e1nico","t\u00e9cnico"],["narrador","escritor"],
    ["cirujano","anestesi\u00f3logo"],["mesero","bartender"],["cartero","mensajero"],["jardinero","agricultor"]
  ],
  peliculas: [
    ["terror","suspenso"],["comedia","parodia"],["marvel","dc"],["pixar","dreamworks"],
    ["ciencia ficci\u00f3n","fantas\u00eda"],["drama","romance"],["acci\u00f3n","aventura"],["anime","cartoon"],
    ["documental","biopic"],["western","noir"],["zombie","vampiro"],["precuela","secuela"],
    ["director","productor"],["actor","doble"],["guion","storyboard"],["taquilla","streaming"],
    ["palomitas","nachos"],["subt\u00edtulos","doblaje"],["trailer","teaser"],["IMAX","3D"],
    ["Oscar","Golden Globe"],["remake","reboot"],["Star Wars","Star Trek"],
    ["Harry Potter","Se\u00f1or de los Anillos"],["Batman","Superman"],["Avengers","Justice League"],
    ["Netflix","Disney Plus"],["thriller","misterio"]
  ],
  musica: [
    ["guitarra","bajo"],["reggaet\u00f3n","trap"],["piano","\u00f3rgano"],["rock","punk"],
    ["rap","hip hop"],["salsa","cumbia"],["viol\u00edn","viola"],["jazz","blues"],
    ["electr\u00f3nica","techno"],["\u00f3pera","musical"],["bater\u00eda","percusi\u00f3n"],["flauta","clarinete"],
    ["arpa","c\u00edtara"],["acorde\u00f3n","bandone\u00f3n"],["disco","funk"],["metal","grunge"],
    ["mariachi","ranchera"],["reggae","ska"],["K-pop","J-pop"],["coral","a cappella"],
    ["DJ","productor"],["vinilo","casete"],["concierto","festival"],["single","\u00e1lbum"],
    ["estribillo","verso"],["ballad","power ballad"],["pop","indie"],["country","folk"]
  ],
  historia: [
    ["egipto","roma"],["revoluci\u00f3n","independencia"],["medieval","renacimiento"],["samur\u00e1i","ninja"],
    ["vikingo","pirata"],["colonia","imperio"],["fara\u00f3n","emperador"],["gladiador","espartano"],
    ["cruzada","conquista"],["monarqu\u00eda","rep\u00fablica"],["feudo","castillo"],["pergamino","papiro"],
    ["caballero","templario"],["azteca","maya"],["inca","olmeca"],["muralla china","pir\u00e1mide"],
    ["espada","catapulta"],["bronce","hierro"],["Napole\u00f3n","Julio C\u00e9sar"],["democracia","dictadura"],
    ["prehistoria","antig\u00fcedad"],["guerra fr\u00eda","guerra mundial"],["esclavitud","abolici\u00f3n"],
    ["invenci\u00f3n","descubrimiento"],["filosof\u00eda","mitolog\u00eda"],["Cleopatra","Nefertiti"],
    ["tratado","alianza"],["armadura","escudo"]
  ],
  naturaleza: [
    ["volc\u00e1n","g\u00e9iser"],["tsunami","hurac\u00e1n"],["bosque","selva"],["r\u00edo","cascada"],
    ["aurora boreal","arco\u00edris"],["terremoto","avalancha"],["coral","alga"],["monta\u00f1a","acantilado"],
    ["desierto","tundra"],["manglar","pantano"],["rayo","trueno"],["tornado","tif\u00f3n"],
    ["glaciar","iceberg"],["cueva","gruta"],["estalagmita","estalactita"],["oasis","manantial"],
    ["luna","sol"],["cometa","asteroide"],["f\u00f3sil","\u00e1mbar"],["cristal","mineral"],
    ["arena","grava"],["musgo","liquen"],["miel","cera"],["polen","n\u00e9ctar"],
    ["ra\u00edz","tronco"],["hoja","p\u00e9talo"],["semilla","brote"],["marea","corriente"]
  ],
  adulto: [
    ["resaca","cruda"],["tinder","bumble"],["ghostear","ignorar"],["friendzone","situationship"],
    ["hookup","encuentro"],["peda","fiesta"],["pololo","pareja"],["chamuyar","flirtear"],
    ["vibes","rollo"],["crush","obsesión"],["sexting","mensajes"],["infidelidad","engaño"],
    ["tórrido","ardiente"],["pecaminoso","prohibido"],["transgresión","aventura"],["lujuria","pasión"],
    ["morbo","deseo"],["embrague","besuqueo"],["conquista","seducción"],["onda","talante"],
    ["trago","shot"],["after","madrugada"],["drama","crisis"],["celos","posesividad"],
    ["ex","trauma"],["adrenalina","éxtasis"],["secreto","tabú"],["inhibición","liberación"],
    ["arrepentimiento","vergüenza"],["rebeldía","locura"],["desinhibición","sinceridad"],["vicio","hábito"]
  ]
};

const themes = [
  { key: "aleatorio", label: "Aleatorio" },
  { key: "comida", label: "Comida" },
  { key: "lugares", label: "Lugares" },
  { key: "objetos", label: "Objetos" },
  { key: "tecnologia", label: "Tecnolog\u00eda" },
  { key: "deportes", label: "Deportes" },
  { key: "animales", label: "Animales" },
  { key: "profesiones", label: "Profesiones" },
  { key: "peliculas", label: "Pel\u00edculas" },
  { key: "musica", label: "M\u00fasica" },
  { key: "historia", label: "Historia" },
  { key: "naturaleza", label: "Naturaleza" },
  { key: "adulto", label: "+18 \ud83d\udd25", adult: true }
];

// ============= DOM REFS =============
const playersInput = document.getElementById("players");
const impostorsInput = document.getElementById("impostors");
const whitesInput = document.getElementById("whites");
const toggleAdvancedBtn = document.getElementById("toggleAdvancedBtn");
const advancedOptions = document.getElementById("advancedOptions");
const themeChips = document.getElementById("themeChips");
const adultThemesToggle = document.getElementById("adultThemesToggle");
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
const soundToggleBtn = document.getElementById("soundToggleBtn");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const shareResultBtn = document.getElementById("shareResultBtn");
const toggleCustomPacksBtn = document.getElementById("toggleCustomPacksBtn");
const customPacksPanel = document.getElementById("customPacksPanel");
const addCustomPackBtn = document.getElementById("addCustomPackBtn");
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
const aliveStatus = document.getElementById("aliveStatus");
const timerDisplay = document.getElementById("timerDisplay");
const roundStatus = document.getElementById("roundStatus");
const startTimerBtn = document.getElementById("startTimerBtn");
const pauseTimerBtn = document.getElementById("pauseTimerBtn");
const resetTimerBtn = document.getElementById("resetTimerBtn");
const timerPresetButtons = document.querySelectorAll(".timer-preset");
const voteList = document.getElementById("voteList");
const voteResult = document.getElementById("voteResult");
const roundNumberEl = document.getElementById("roundNumber");
const debatePhase = document.getElementById("debatePhase");
const votePhase = document.getElementById("votePhase");
const resultPhase = document.getElementById("resultPhase");
const goToVoteBtn = document.getElementById("goToVoteBtn");
const backToDebateBtn = document.getElementById("backToDebateBtn");
const roundSteps = document.querySelectorAll(".round-step");
const roundHistoryLog = document.getElementById("roundHistoryLog");
const roundHistoryList = document.getElementById("roundHistoryList");
const gameOverPanel = document.getElementById("gameOverPanel");
const gameOverContent = document.getElementById("gameOverContent");

// ============= STATE =============
const NAMES_KEY = "impostorNamesV1";
const STATS_KEY = "impostorStatsV1";
const CUSTOM_PACKS_KEY = "impostorCustomPacksV1";

const state = {
  round: null,
  revealIndex: 0,
  roleIsVisible: false,
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
  playerNames: loadSavedNames(),
  showNames: false,
  voteTally: {},
  votedPlayer: null,
  roundNumber: 0,
  roundPhase: "debate",
  eliminatedPlayers: [],
  gameActive: false,
  persistentRoles: null,
  persistentSecretWord: "",
  persistentDecoyWord: "",
  persistentTheme: "",
  roundHistory: [],
  gameOver: false
};

function loadSavedNames() {
  try { return JSON.parse(localStorage.getItem(NAMES_KEY)) || []; } catch { return []; }
}
function saveNames() {
  localStorage.setItem(NAMES_KEY, JSON.stringify(state.playerNames));
}

// ============= SOUND EFFECTS (Web Audio API) =============
const SFX = (() => {
  let ctx;
  let enabled = localStorage.getItem("impostorSound") !== "off";
  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }
  function tone(freq, type, dur, vol = 0.3) {
    if (!enabled) return;
    try {
      const c = getCtx();
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.value = vol;
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
      o.connect(g); g.connect(c.destination);
      o.start(c.currentTime); o.stop(c.currentTime + dur);
    } catch {}
  }
  return {
    get enabled() { return enabled; },
    toggle() {
      enabled = !enabled;
      localStorage.setItem("impostorSound", enabled ? "on" : "off");
      return enabled;
    },
    reveal() { tone(880, "sine", 0.15); setTimeout(() => tone(1100, "sine", 0.2), 100); },
    cardFlip() { tone(600, "sine", 0.08, 0.2); },
    tick() { tone(800, "sine", 0.03, 0.12); },
    alarm() { for (let i = 0; i < 3; i++) setTimeout(() => tone(900, "square", 0.15, 0.2), i * 200); },
    success() { tone(523, "sine", 0.12); setTimeout(() => tone(659, "sine", 0.12), 100); setTimeout(() => tone(784, "sine", 0.2), 200); },
    fanfare() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, "sine", 0.3, 0.22), i * 150)); },
    click() { tone(1200, "sine", 0.04, 0.1); }
  };
})();

// ============= TOAST =============
let _toastTimer = null;
function showToast(msg, type = "success") {
  const c = document.getElementById("toastContainer");
  if (!c) return;
  const old = c.querySelector(".toast");
  if (old) old.remove();
  if (_toastTimer) clearTimeout(_toastTimer);
  const icons = { error: "\u274c", loading: "\u23f3", success: "\u2705" };
  const t = document.createElement("div");
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span>${icons[type] || "\u2705"}</span><span>${escapeHtml(msg)}</span>`;
  c.appendChild(t);
  requestAnimationFrame(() => t.classList.add("toast-show"));
  if (type !== "loading") {
    _toastTimer = setTimeout(() => {
      t.classList.remove("toast-show");
      setTimeout(() => t.remove(), 300);
    }, 3000);
  }
}

// ============= CONFETTI =============
function launchConfetti() {
  const cv = document.getElementById("confettiCanvas");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  cv.width = window.innerWidth; cv.height = window.innerHeight;
  cv.style.display = "block";
  const cols = ["#ff4757","#6b8aff","#2ed573","#ffa502","#8b5cf6","#ff6b81","#70a1ff","#ffdd59"];
  const ps = [];
  for (let i = 0; i < 120; i++) {
    ps.push({
      x: cv.width * 0.5 + (Math.random() - 0.5) * 300, y: cv.height * 0.5,
      vx: (Math.random() - 0.5) * 14, vy: Math.random() * -16 - 4,
      w: Math.random() * 8 + 3, h: Math.random() * 5 + 2,
      c: cols[Math.floor(Math.random() * cols.length)],
      r: Math.random() * 360, rs: (Math.random() - 0.5) * 12,
      g: 0.28 + Math.random() * 0.12, o: 1
    });
  }
  let f = 0;
  (function draw() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    let alive = false;
    for (const p of ps) {
      p.x += p.vx; p.vy += p.g; p.y += p.vy;
      p.r += p.rs; p.vx *= 0.99;
      if (f > 50) p.o -= 0.018;
      if (p.o <= 0) continue;
      alive = true;
      ctx.save(); ctx.translate(p.x, p.y);
      ctx.rotate(p.r * Math.PI / 180);
      ctx.globalAlpha = Math.max(0, p.o);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    f++;
    if (alive && f < 180) requestAnimationFrame(draw);
    else { ctx.clearRect(0, 0, cv.width, cv.height); cv.style.display = "none"; }
  })();
}

// ============= STATS / HISTORY =============
function loadStats() {
  try { return JSON.parse(localStorage.getItem(STATS_KEY)) || { gamesPlayed: 0, rounds: [] }; }
  catch { return { gamesPlayed: 0, rounds: [] }; }
}
function saveStats(s) { localStorage.setItem(STATS_KEY, JSON.stringify(s)); }
function recordRound(round) {
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
function renderStats() {
  const el = document.getElementById("statsContent");
  if (!el) return;
  const s = loadStats();
  if (s.gamesPlayed === 0) {
    el.innerHTML = '<p class="help-text" style="text-align:center;padding:20px">\ud83c\udfae A\u00fan no hay partidas. \u00a1Juega tu primera ronda!</p>';
    return;
  }
  const tc = {};
  for (const r of s.rounds) tc[r.theme] = (tc[r.theme] || 0) + 1;
  const top = Object.entries(tc).sort((a, b) => b[1] - a[1])[0];
  const topLabel = themes.find(t => t.key === top[0])?.label || top[0];
  const avg = Math.round(s.rounds.reduce((a, r) => a + r.playerCount, 0) / s.rounds.length);
  const recent = s.rounds.slice(-5).reverse();
  el.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card"><span class="stat-value">${s.gamesPlayed}</span><span class="stat-label">Partidas</span></div>
      <div class="stat-card"><span class="stat-value">${avg}</span><span class="stat-label">Jugadores prom.</span></div>
      <div class="stat-card"><span class="stat-value">${escapeHtml(topLabel)}</span><span class="stat-label">Tema favorito</span></div>
    </div>
    <h3 class="subsection-title" style="margin-top:12px">\u00daltimas partidas</h3>
    <div class="stats-history">${recent.map(r => `
      <div class="stats-row">
        <span>${escapeHtml(themes.find(t => t.key === r.theme)?.label || r.theme)}</span>
        <span>${escapeHtml(r.secretWord)} / ${escapeHtml(r.decoyWord)}</span>
        <span>${r.playerCount} jug.</span>
      </div>`).join("")}
    </div>
    <button id="clearStatsBtn" type="button" class="link-btn" style="margin-top:8px;color:var(--red)">\ud83d\uddd1 Borrar historial</button>`;
  document.getElementById("clearStatsBtn")?.addEventListener("click", () => {
    if (confirm("\u00bfBorrar todo el historial?")) {
      saveStats({ gamesPlayed: 0, rounds: [] });
      renderStats();
      showToast("Historial borrado");
    }
  });
}

// ============= CUSTOM PACKS =============
function loadCustomPacks() {
  try { return JSON.parse(localStorage.getItem(CUSTOM_PACKS_KEY)) || []; } catch { return []; }
}
function saveCustomPacks(p) { localStorage.setItem(CUSTOM_PACKS_KEY, JSON.stringify(p)); }
function deleteCustomPack(i) {
  const p = loadCustomPacks(); p.splice(i, 1); saveCustomPacks(p); refreshCustomThemes();
}
function refreshCustomThemes() {
  while (themes.length > 13) themes.pop();
  for (const k of Object.keys(localWords)) { if (k.startsWith("custom_")) delete localWords[k]; }
  const packs = loadCustomPacks();
  for (let i = 0; i < packs.length; i++) {
    const key = `custom_${i}`;
    localWords[key] = packs[i].pairs;
    themes.push({ key, label: `\ud83d\udce6 ${packs[i].name}`, custom: true });
  }
  renderThemeChips();
  renderCustomPacksList();
}
function renderCustomPacksList() {
  const el = document.getElementById("customPacksList");
  if (!el) return;
  const packs = loadCustomPacks();
  if (!packs.length) { el.innerHTML = '<p class="help-text">No hay packs personalizados.</p>'; return; }
  el.innerHTML = packs.map((p, i) => `<div class="custom-pack-item"><span>\ud83d\udce6 ${escapeHtml(p.name)} (${p.pairs.length} pares)</span><button type="button" class="custom-pack-del" data-idx="${i}">\u2715</button></div>`).join("");
  el.querySelectorAll(".custom-pack-del").forEach(b => b.addEventListener("click", () => {
    deleteCustomPack(Number(b.dataset.idx));
    showToast("Pack eliminado");
  }));
}
function addCustomPackFromForm() {
  const nameEl = document.getElementById("customPackName");
  const pairsEl = document.getElementById("customPackPairs");
  if (!nameEl || !pairsEl) return;
  const name = nameEl.value.trim();
  const raw = pairsEl.value.trim();
  if (!name) { showToast("Escribe un nombre para el pack", "error"); return; }
  const lines = raw.split("\n").filter(l => l.trim());
  const pairs = [];
  for (const line of lines) {
    const parts = line.split(",").map(s => s.trim()).filter(Boolean);
    if (parts.length >= 2) pairs.push([parts[0], parts[1]]);
  }
  if (pairs.length < 2) { showToast("Necesitas al menos 2 pares (palabra1, palabra2)", "error"); return; }
  const packs = loadCustomPacks();
  packs.push({ name, pairs, createdAt: new Date().toISOString() });
  saveCustomPacks(packs);
  refreshCustomThemes();
  nameEl.value = ""; pairsEl.value = "";
  showToast(`Pack "${name}" creado con ${pairs.length} pares`);
  SFX.success();
}

// ============= SHARE =============
async function shareResult() {
  if (!state.round) return;
  const tl = themes.find(t => t.key === state.round.theme)?.label || state.round.theme;
  const allRoles = state.round.allRoles || state.round.roles;
  const imps = allRoles.filter(r => r.role === "impostor").map(r => r.name).join(", ");
  const text = `\ud83d\udd75\ufe0f IMPOSTOR \u2014 Resultado\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\ud83d\udcdd Tema: ${tl}\n\ud83d\udc65 Jugadores: ${allRoles.length}\n\ud83c\udfad Impostor: ${imps}\n\ud83d\udd11 Civiles: ${state.round.secretWord}\n\ud83d\udd00 Se\u00f1uelo: ${state.round.decoyWord}\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501`;
  if (navigator.share) {
    try { await navigator.share({ title: "Impostor", text }); } catch {}
  } else {
    try { await navigator.clipboard.writeText(text); showToast("Copiado al portapapeles"); }
    catch { showToast("No se pudo copiar", "error"); }
  }
}

// ============= VISUAL THEME =============
function applyVisualTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  if (themeToggleBtn) {
    themeToggleBtn.textContent = t === "light" ? "\ud83c\udf19" : "\u2600\ufe0f";
    themeToggleBtn.setAttribute("aria-label", t === "light" ? "Modo oscuro" : "Modo claro");
  }
}
function toggleVisualTheme() {
  const curr = document.documentElement.getAttribute("data-theme") || "dark";
  const next = curr === "dark" ? "light" : "dark";
  applyVisualTheme(next);
  localStorage.setItem("impostorTheme", next);
  SFX.click();
}

// ============= SERVICE WORKER =============
if (false && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

// ============= UTILITY FUNCTIONS =============
function escapeHtml(text) {
  return String(text).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatTime(totalSeconds) {
  const s = Math.max(0, totalSeconds);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function setStatus(text, type = "success") {
  statusBox.classList.remove("hidden", "error", "loading", "success");
  statusBox.classList.add(type === "error" ? "error" : type === "loading" ? "loading" : "success");
  statusEl.textContent = text;
  showToast(text, type);
}

function setRoundStatus(text) {
  if (roundStatus) roundStatus.textContent = text || "";
}

// ============= TIMER =============
function renderTimer() {
  timerDisplay.textContent = formatTime(state.timerSeconds);
  if (state.timerSeconds <= 10 && state.timerSeconds > 0 && state.timerHandle) {
    timerDisplay.classList.add("timer-urgent");
    SFX.tick();
  } else if (state.timerSeconds > 10) {
    timerDisplay.classList.remove("timer-urgent");
  }
}

function stopTimer() {
  if (state.timerHandle) { clearInterval(state.timerHandle); state.timerHandle = null; }
}

function setTimerMinutes(minutes) {
  stopTimer();
  state.timerTotalSeconds = minutes * 60;
  state.timerSeconds = state.timerTotalSeconds;
  timerDisplay.classList.remove("timer-urgent", "timer-finished");
  renderTimer();
  setRoundStatus("Tiempo configurado.");
  SFX.click();
}

function startTimer() {
  if (state.timerHandle || state.timerSeconds <= 0) return;
  SFX.click();
  state.timerHandle = setInterval(() => {
    state.timerSeconds -= 1;
    renderTimer();
    if (state.timerSeconds <= 0) {
      stopTimer();
      timerDisplay.classList.add("timer-finished");
      setRoundStatus("\u23f0 \u00a1Tiempo terminado! Pasen a votaci\u00f3n.");
      SFX.alarm();
      setTimeout(() => timerDisplay.classList.remove("timer-finished"), 3000);
    }
  }, 1000);
}

function pauseTimer() { stopTimer(); setRoundStatus("Pausado."); }

function resetTimer() {
  stopTimer();
  state.timerSeconds = state.timerTotalSeconds;
  timerDisplay.classList.remove("timer-urgent", "timer-finished");
  renderTimer();
  setRoundStatus("");
}

// ============= GAME CORE =============
function getPlayerName(playerNumber) {
  if (state.showNames && state.playerNames[playerNumber - 1]) return state.playerNames[playerNumber - 1];
  return `Jugador ${playerNumber}`;
}

function buildRoles(playerCount, impostorCount, whiteCount, secretWord, decoyWord) {
  const roles = [];
  for (let p = 1; p <= playerCount; p += 1) {
    roles.push({ player: p, name: getPlayerName(p), role: "civil", word: secretWord, tip: "Da una pista espec\u00edfica, sin decir la palabra literal." });
  }
  const order = shuffle([...Array(playerCount).keys()]);
  for (let i = 0; i < impostorCount; i += 1) {
    const idx = order[i];
    roles[idx] = { ...roles[idx], role: "impostor", word: decoyWord, tip: "Disimula y detecta qu\u00e9 palabra describen los dem\u00e1s." };
  }
  for (let i = impostorCount; i < impostorCount + whiteCount; i += 1) {
    const idx = order[i];
    roles[idx] = { ...roles[idx], role: "agente fantasma", word: "(sin palabra)", tip: "Improvisa pistas vagas para sobrevivir." };
  }
  return roles;
}

function getThemePool(themeKey, includeAdult) {
  if (themeKey === "aleatorio") {
    return Object.keys(localWords).filter(k => k !== "aleatorio" && (includeAdult || k !== "adulto")).flatMap(k => localWords[k]);
  }
  if (themeKey === "adulto" && !includeAdult) return getThemePool("aleatorio", false);
  return localWords[themeKey] ?? localWords.aleatorio;
}

function getLocalPack(themeKey, includeAdult) {
  const pool = getThemePool(themeKey, includeAdult);
  const pair = pickRandom(pool);
  return { secretWord: pair[0], decoyWord: pair[1], source: "local" };
}

async function createRound() {
  const theme = state.selectedTheme;

  // If we have persistent roles from a previous round in the same game, reuse them
  if (state.persistentRoles) {
    const allRoles = state.persistentRoles;
    const roles = allRoles.filter(r => !state.eliminatedPlayers.includes(r.player));
    if (roles.length < 3) throw new Error("No quedan suficientes jugadores activos (m\u00ednimo 3).");
    return {
      createdAt: new Date().toISOString(),
      theme: state.persistentTheme,
      secretWord: state.persistentSecretWord,
      decoyWord: state.persistentDecoyWord,
      source: "local",
      roles,
      allRoles
    };
  }

  const playerCount = Number(playersInput.value);
  const impostorCount = Number(impostorsInput.value);
  const whiteCount = state.showAdvanced ? Number(whitesInput.value) : 0;

  if (playerCount < 3 || playerCount > 24) throw new Error("Jugadores fuera de rango (3-24).");
  if (impostorCount < 1 || impostorCount > 3) throw new Error("Configura entre 1 y 3 impostores.");
  if (whiteCount < 0 || whiteCount > 2) throw new Error("Fantasma entre 0 y 2.");
  if (impostorCount + whiteCount >= playerCount) throw new Error("Impostores + fantasmas debe ser menor que jugadores.");

  const pack = getLocalPack(theme, state.includeAdultTheme);
  const allRoles = buildRoles(playerCount, impostorCount, whiteCount, pack.secretWord, pack.decoyWord);
  state.persistentRoles = allRoles;
  state.persistentSecretWord = pack.secretWord;
  state.persistentDecoyWord = pack.decoyWord;
  state.persistentTheme = theme;
  const roles = allRoles.filter(r => !state.eliminatedPlayers.includes(r.player));
  return { createdAt: new Date().toISOString(), theme, ...pack, roles, allRoles };
}

// ============= DEAL / REVEAL FLOW =============
function getRoleEmoji(role) {
  return role === "impostor" ? "\ud83d\udd75\ufe0f" : role === "agente fantasma" ? "\ud83d\udc7b" : "\ud83d\udc64";
}

function showCurrentPlayerPrompt() {
  const cur = state.revealIndex + 1;
  const tot = state.round.roles.length;
  dealHint.textContent = `Pasa el celular a ${state.round.roles[state.revealIndex].name} (${cur} de ${tot}).`;
  updateDealProgress();
}

function renderRoleCard() {
  const item = state.round.roles[state.revealIndex];
  const roleName = item.role === "agente fantasma" ? "Fantasma" : item.role;
  roleCard.innerHTML = `
    <span class="role-emoji">${getRoleEmoji(item.role)}</span>
    <h3 class="role-name">${escapeHtml(item.name)} \u00b7 ${escapeHtml(roleName)}</h3>
    <p class="role-word">${escapeHtml(item.word)}</p>
    <p class="role-tip">${escapeHtml(item.tip)}</p>
  `;
}

function showHandoffScreen() {
  handoffScreen.classList.remove("hidden");
  swipeScreen.classList.add("hidden");
  nextBtn.classList.add("hidden");
  coverBtn.classList.add("hidden");
  state.roleIsVisible = false;
  roleCard.innerHTML = "";
  resetOverlayPosition();
  showCurrentPlayerPrompt();
}

function showSwipeScreen() {
  // Don't render role yet — defer until swipe to prevent DOM inspection leak
  roleCard.innerHTML = '<p style="opacity:.35;font-size:.95rem">Desliza para ver tu rol</p>';
  handoffScreen.classList.add("hidden");
  swipeScreen.classList.remove("hidden");
  nextBtn.classList.add("hidden");
  coverBtn.classList.add("hidden");
  state.roleIsVisible = false;
  resetOverlayPosition();
}

function revealRoleFully() {
  // Render role content NOW, right before revealing
  renderRoleCard();
  const h = swipeTrack.getBoundingClientRect().height;
  revealOverlay.style.transition = "transform 0.2s ease";
  revealOverlay.style.transform = `translateY(-${h}px)`;
  revealOverlay.style.opacity = "0";
  state.swipeOffset = h;
  state.roleIsVisible = true;
  nextBtn.classList.remove("hidden");
  coverBtn.classList.remove("hidden");
  SFX.reveal();
  if (navigator.vibrate) navigator.vibrate(20);
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
  const h = swipeTrack.getBoundingClientRect().height;
  const base = Math.max(120, Math.min(220, Math.floor(h * 0.42)));
  const mult = state.swipeSensitivity === "estricto" ? 1.2 : state.swipeSensitivity === "normal" ? 1 : 0.78;
  return Math.round(base * mult);
}

function setSwipeSensitivity(level) {
  state.swipeSensitivity = level;
  for (const b of swipeLevelButtons) b.classList.toggle("active", b.dataset.swipeLevel === level);
}

function onSwipeStart(clientX, clientY, pointerId = null) {
  if (state.roleIsVisible) return;
  state.swipeStartX = clientX; state.swipeStartY = clientY;
  state.swipeDragging = true; state.swipePointerId = pointerId;
  state.swipeAxisLocked = false; state.swipeVerticalGesture = false;
  revealOverlay.style.transition = "none";
}

function onSwipeMove(clientX, clientY) {
  if (!state.swipeDragging || state.roleIsVisible) return;
  const dY = state.swipeStartY - clientY;
  const dX = Math.abs(state.swipeStartX - clientX);
  if (!state.swipeAxisLocked) {
    if (Math.abs(dY) < 10 && dX < 10) return;
    state.swipeAxisLocked = true;
    state.swipeVerticalGesture = Math.abs(dY) > dX;
  }
  if (!state.swipeVerticalGesture) return;
  const delta = Math.max(0, state.swipeStartY - clientY);
  const maxH = swipeTrack.getBoundingClientRect().height;
  const offset = Math.min(delta, maxH);
  state.swipeOffset = offset;
  revealOverlay.style.transform = `translateY(-${offset}px)`;
  revealOverlay.style.opacity = String(1 - Math.min(1, offset / maxH) * 0.85);
}

function onSwipeEnd() {
  if (!state.swipeDragging || state.roleIsVisible) return;
  state.swipeDragging = false;
  if (state.swipeVerticalGesture && state.swipeOffset >= getSwipeThreshold()) revealRoleFully();
  else resetOverlayPosition();
}

function goNextPlayer() {
  if (!state.round || !state.roleIsVisible) return;
  SFX.cardFlip();
  state.revealIndex += 1;
  state.roleIsVisible = false;
  if (state.revealIndex >= state.round.roles.length) {
    dealSection.classList.add("hidden");
    roundSection.classList.remove("hidden");
    setGamePhase("debate");
    gameProgressBar.style.width = "100%";
    buildVoteUI();
    updateAliveStatus();
    setRoundPhase("debate");
    resetTimer();
    return;
  }
  showHandoffScreen();
}

// ============= ALIVE STATUS =============
function updateAliveStatus() {
  if (!aliveStatus) return;
  if (!state.persistentRoles || state.eliminatedPlayers.length === 0) {
    aliveStatus.classList.add("hidden");
    return;
  }
  const total = state.persistentRoles.length;
  const alive = total - state.eliminatedPlayers.length;
  const eliminated = state.eliminatedPlayers.length;
  aliveStatus.classList.remove("hidden");
  aliveStatus.innerHTML = `<span>\ud83d\udc65 <strong>${alive}</strong> jugadores vivos</span><span>\u274c <strong>${eliminated}</strong> eliminado${eliminated > 1 ? "s" : ""}</span>`;
}

// ============= VOTING (card-based — tap to eliminate) =============
function buildVoteUI() {
  if (!state.round) return;
  voteList.innerHTML = "";
  // Remove old eliminated badge
  const oldBadge = document.querySelector(".eliminated-badge");
  if (oldBadge) oldBadge.remove();
  voteResult.classList.add("hidden");
  voteResult.innerHTML = "";
  state.voteTally = {};
  state.votedPlayer = null;

  const avatarColors = ["#6c5ce7","#00cec9","#e17055","#fdcb6e","#74b9ff","#a29bfe","#55efc4","#ff7675","#fab1a0","#81ecec"];
  const avatarEmojis = ["\ud83d\ude0e","\ud83e\udd29","\ud83d\ude08","\ud83e\udd14","\ud83d\ude0f","\ud83e\uddd0","\ud83d\ude0d","\ud83e\udd2b","\ud83d\ude1c","\ud83d\ude44"];

  // Show eliminated count if any
  if (state.eliminatedPlayers.length > 0) {
    const badge = document.createElement("div");
    badge.className = "eliminated-badge";
    badge.innerHTML = `\ud83d\udea8 <strong>${state.eliminatedPlayers.length}</strong> eliminado${state.eliminatedPlayers.length > 1 ? "s" : ""} \u2022 ${state.round.roles.length} jugadores restantes`;
    voteList.parentElement.insertBefore(badge, voteList);
  }

  for (let i = 0; i < state.round.roles.length; i++) {
    const role = state.round.roles[i];
    state.voteTally[role.player] = 0;

    const card = document.createElement("button");
    card.type = "button";
    card.className = "vote-player-card";
    card.dataset.player = role.player;

    const avatar = document.createElement("div");
    avatar.className = "vote-avatar";
    avatar.style.background = avatarColors[i % avatarColors.length];
    avatar.textContent = avatarEmojis[i % avatarEmojis.length];

    const name = document.createElement("span");
    name.className = "vote-card-name";
    name.textContent = role.name;

    card.appendChild(avatar);
    card.appendChild(name);

    card.addEventListener("click", () => {
      if (state.votedPlayer !== null) return;
      selectPlayerToEliminate(role, card);
    });

    voteList.appendChild(card);
  }
}

function selectPlayerToEliminate(selectedRole, selectedCard) {
  if (!state.round) return;
  if (!confirm(`\u00bfEliminar a ${selectedRole.name}? Esta acci\u00f3n es definitiva.`)) return;

  state.votedPlayer = selectedRole.player;
  state.voteTally[selectedRole.player] = 1;
  state.eliminatedPlayers.push(selectedRole.player);
  SFX.click();

  // Hide "back to debate" after casting vote
  if (backToDebateBtn) backToDebateBtn.classList.add("hidden");

  // Dramatic elimination animation
  const allCards = voteList.querySelectorAll(".vote-player-card");
  allCards.forEach(c => {
    if (c.dataset.player === String(selectedRole.player)) {
      c.classList.add("vote-eliminating");
    } else {
      c.classList.add("vote-others-fade");
    }
  });

  // Add to round history
  const isImpostor = selectedRole.role === "impostor";
  addRoundHistoryEntry(state.roundNumber, selectedRole.name, selectedRole.role, isImpostor);

  // Show result after elimination animation completes
  setTimeout(() => {
    voteResult.classList.remove("hidden");

    if (isImpostor) {
      // Check if more impostors remain
      const remainingImps = state.persistentRoles
        ? state.persistentRoles.filter(r => r.role === "impostor" && !state.eliminatedPlayers.includes(r.player)).length
        : 0;
      SFX.fanfare();
      launchConfetti();
      const subtitle = remainingImps > 0
        ? `\u00a1Bien hecho! Pero quedan <strong>${remainingImps}</strong> impostor${remainingImps > 1 ? "es" : ""} m\u00e1s... \ud83d\udd75\ufe0f`
        : "Los civiles ganan \ud83c\udfc6";
      voteResult.innerHTML = `
        <div class="vote-reveal-card vote-reveal-success">
          <div class="vote-reveal-emoji">\ud83c\udf89</div>
          <h3>\u00a1Correcto!</h3>
          <p><strong>${escapeHtml(selectedRole.name)}</strong> ERA impostor</p>
          <div class="vote-reveal-words">
            <span class="vote-word-civil">\ud83d\udfe2 Civiles: <strong>${escapeHtml(state.round.secretWord)}</strong></span>
            <span class="vote-word-imp">\ud83d\udd34 Impostor: <strong>${escapeHtml(state.round.decoyWord)}</strong></span>
          </div>
          <p class="vote-reveal-subtitle">${subtitle}</p>
        </div>`;
    } else {
      SFX.click();
      voteResult.innerHTML = `
        <div class="vote-reveal-card vote-reveal-fail">
          <div class="vote-reveal-emoji">\ud83d\ude31</div>
          <h3>\u00a1Incorrecto!</h3>
          <p><strong>${escapeHtml(selectedRole.name)}</strong> NO era el impostor</p>
          <p class="vote-reveal-subtitle">El impostor sigue libre... \ud83d\udd75\ufe0f</p>
        </div>`;
    }

    // Check game-over condition
    const gameOverResult = checkGameOver();
    if (gameOverResult) {
      setTimeout(() => showGameOver(gameOverResult), 1800);
    } else {
      // Game continues — add "Siguiente ronda" button after a brief pause
      setTimeout(() => {
        const nextBtn = document.createElement("button");
        nextBtn.type = "button";
        nextBtn.className = "btn-primary next-round-btn";
        nextBtn.innerHTML = "\u27a1\ufe0f Siguiente ronda";
        nextBtn.addEventListener("click", () => startNextRound());
        const card = voteResult.querySelector(".vote-reveal-card");
        if (card) card.appendChild(nextBtn);
      }, 1200);
    }
  }, 900);
}

// ============= NEXT ROUND (persistent game, no re-deal) =============
function startNextRound() {
  stopTimer();

  // Reset vote state for next round
  state.voteTally = {};
  state.votedPlayer = null;
  state.timerSeconds = state.timerTotalSeconds;
  state.roundNumber += 1;

  // Rebuild round with remaining players (same words/roles)
  const allRoles = state.persistentRoles;
  const roles = allRoles.filter(r => !state.eliminatedPlayers.includes(r.player));
  state.round = {
    createdAt: new Date().toISOString(),
    theme: state.persistentTheme,
    secretWord: state.persistentSecretWord,
    decoyWord: state.persistentDecoyWord,
    source: "local",
    roles,
    allRoles
  };

  // Update UI
  if (roundNumberEl) roundNumberEl.textContent = state.roundNumber;
  voteList.innerHTML = "";
  voteResult.classList.add("hidden");
  voteResult.innerHTML = "";
  // Remove old eliminated badge
  const oldBadge = document.querySelector(".eliminated-badge");
  if (oldBadge) oldBadge.remove();
  timerDisplay.classList.remove("timer-urgent", "timer-finished");
  setRoundStatus("");
  renderTimer();
  buildVoteUI();
  updateAliveStatus();
  setRoundPhase("debate");

  // Re-show "back to debate" button for next round
  if (backToDebateBtn) backToDebateBtn.classList.remove("hidden");

  SFX.click();
  showToast(`Ronda ${state.roundNumber} \u2014 \u00a1A debatir!`);
}

// ============= ROUND HISTORY =============
function addRoundHistoryEntry(roundNum, playerName, role, wasImpostor) {
  const entry = { roundNum, playerName, role, wasImpostor };
  state.roundHistory.push(entry);
  renderRoundHistory();
}

function renderRoundHistory() {
  if (!roundHistoryLog || !roundHistoryList) return;
  if (state.roundHistory.length === 0) {
    roundHistoryLog.classList.add("hidden");
    return;
  }
  roundHistoryLog.classList.remove("hidden");
  roundHistoryList.innerHTML = state.roundHistory.map(e => {
    const cls = e.wasImpostor ? "log-success" : "log-fail";
    const icon = e.wasImpostor ? "\ud83c\udf89" : "\ud83d\udeab";
    const roleLabel = e.role === "impostor" ? "impostor" : e.role === "agente fantasma" ? "fantasma" : "civil";
    return `<div class="history-log-entry ${cls}"><span class="history-log-round">Ronda ${e.roundNum}</span><span>${icon} Eliminaron a <strong>${escapeHtml(e.playerName)}</strong> (${roleLabel})</span></div>`;
  }).join("");
}

// ============= GAME OVER DETECTION =============
function checkGameOver() {
  if (!state.persistentRoles) return null;
  const alive = state.persistentRoles.filter(r => !state.eliminatedPlayers.includes(r.player));
  const aliveImpostors = alive.filter(r => r.role === "impostor");
  const aliveCivils = alive.filter(r => r.role !== "impostor");

  if (aliveImpostors.length === 0) {
    return { winner: "civils", rounds: state.roundNumber, eliminated: state.eliminatedPlayers.length, totalPlayers: state.persistentRoles.length };
  }
  if (aliveImpostors.length >= aliveCivils.length) {
    return { winner: "impostor", rounds: state.roundNumber, eliminated: state.eliminatedPlayers.length, totalPlayers: state.persistentRoles.length };
  }
  if (alive.length < 3) {
    return aliveImpostors.length > 0
      ? { winner: "impostor", rounds: state.roundNumber, eliminated: state.eliminatedPlayers.length, totalPlayers: state.persistentRoles.length }
      : { winner: "civils", rounds: state.roundNumber, eliminated: state.eliminatedPlayers.length, totalPlayers: state.persistentRoles.length };
  }
  return null;
}

function showGameOver(result) {
  state.gameOver = true;
  setRoundPhase("result");

  // Add game-over entry to history
  const histEntry = document.createElement("div");
  histEntry.className = "history-log-entry log-gameover";
  histEntry.innerHTML = result.winner === "civils"
    ? `<span>\ud83c\udfc6 \u00a1Partida terminada! Los civiles ganaron en ${result.rounds} rondas</span>`
    : `<span>\ud83d\udd75\ufe0f \u00a1Partida terminada! El impostor sobrevivi\u00f3 tras ${result.rounds} rondas</span>`;
  if (roundHistoryList) roundHistoryList.appendChild(histEntry);

  // Show game-over panel
  if (gameOverPanel && gameOverContent) {
    gameOverPanel.classList.remove("hidden");
    const cls = result.winner === "civils" ? "civils-win" : "impostor-win";
    gameOverContent.className = `game-over-content ${cls}`;

    if (result.winner === "civils") {
      SFX.fanfare();
      launchConfetti();
      setTimeout(() => launchConfetti(), 800);
      gameOverContent.innerHTML = `
        <div class="game-over-emoji">\ud83c\udfc6</div>
        <h2 class="game-over-title">\u00a1Civiles ganan!</h2>
        <p class="game-over-subtitle">Todos los impostores fueron descubiertos</p>
        <div class="game-over-stats">
          <div class="game-over-stat"><span class="game-over-stat-value">${result.rounds}</span><span class="game-over-stat-label">Rondas</span></div>
          <div class="game-over-stat"><span class="game-over-stat-value">${result.eliminated}</span><span class="game-over-stat-label">Eliminados</span></div>
          <div class="game-over-stat"><span class="game-over-stat-value">${result.totalPlayers}</span><span class="game-over-stat-label">Jugadores</span></div>
        </div>`;
    } else {
      SFX.alarm();
      gameOverContent.innerHTML = `
        <div class="game-over-emoji">\ud83d\udd75\ufe0f</div>
        <h2 class="game-over-title">\u00a1El impostor gana!</h2>
        <p class="game-over-subtitle">Los impostores superaron a los civiles</p>
        <div class="game-over-stats">
          <div class="game-over-stat"><span class="game-over-stat-value">${result.rounds}</span><span class="game-over-stat-label">Rondas</span></div>
          <div class="game-over-stat"><span class="game-over-stat-value">${result.eliminated}</span><span class="game-over-stat-label">Eliminados</span></div>
          <div class="game-over-stat"><span class="game-over-stat-value">${result.totalPlayers}</span><span class="game-over-stat-label">Jugadores</span></div>
        </div>`;
    }
  }

  // Disable "Nueva ronda" when game is over, show "Nueva partida" instead
  if (newRoundBtn) newRoundBtn.classList.add("hidden");
  // Change backHomeBtn text to "Nueva partida"
  if (backHomeBtn) {
    backHomeBtn.textContent = "\ud83c\udfae Nueva partida";
    backHomeBtn.classList.add("new-game-btn");
  }
}

// ============= ROUND PHASE NAVIGATION =============
function setRoundPhase(phase) {
  state.roundPhase = phase;
  if (debatePhase) debatePhase.classList.toggle("hidden", phase !== "debate");
  if (votePhase) votePhase.classList.toggle("hidden", phase !== "vote");
  if (resultPhase) resultPhase.classList.toggle("hidden", phase !== "result");

  // Update step indicators
  const steps = ["debate", "vote", "result"];
  const activeIdx = steps.indexOf(phase);
  roundSteps.forEach((step, i) => {
    step.classList.remove("active", "done");
    if (i === activeIdx) step.classList.add("active");
    else if (i < activeIdx) step.classList.add("done");
  });
}

// ============= REVEAL FINAL =============
function revealFinal() {
  if (!state.round) return;
  if (!finalResult.classList.contains("hidden")) return;
  if (!confirm("\u00bfSeguro? Esto revelar\u00e1 qui\u00e9n es el impostor a todos.")) return;

  const themeLabel = themes.find(t => t.key === state.round.theme)?.label || state.round.theme;
  const votedP = state.votedPlayer;
  const votedRole = votedP !== null ? state.round.roles.find(r => r.player === votedP) : null;
  const civilsWin = votedRole?.role === "impostor";

  let banner = "";
  if (votedP !== null) {
    banner = civilsWin
      ? `<div class="winner-banner winner-civils">\ud83c\udf89 \u00a1Los civiles ganaron! Descubrieron al impostor.</div>`
      : `<div class="winner-banner winner-impostor">\ud83d\udd75\ufe0f \u00a1El impostor sobrevivi\u00f3! Los civiles fallaron.</div>`;
  }

  const rows = (state.round.allRoles || state.round.roles).map(item => {
    const cssRole = item.role === "agente fantasma" ? "fantasma" : item.role;
    const visibleRole = item.role === "agente fantasma" ? "Fantasma" : item.role;
    const wasVoted = item.player === state.votedPlayer;
    const wasEliminated = state.eliminatedPlayers.includes(item.player) && !wasVoted;
    const statusText = wasVoted ? "\ud83d\uddf3\ufe0f Eliminado" : wasEliminated ? "\u274c Eliminado antes" : "";
    return `<div class="result-row ${wasVoted ? 'result-voted' : ''} ${wasEliminated ? 'result-eliminated-prev' : ''}"><span>${escapeHtml(item.name)}</span><span><span class="badge ${cssRole}">${escapeHtml(visibleRole)}</span></span><span>${escapeHtml(item.word)}</span><span>${statusText}</span></div>`;
  }).join("");

  finalResult.innerHTML = `
    ${banner}
    <div class="result-header">
      <span>Jugador</span>
      <span>Rol</span>
      <span>Palabra</span>
      <span>Estado</span>
    </div>
    ${rows}
  `;

  finalResult.classList.remove("hidden");
  if (shareResultBtn) shareResultBtn.classList.remove("hidden");
  recordRound(state.round);
  if (!state.gameOver) {
    SFX.fanfare();
    if (civilsWin) launchConfetti();
  }
}

// ============= GAME SCREEN MANAGEMENT =============
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
  const cur = state.revealIndex + 1;
  const tot = state.round.roles.length;
  gameProgressBar.style.width = `${Math.round((state.revealIndex / tot) * 100)}%`;
  dealCounter.textContent = `${cur} / ${tot}`;
}

function setActiveMenuTab(tab) {
  for (const [btn, key] of [[menuHomeBtn, "home"], [menuPlayBtn, "play"], [menuStatsBtn, "stats"], [menuHelpBtn, "help"]]) {
    if (btn) btn.classList.toggle("active", tab === key);
  }
}

function showMainView(view) {
  menuSection.classList.toggle("hidden", view !== "home");
  controlsSection.classList.toggle("hidden", view !== "play");
  helpSection.classList.toggle("hidden", view !== "help");
  if (statsSection) statsSection.classList.toggle("hidden", view !== "stats");
  setActiveMenuTab(view);
  if (view === "stats") renderStats();
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
    input.type = "text"; input.maxLength = 16;
    input.placeholder = `Jugador ${i}`;
    input.value = state.playerNames[i - 1] || "";
    input.addEventListener("input", () => {
      state.playerNames[i - 1] = input.value.trim();
      saveNames();
    });
    wrapper.appendChild(num);
    wrapper.appendChild(input);
    playerNamesContainer.appendChild(wrapper);
  }
}

// ============= SORTEO ANIMATION =============
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
        setTimeout(() => { sorteoSection.classList.add("hidden"); resolve(); }, 600);
        return;
      }
      cards[revealed].classList.add("sorted");
      cards[revealed].textContent = "\u2713";
      SFX.cardFlip();
      if (navigator.vibrate) navigator.vibrate(10);
      revealed += 1;
    }, 180);
  });
}

// ============= THEME CHIPS =============
function renderThemeChips() {
  themeChips.innerHTML = "";
  const visible = themes.filter(t => !t.adult || state.includeAdultTheme);
  for (const t of visible) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `theme-chip${t.adult ? " adult" : ""}${t.key === state.selectedTheme ? " active" : ""}`;
    chip.textContent = t.label;
    chip.setAttribute("role", "radio");
    chip.setAttribute("aria-checked", String(t.key === state.selectedTheme));
    chip.addEventListener("click", () => { state.selectedTheme = t.key; renderThemeChips(); SFX.click(); });
    themeChips.appendChild(chip);
  }
  if (!visible.some(t => t.key === state.selectedTheme)) {
    state.selectedTheme = "aleatorio";
    renderThemeChips();
  }
}

// ============= RESET =============
function resetRound() {
  stopTimer();
  state.round = null;
  state.revealIndex = 0;
  state.roleIsVisible = false;
  state.timerSeconds = state.timerTotalSeconds;
  state.voteTally = {};
  state.votedPlayer = null;
  state.roundNumber = 0;
  state.roundPhase = "debate";
  state.eliminatedPlayers = [];
  state.gameActive = false;
  state.persistentRoles = null;
  state.persistentSecretWord = "";
  state.persistentDecoyWord = "";
  state.persistentTheme = "";
  state.roundHistory = [];
  state.gameOver = false;
  exitGameMode();
  finalResult.classList.add("hidden");
  // Clean up eliminated badge (lives as sibling of voteList)
  const oldBadge = document.querySelector(".eliminated-badge");
  if (oldBadge) oldBadge.remove();
  voteList.innerHTML = "";
  voteResult.classList.add("hidden");
  voteResult.textContent = "";
  if (shareResultBtn) shareResultBtn.classList.add("hidden");
  if (gameOverPanel) gameOverPanel.classList.add("hidden");
  if (roundHistoryLog) roundHistoryLog.classList.add("hidden");
  if (roundHistoryList) roundHistoryList.innerHTML = "";
  if (newRoundBtn) { newRoundBtn.disabled = false; newRoundBtn.classList.remove("hidden"); }
  if (backHomeBtn) { backHomeBtn.textContent = "\ud83c\udfe0 Volver al inicio"; backHomeBtn.classList.remove("new-game-btn"); }
  // Re-enable config inputs
  playersInput.disabled = false;
  impostorsInput.disabled = false;
  whitesInput.disabled = false;
  timerDisplay.classList.remove("timer-urgent", "timer-finished");
  setRoundStatus("");
  setRoundPhase("debate");
  renderTimer();
  showMainView("home");
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      if (fullscreenBtn) fullscreenBtn.textContent = "\u2715";
    } else {
      await document.exitFullscreen();
      if (fullscreenBtn) fullscreenBtn.textContent = "\u26f6";
    }
  } catch {
    showToast("Pantalla completa no soportada", "error");
  }
}

// ============= EVENT LISTENERS =============
startBtn.addEventListener("click", async () => {
  try {
    startBtn.disabled = true;
    state.round = await createRound();
    state.revealIndex = 0;
    state.roundNumber += 1;
    state.gameActive = true;
    // Lock config inputs once persistent game starts
    if (state.persistentRoles) {
      playersInput.disabled = true;
      impostorsInput.disabled = true;
      whitesInput.disabled = true;
    }
    // Hide "Nueva ronda" during active persistent game
    if (newRoundBtn && state.persistentRoles) newRoundBtn.classList.add("hidden");
    if (roundNumberEl) roundNumberEl.textContent = state.roundNumber;
    finalResult.classList.add("hidden");
    await playSorteoAnimation(state.round.roles);
    enterGameMode();
    dealSection.classList.remove("hidden");
    roundSection.classList.add("hidden");
    gameProgressBar.style.width = "0%";
    showHandoffScreen();
    showToast("\u00a1Ronda creada! A jugar");
  } catch (error) {
    console.error(error);
    showToast(error.message || "No se pudo crear la ronda.", "error");
  } finally {
    startBtn.disabled = false;
  }
});

readyBtn.addEventListener("click", showSwipeScreen);
nextBtn.addEventListener("click", goNextPlayer);
coverBtn.addEventListener("click", coverRoleAgain);

revealOverlay.addEventListener("pointerdown", e => onSwipeStart(e.clientX, e.clientY, e.pointerId));
window.addEventListener("pointermove", e => {
  if (!state.swipeDragging) return;
  if (state.swipePointerId !== null && e.pointerId !== state.swipePointerId) return;
  onSwipeMove(e.clientX, e.clientY);
});
window.addEventListener("pointerup", e => {
  if (!state.swipeDragging) return;
  if (state.swipePointerId !== null && e.pointerId !== state.swipePointerId) return;
  onSwipeEnd();
});
window.addEventListener("pointercancel", () => { if (state.swipeDragging) resetOverlayPosition(); });

revealAllBtn.addEventListener("click", revealFinal);
resetBtn.addEventListener("click", resetRound);

goToVoteBtn.addEventListener("click", () => {
  stopTimer();
  setRoundPhase("vote");
  SFX.click();
});

backToDebateBtn.addEventListener("click", () => {
  if (state.votedPlayer !== null) return;
  setRoundPhase("debate");
  SFX.click();
});

quitGameBtn.addEventListener("click", () => {
  if (state.gameActive && !confirm("\u00bfSeguro que quieres salir? Se perder\u00e1 el progreso de la partida.")) return;
  resetRound();
});

newRoundBtn.addEventListener("click", () => {
  if (state.gameOver) return;
  // In persistent mode, use seamless transition (no re-deal) — only after a vote
  if (state.persistentRoles && state.votedPlayer !== null) {
    startNextRound();
    return;
  }
  if (state.persistentRoles) return; // Don't allow mid-round reset in persistent mode
  // Non-persistent mode: go back to config
  stopTimer();
  state.round = null;
  state.revealIndex = 0;
  state.roleIsVisible = false;
  state.timerSeconds = state.timerTotalSeconds;
  state.voteTally = {};
  state.votedPlayer = null;
  state.roundPhase = "debate";
  exitGameMode();
  finalResult.classList.add("hidden");
  voteList.innerHTML = "";
  voteResult.classList.add("hidden");
  voteResult.textContent = "";
  if (shareResultBtn) shareResultBtn.classList.add("hidden");
  if (gameOverPanel) gameOverPanel.classList.add("hidden");
  timerDisplay.classList.remove("timer-urgent", "timer-finished");
  setRoundStatus("");
  setRoundPhase("debate");
  renderTimer();
  showMainView("play");
});

backHomeBtn.addEventListener("click", () => {
  if (state.gameActive && !confirm("\u00bfVolver al inicio? Se perder\u00e1 la partida actual.")) return;
  resetRound();
});
startTimerBtn.addEventListener("click", startTimer);
pauseTimerBtn.addEventListener("click", pauseTimer);
resetTimerBtn.addEventListener("click", resetTimer);
fullscreenBtn.addEventListener("click", toggleFullscreen);

if (soundToggleBtn) {
  soundToggleBtn.addEventListener("click", () => {
    const on = SFX.toggle();
    soundToggleBtn.textContent = on ? "\ud83d\udd0a" : "\ud83d\udd07";
    showToast(on ? "Sonido activado" : "Sonido desactivado");
  });
  soundToggleBtn.textContent = SFX.enabled ? "\ud83d\udd0a" : "\ud83d\udd07";
}

if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleVisualTheme);
if (shareResultBtn) shareResultBtn.addEventListener("click", shareResult);

for (const b of timerPresetButtons) {
  b.addEventListener("click", () => setTimerMinutes(Number(b.dataset.minutes || 2)));
}

// Custom timer input
const customTimerInput = document.getElementById("customTimerInput");
const setCustomTimerBtn = document.getElementById("setCustomTimerBtn");
if (customTimerInput && setCustomTimerBtn) {
  setCustomTimerBtn.addEventListener("click", () => {
    const mins = Number(customTimerInput.value);
    if (mins >= 1 && mins <= 30) setTimerMinutes(mins);
    else showToast("Ingresa entre 1 y 30 minutos", "error");
  });
}

toggleAdvancedBtn.addEventListener("click", () => {
  state.showAdvanced = !state.showAdvanced;
  advancedOptions.classList.toggle("hidden", !state.showAdvanced);
});

menuHomeBtn.addEventListener("click", () => showMainView("home"));
menuPlayBtn.addEventListener("click", () => showMainView("play"));
menuHelpBtn.addEventListener("click", () => showMainView("help"));
if (menuStatsBtn) menuStatsBtn.addEventListener("click", () => showMainView("stats"));
menuStartBtn.addEventListener("click", () => showMainView("play"));
menuHowToBtn.addEventListener("click", () => showMainView("help"));

toggleNamesBtn.addEventListener("click", () => {
  state.showNames = !state.showNames;
  playerNamesContainer.classList.toggle("hidden", !state.showNames);
  toggleNamesBtn.textContent = state.showNames ? "\u2715 Ocultar nombres" : "\u270f\ufe0f Personalizar nombres";
  if (state.showNames) renderPlayerNameInputs();
});

playersInput.addEventListener("change", () => { if (state.showNames) renderPlayerNameInputs(); });

adultThemesToggle.addEventListener("change", () => {
  state.includeAdultTheme = adultThemesToggle.checked;
  if (!state.includeAdultTheme && state.selectedTheme === "adulto") state.selectedTheme = "aleatorio";
  renderThemeChips();
});

for (const b of swipeLevelButtons) {
  b.addEventListener("click", () => setSwipeSensitivity(b.dataset.swipeLevel || "normal"));
}

if (toggleCustomPacksBtn && customPacksPanel) {
  toggleCustomPacksBtn.addEventListener("click", () => {
    customPacksPanel.classList.toggle("hidden");
    renderCustomPacksList();
  });
}
if (addCustomPackBtn) addCustomPackBtn.addEventListener("click", addCustomPackFromForm);

// ============= INIT =============
applyVisualTheme(localStorage.getItem("impostorTheme") || "dark");
renderThemeChips();
refreshCustomThemes();
setSwipeSensitivity("suave");
renderPlayerNameInputs();
resetRound();
