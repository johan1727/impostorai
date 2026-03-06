import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

try {
  inject();
  injectSpeedInsights();
} catch { }

// ============= PARTICLE BACKGROUND =============
(function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width, height;
  const particles = [];
  const PARTICLE_COUNT = 45;
  const COLORS = [
    "rgba(255, 123, 84, 0.35)",
    "rgba(224, 64, 251, 0.30)",
    "rgba(255, 182, 72, 0.28)",
    "rgba(0, 230, 118, 0.18)",
    "rgba(255, 71, 87, 0.22)"
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
    requestAnimationFrame(animate);
    // Pause animation if in active game (preserves battery)
    if (document.querySelector(".app.in-game")) return;

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
          ctx.strokeStyle = `rgba(255, 140, 90, ${(1 - dist / 120) * 0.08})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
    // (single rAF at top of animate is enough)
  }
  window.addEventListener("resize", resize);
  init(); animate();
})();

// ============= WORD POOLS (~500 pares = 1000+ palabras MX) =============
const localWords = {
  aleatorio: [
    ["volcán", "montaña"], ["wifi", "bluetooth"], ["mango", "papaya"], ["biblioteca", "museo"],
    ["satélite", "cohete"], ["espejo", "ventana"], ["almohada", "cojín"], ["semáforo", "señal"],
    ["anillo", "pulsera"], ["helado", "paleta"], ["mochila", "maleta"], ["lápiz", "pluma"],
    ["tijeras", "cuchillo"], ["planeta", "estrella"], ["tapete", "alfombra"], ["bicicleta", "patineta"],
    ["martillo", "desarmador"], ["cámara", "telescopio"], ["pila", "cargador"], ["cereza", "fresa"],
    ["diamante", "rubí"], ["casco", "sombrero"], ["dado", "moneda"], ["cortina", "persiana"],
    ["chicle", "caramelo"], ["atardecer", "amanecer"], ["cable", "enchufe"], ["llave", "grifo"],
    ["plátano", "manzana"], ["torta", "sándwich"], ["carro", "camioneta"], ["cobija", "sábana"],
    ["calcetín", "zapato"], ["cuchara", "tenedor"], ["banqueta", "calle"], ["nube", "niebla"]
  ],
  comida: [
    ["taco", "burrito"], ["torta", "pambazo"], ["café", "chocolate"], ["sushi", "ramen"],
    ["hamburguesa", "hot dog"], ["pozole", "menudo"], ["empanada", "gordita"], ["concha", "dona"],
    ["ceviche", "aguachile"], ["brownie", "galleta"], ["waffle", "hot cake"], ["helado", "nieve"],
    ["nachos", "quesadilla"], ["mole", "pipián"], ["salmón", "atún"], ["ensalada", "caldo"],
    ["flan", "gelatina"], ["churros", "buñuelos"], ["guacamole", "hummus"], ["salsa verde", "salsa roja"],
    ["papas fritas", "chicharrón"], ["pasta", "fideos"], ["pan", "tortilla"], ["queso", "mantequilla"],
    ["pastel", "pay"], ["tocino", "jamón"], ["arroz", "frijoles"], ["tamal", "elote"],
    ["chilaquiles", "enchiladas"], ["michelada", "clamato"], ["esquite", "palomitas"], ["chile relleno", "chile en nogada"],
    ["birria", "barbacoa"], ["tlayuda", "huarache"], ["agua de horchata", "agua de jamaica"], ["camote", "jícama"]
  ],
  lugares: [
    ["aeropuerto", "terminal"], ["hospital", "clínica"], ["playa", "isla"], ["escuela", "universidad"],
    ["cine", "teatro"], ["parque", "jardín"], ["estadio", "arena"], ["castillo", "palacio"],
    ["súper", "tiendita"], ["restaurante", "fonda"], ["iglesia", "catedral"], ["banco", "oficina"],
    ["estación", "parada"], ["zoológico", "acuario"], ["montaña", "cerro"], ["río", "lago"],
    ["cueva", "túnel"], ["faro", "torre"], ["panteón", "cripta"], ["rancho", "hacienda"],
    ["lobby", "recepción"], ["balcón", "terraza"], ["metro", "metrobús"], ["desierto", "selva"],
    ["volcán", "cráter"], ["cascada", "manantial"], ["puente", "muelle"], ["frontera", "aduana"],
    ["mercado", "tianguis"], ["cantina", "bar"], ["plaza", "zócalo"], ["gasolinera", "taller"],
    ["oxxo", "farmacia"], ["taquería", "puesto"], ["cenote", "balneario"], ["antro", "salón de fiestas"]
  ],
  objetos: [
    ["teclado", "mouse"], ["paraguas", "impermeable"], ["linterna", "vela"], ["reloj", "cronómetro"],
    ["espada", "escudo"], ["llave", "candado"], ["lentes", "lupa"], ["brújula", "mapa"],
    ["guitarra", "ukulele"], ["silla", "banco"], ["cuchara", "tenedor"], ["pincel", "brocha"],
    ["aguja", "alfiler"], ["cadena", "cuerda"], ["antena", "radar"], ["campana", "silbato"],
    ["corona", "tiara"], ["dado", "ficha"], ["escalera", "rampa"], ["guante", "manopla"],
    ["imán", "brújula"], ["maceta", "jarrón"], ["lámpara", "foco"], ["mapa", "globo terráqueo"],
    ["pañuelo", "toalla"], ["escoba", "trapeador"], ["botella", "jarra"], ["sobre", "carpeta"],
    ["control remoto", "pilas"], ["cinturón", "tirantes"], ["encendedor", "cerillos"], ["cartera", "monedero"],
    ["manguera", "regadera"], ["engrapadora", "clips"], ["cinta adhesiva", "pegamento"], ["chamarra", "suéter"]
  ],
  tecnologia: [
    ["nube", "servidor"], ["robot", "dron"], ["python", "javascript"], ["contraseña", "pin"],
    ["pixel", "resolución"], ["wifi", "datos móviles"], ["app", "programa"], ["USB", "HDMI"],
    ["laptop", "tablet"], ["RAM", "disco duro"], ["GPS", "brújula"], ["firewall", "antivirus"],
    ["podcast", "blog"], ["streaming", "descarga"], ["emoji", "sticker"], ["VPN", "proxy"],
    ["cookie", "caché"], ["router", "módem"], ["backup", "respaldo"], ["código QR", "código de barras"],
    ["realidad virtual", "realidad aumentada"], ["inteligencia artificial", "machine learning"],
    ["front-end", "back-end"], ["Linux", "Windows"], ["modo oscuro", "modo claro"],
    ["bluetooth", "NFC"], ["algoritmo", "función"], ["base de datos", "hoja de cálculo"],
    ["captura de pantalla", "grabación"], ["meme", "gif"], ["TikTok", "YouTube"], ["spam", "phishing"],
    ["hashtag", "trending"], ["notificación", "alerta"], ["nube", "drive"], ["lag", "ping"]
  ],
  deportes: [
    ["futbol", "rugby"], ["natación", "waterpolo"], ["tenis", "bádminton"], ["boxeo", "karate"],
    ["basquetbol", "voleibol"], ["golf", "cricket"], ["surf", "windsurf"], ["esquí", "snowboard"],
    ["atletismo", "maratón"], ["ciclismo", "motocross"], ["escalada", "rappel"], ["esgrima", "kendo"],
    ["hockey", "lacrosse"], ["judo", "taekwondo"], ["patinaje", "skateboard"], ["charrería", "equitación"],
    ["béisbol", "softbol"], ["ajedrez", "damas"], ["ping pong", "squash"], ["triatlón", "pentatlón"],
    ["tiro con arco", "tiro"], ["lucha libre", "sumo"], ["remo", "kayak"], ["parkour", "calistenia"],
    ["buceo", "snorkel"], ["boliche", "billar"], ["CrossFit", "yoga"], ["boxeo", "MMA"],
    ["frontón", "raquetbol"], ["clavados", "nado sincronizado"], ["fútbol americano", "flag football"],
    ["corrida", "jaripeo"], ["penal", "tiro libre"], ["cascarita", "reta"], ["gol", "touchdown"], ["porra", "barra"]
  ],
  animales: [
    ["gato", "león"], ["águila", "halcón"], ["delfín", "tiburón"], ["abeja", "avispa"],
    ["perro", "lobo"], ["caballo", "cebra"], ["oso", "panda"], ["serpiente", "lagartija"],
    ["conejo", "liebre"], ["loro", "guacamaya"], ["rana", "sapo"], ["hormiga", "termita"],
    ["vaca", "búfalo"], ["pingüino", "foca"], ["murciélago", "búho"], ["mariposa", "polilla"],
    ["camaleón", "iguana"], ["cuervo", "paloma"], ["pulpo", "calamar"], ["tortuga", "cocodrilo"],
    ["zorro", "coyote"], ["ballena", "orca"], ["medusa", "anémona"], ["cangrejo", "langosta"],
    ["gorila", "chimpancé"], ["jirafa", "avestruz"], ["pavo real", "flamenco"], ["rata", "hámster"],
    ["tlacuache", "mapache"], ["ajolote", "salamandra"], ["colibrí", "golondrina"], ["armadillo", "puercoespín"],
    ["chapulín", "grillo"], ["guajolote", "gallina"], ["xoloitzcuintle", "chihuahua"], ["quetzal", "tucán"]
  ],
  profesiones: [
    ["doctor", "enfermero"], ["abogado", "juez"], ["chef", "pastelero"], ["piloto", "astronauta"],
    ["bombero", "policía"], ["profe", "tutor"], ["arquitecto", "ingeniero"], ["periodista", "editor"],
    ["músico", "cantante"], ["fotógrafo", "camarógrafo"], ["diseñador", "ilustrador"], ["veterinario", "biólogo"],
    ["electricista", "plomero"], ["psicólogo", "psiquiatra"], ["programador", "hacker"], ["detective", "espía"],
    ["carpintero", "albañil"], ["dentista", "ortodoncista"], ["farmacéutico", "químico"], ["actor", "comediante"],
    ["escultor", "pintor"], ["soldado", "marinero"], ["mecánico", "técnico"], ["narrador", "escritor"],
    ["cirujano", "anestesiólogo"], ["mesero", "bartender"], ["cartero", "mensajero"], ["jardinero", "agricultor"],
    ["influencer", "youtuber"], ["locutor", "conductor de TV"], ["chofer", "taxista"], ["estilista", "barbero"],
    ["taquero", "panadero"], ["herrero", "soldador"], ["partera", "doula"], ["chamán", "curandero"]
  ],
  peliculas: [
    ["terror", "suspenso"], ["comedia", "parodia"], ["Marvel", "DC"], ["Pixar", "DreamWorks"],
    ["ciencia ficción", "fantasía"], ["drama", "romance"], ["acción", "aventura"], ["anime", "caricatura"],
    ["documental", "biopic"], ["western", "noir"], ["zombie", "vampiro"], ["precuela", "secuela"],
    ["director", "productor"], ["actor", "doble"], ["guion", "storyboard"], ["taquilla", "streaming"],
    ["palomitas", "nachos"], ["subtítulos", "doblaje"], ["tráiler", "teaser"], ["IMAX", "3D"],
    ["Óscar", "Golden Globe"], ["remake", "reboot"], ["Star Wars", "Star Trek"],
    ["Harry Potter", "Señor de los Anillos"], ["Batman", "Superman"], ["Avengers", "Justice League"],
    ["Netflix", "Disney Plus"], ["thriller", "misterio"], ["villano", "héroe"], ["saga", "trilogía"],
    ["serie", "telenovela"], ["trama", "spoiler"], ["cámara lenta", "time lapse"], ["CGI", "efectos prácticos"]
  ],
  musica: [
    ["guitarra", "bajo"], ["reggaetón", "trap"], ["piano", "órgano"], ["rock", "punk"],
    ["rap", "hip hop"], ["salsa", "cumbia"], ["violín", "viola"], ["jazz", "blues"],
    ["electrónica", "techno"], ["ópera", "musical"], ["batería", "percusión"], ["flauta", "clarinete"],
    ["arpa", "cítara"], ["acordeón", "bandoneón"], ["disco", "funk"], ["metal", "grunge"],
    ["mariachi", "norteña"], ["reggae", "ska"], ["K-pop", "J-pop"], ["coro", "a cappella"],
    ["DJ", "productor"], ["vinilo", "casete"], ["concierto", "festival"], ["single", "álbum"],
    ["estribillo", "verso"], ["balada", "bolero"], ["pop", "indie"], ["country", "folk"],
    ["corrido", "banda"], ["son jarocho", "huapango"], ["ranchera", "sierreña"], ["perreo", "dembow"],
    ["chilena", "son cubano"], ["vals", "danzón"], ["karaoke", "dueto"], ["mashup", "remix"]
  ],
  historia: [
    ["Egipto", "Roma"], ["revolución", "independencia"], ["medieval", "renacimiento"], ["samurái", "ninja"],
    ["vikingo", "pirata"], ["colonia", "imperio"], ["faraón", "emperador"], ["gladiador", "espartano"],
    ["cruzada", "conquista"], ["monarquía", "república"], ["feudo", "castillo"], ["pergamino", "papiro"],
    ["caballero", "templario"], ["azteca", "maya"], ["inca", "olmeca"], ["muralla china", "pirámide"],
    ["espada", "catapulta"], ["bronce", "hierro"], ["Napoleón", "Julio César"], ["democracia", "dictadura"],
    ["prehistoria", "antigüedad"], ["guerra fría", "guerra mundial"], ["esclavitud", "abolición"],
    ["invención", "descubrimiento"], ["filosofía", "mitología"], ["Cleopatra", "Nefertiti"],
    ["tratado", "alianza"], ["armadura", "escudo"], ["Zapata", "Villa"], ["águila", "serpiente"],
    ["Tenochtitlan", "Tlatelolco"], ["códice", "jeroglífico"], ["Moctezuma", "Cuauhtémoc"],
    ["virrey", "caudillo"], ["hacienda", "encomienda"], ["grito de Dolores", "Plan de Iguala"]
  ],
  naturaleza: [
    ["volcán", "géiser"], ["tsunami", "huracán"], ["bosque", "selva"], ["río", "cascada"],
    ["aurora boreal", "arcoíris"], ["terremoto", "avalancha"], ["coral", "alga"], ["montaña", "acantilado"],
    ["desierto", "tundra"], ["manglar", "pantano"], ["rayo", "trueno"], ["tornado", "tifón"],
    ["glaciar", "iceberg"], ["cueva", "gruta"], ["estalagmita", "estalactita"], ["oasis", "manantial"],
    ["luna", "sol"], ["cometa", "asteroide"], ["fósil", "ámbar"], ["cristal", "mineral"],
    ["arena", "grava"], ["musgo", "liquen"], ["miel", "cera"], ["polen", "néctar"],
    ["raíz", "tronco"], ["hoja", "pétalo"], ["semilla", "brote"], ["marea", "corriente"],
    ["cenote", "lago"], ["nopal", "maguey"], ["ceiba", "ahuehuete"], ["jaguar", "puma"],
    ["chapulín", "escarabajo"], ["obsidiana", "jade"], ["cempasúchil", "nochebuena"], ["milpa", "chinampa"]
  ],
  adulto: [
    // — Apps y ligue digital —
    ["Tinder", "Bumble"], ["ghostear", "clavar el visto"], ["friendzone", "situationship"],
    ["catfish", "perfil falso"], ["sexting", "nudes"], ["stalkear", "espiar"], ["match", "swipe"],
    ["sugar daddy", "sugar mommy"], ["sugar baby", "mantenido"], ["OnlyFans", "Patreon"],
    // — Ligue y faje —
    ["ligue", "faje"], ["tirar rollo", "chamuyar"], ["crush", "pretendiente"],
    ["amigos con derechos", "quedantes"], ["free", "one night stand"], ["acostar", "enrollarse"],
    ["calentón", "manoseo"], ["besarse", "fajarse"], ["ligar", "seducir"], ["coqueteo", "cotorreo"],
    // — Peda y fiesta —
    ["cruda", "resaca"], ["peda", "reventón"], ["chela", "shot"], ["mezcal", "tequila"],
    ["jarra", "caguama"], ["precopeo", "after"], ["pedote", "hasta atrás"],
    ["vomitar", "cruzado"], ["juego de shots", "verdad o reto"],
    // — Antro y perreo —
    ["antro", "table"], ["perrear", "sandunguear"], ["reggaetón", "dembow"],
    ["stripper", "pole dance"], ["VIP", "mesa de botellas"], ["cadenero", "bouncer"],
    ["hora feliz", "barra libre"], ["darketo", "emo"],
    // — Relaciones y drama —
    ["tóxico", "posesivo"], ["celos", "inseguridad"], ["ex", "rebote"], ["cuernos", "engaño"],
    ["tusa", "despecho"], ["novio", "amante"], ["relación abierta", "poliamor"],
    ["drama", "escándalo"], ["red flag", "bandera roja"],
    // — Cuerpo y atracción —
    ["mamado", "trabado"], ["nalgón", "culón"], ["chichis", "bubis"],
    ["cachondo", "caliente"], ["piropo", "acoso"], ["encuerado", "desnudo"],
    ["pompis", "retaguardia"], ["abdomen", "cuadritos"],
    // — Picante y tabú —
    ["pecado", "prohibido"], ["morbo", "antojo"], ["fetiche", "fantasía"],
    ["lujuria", "pasión"], ["travesura", "aventura"], ["vibrador", "juguete"],
    ["rol", "disfraz"], ["voyeur", "exhibicionista"], ["sumiso", "dominante"],
    // — Albures y doble sentido MX —
    ["chile", "picante"], ["albur", "doble sentido"], ["fierro", "macizo"],
    ["panocha", "papaya"], ["elote", "mazorca"], ["chorizo", "salchicha"],
    // — Vergüenzas y desmadre —
    ["oso", "vergüenza"], ["desmadre", "locura"], ["pack", "candente"],
    ["chisme", "secreto"], ["calentura", "maña"], ["desinhibido", "lanzado"],
    ["resbalosa", "atrevida"], ["infidelidad", "desliz"],
    // — Agregados recientes (+18 MX) —
    ["rapidín", "mañanero"], ["motel", "hotel de paso"], ["tanga", "hilo dental"],
    ["cruda moral", "arrepentimiento"], ["beso de tres", "trío"],
    ["arrimón", "faje en público"], ["condón", "preservativo"],
    ["orgía", "fiesta swinger"], ["consolador", "vibrador"], ["juguete sexual", "lubricante"],
    // — Más explícitos / argot (+18 MX) —
    ["cariñosas", "prostis"], ["chaqueta", "puñeta"], ["mamada", "chupada"],
    ["perrito", "de chivito"], ["el chiquito", "el nudo de globo"],
    ["venirse", "terminar"], ["coger", "tirar"], ["erección", "palo"],
    ["orgasmo", "clímax"], ["putero", "congal"], ["chupetón", "marca"],
    ["madurita", "milf"], ["nalgada", "cachetada"], ["bajar por los chescos", "comer pancho"],
    ["BDSM", "sado"]
  ],
  peda: [
    // Alcohol & Antro
    ["Tequila", "Mezcal"], ["Cerveza", "Caguama"], ["Vodka", "Ron"], ["Shot", "Fondo"],
    ["Borracho", "Crudo"], ["Cantina", "Antro"], ["Cocktail", "Michelada"], ["Azulito", "Gomichela"],
    ["Precopeo", "After"], ["Cadenero", "Bouncer"], ["Brindis", "Salud"], ["Descorchar", "Destapar"],
    ["Margarita", "Paloma"], ["Hielo", "Vaso"], ["Barman", "Mesero"], ["Six pack", "Cartón"],
    // Juegos y Fiestas
    ["Yo nunca nunca", "Verdad o Reto"], ["Botella", "Ruleta"], ["Castigo", "Prenda"], ["Shot de castigo", "Trago de cortesía"],
    ["Beso de tres", "Trío"], ["Faje", "Arrimón"], ["Perreo", "Reguetón"], ["DJ", "Bocina"],
    ["Karaoke", "Micrófono"], ["Piñata", "Pastel"], ["Botana", "Cacahuates"], ["Bailar", "Cantar"],
    ["Vomitar", "Mala copa"], ["Cruda moral", "Arrepentimiento"], ["Borrachera", "Peda"], ["Jarana", "Reventón"],
    // Salseo y Romance Picante
    ["Ex", "Casio"], ["Tóxico", "Celoso"], ["Cuernos", "Infidelidad"], ["Friendzone", "Situationship"],
    ["Amigos con derechos", "Quedantes"], ["Nudes", "Pack"], ["OnlyFans", "Sugar Daddy"], ["Motel", "Auto"],
    ["Chupetón", "Mordida"], ["Ligue", "Crush"], ["Declaración", "Batear"], ["Beso", "Agarrón"],
    ["Mensaje de ebrio", "Llamada a las 3 AM"], ["Visto", "Ghostear"], ["Tinder", "Cita a ciegas"],
    ["Sugarmommy", "MILF"], ["Rapidín", "Mañanero"], ["Atrevido", "Lanzado"], ["Desnudo", "Encuerado"],
    ["Infiel", "Amante"]
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
  { key: "adulto", label: "+18 🔥", adult: true },
  { key: "peda", label: "🍻 Peda", adult: true }
];

// ============= DOM REFS =============
const playersInput = document.getElementById("players");
const categorySection = document.getElementById("categorySection");
const categoryGrid = document.getElementById("categoryGrid");
const backFromCategoryBtn = document.getElementById("backFromCategoryBtn");
const selectedCategoryName = document.getElementById("selectedCategoryName");
const changeCategoryBtn = document.getElementById("changeCategoryBtn");
const btnCreateCustomPackHeader = document.getElementById("btnCreateCustomPackHeader");
const startGameBtn = document.getElementById("startGameBtn");
const backFromSetupBtn = document.getElementById("backFromSetupBtn");
const addPlayerRowBtn = document.getElementById("addPlayerRowBtn");
const minusImpostorBtn = document.getElementById("minusImpostorBtn");
const plusImpostorBtn = document.getElementById("plusImpostorBtn");
const impostorCountDisplay = document.getElementById("impostorCountDisplay");
const btnPlayersCount = document.getElementById("btnPlayersCount");
const impostorsInput = document.getElementById("impostors");
const whitesInput = document.getElementById("whites");
const toggleAdvancedBtn = document.getElementById("toggleAdvancedBtn");
const advancedOptions = document.getElementById("advancedOptions");
const themeChips = document.getElementById("themeChips");
const adultThemesToggle = document.getElementById("adultThemesToggle");
const spanishOnlyToggle = document.getElementById("spanishOnlyToggle");
// statusBox/statusEl don't exist in the new HTML — use safe dummies
const statusBox = { classList: { add() { }, remove() { } } };
const statusEl = { set textContent(_) { } };
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
const startBtn = startGameBtn; // Map to the real HTML id="startGameBtn"
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
  spanishOnly: false,
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
  try { localStorage.setItem(NAMES_KEY, JSON.stringify(state.playerNames)); } catch { }
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
    } catch { }
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

// ============= CUSTOM CONFIRM MODAL =============
function showConfirmModal(message, onAccept) {
  SFX.alarm();
  const overlay = document.createElement("div");
  overlay.className = "confirm-modal-overlay";
  overlay.innerHTML = `
    <div class="confirm-modal">
      <p>${escapeHtml(message)}</p>
      <div class="confirm-actions">
        <button type="button" class="secondary" id="confirmCancelBtn">Cancelar</button>
        <button type="button" class="primary-action" id="confirmAcceptBtn">Aceptar</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const cancelBtn = overlay.querySelector("#confirmCancelBtn");
  const acceptBtn = overlay.querySelector("#confirmAcceptBtn");

  const close = () => {
    SFX.click();
    overlay.remove();
  };

  cancelBtn.addEventListener("click", close);
  acceptBtn.addEventListener("click", () => {
    close();
    onAccept();
  });
}

// ============= SPANISH ONLY INIT =============
(function initSpanishOnly() {
  const lpSpan = localStorage.getItem("impostorSpanishOnly");
  if (lpSpan === "true") {
    state.spanishOnly = true;
    if (spanishOnlyToggle) spanishOnlyToggle.checked = true;
  }
  if (spanishOnlyToggle) {
    spanishOnlyToggle.addEventListener("change", (e) => {
      state.spanishOnly = e.target.checked;
      try { localStorage.setItem("impostorSpanishOnly", String(state.spanishOnly)); } catch { }
      SFX.click();
    });
  }
})();

// ============= TOAST =============
let _toastTimer = null;
function showToast(msg, type = "success") {
  const c = document.getElementById("toastContainer");
  if (!c) return;
  const old = c.querySelector(".toast");
  if (old) old.remove();
  if (_toastTimer) clearTimeout(_toastTimer);
  const icons = { error: "❌", loading: "⏳", success: "✅" };
  const t = document.createElement("div");
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span>${icons[type] || "✅"}</span><span>${escapeHtml(msg)}</span>`;
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
  const cols = ["#ff4757", "#ff7b54", "#00e676", "#ffd600", "#e040fb", "#ff6b81", "#ffab40", "#69f0ae"];
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
function saveStats(s) { try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch { } }
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
    el.innerHTML = '<p class="help-text" style="text-align:center;padding:20px">🎮 Aún no hay partidas. ¡Juega tu primera ronda!</p>';
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
    <h3 class="subsection-title" style="margin-top:12px">Últimas partidas</h3>
    <div class="stats-history">${recent.map(r => `
      <div class="stats-row">
        <span>${escapeHtml(themes.find(t => t.key === r.theme)?.label || r.theme)}</span>
        <span>${escapeHtml(r.secretWord)} / ${escapeHtml(r.decoyWord)}</span>
        <span>${r.playerCount} jug.</span>
      </div>`).join("")}
    </div>
    <button id="clearStatsBtn" type="button" class="link-btn" style="margin-top:8px;color:var(--red)">🗑️ Borrar historial</button>`;
  document.getElementById("clearStatsBtn")?.addEventListener("click", () => {
    if (confirm("¿Borrar todo el historial?")) {
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
function saveCustomPacks(p) { try { localStorage.setItem(CUSTOM_PACKS_KEY, JSON.stringify(p)); } catch { } }
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
    themes.push({ key, label: `📦 ${packs[i].name}`, custom: true });
  }
  renderThemeChips();
  renderCustomPacksList();
}
function renderCustomPacksList() {
  const el = document.getElementById("customPacksList");
  if (!el) return;
  const packs = loadCustomPacks();
  if (!packs.length) { el.innerHTML = '<p class="help-text">No hay packs personalizados.</p>'; return; }
  el.innerHTML = packs.map((p, i) => `<div class="custom-pack-item"><span>📦 ${escapeHtml(p.name)} (${p.pairs.length} pares)</span><button type="button" class="custom-pack-del" data-idx="${i}">✕</button></div>`).join("");
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
  const text = `🕵️‍♂️ IMPOSTOR — Resultado\n━━━━━━━━━━━━━━\n📝 Tema: ${tl}\n👥 Jugadores: ${allRoles.length}\n🎭 Impostor: ${imps}\n🔑 Civiles: ${state.round.secretWord}\n🔀 Señuelo: ${state.round.decoyWord}\n━━━━━━━━━━━━━━`;
  if (navigator.share) {
    try { await navigator.share({ title: "Impostor", text }); } catch { }
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
  try { localStorage.setItem("impostorTheme", next); } catch { }
  SFX.click();
}

// ============= SERVICE WORKER =============
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then((reg) => {
      // Check for updates every 30 min
      setInterval(() => reg.update(), 30 * 60 * 1000);
    }).catch((err) => console.warn("SW registration failed:", err));
  });
}

// ============= PWA INSTALL PROMPT =============
let deferredInstallPrompt = null;
const installBanner = document.getElementById("installBanner");
const installBtn = document.getElementById("installBtn");
const installDismissBtn = document.getElementById("installDismissBtn");
const INSTALL_DISMISSED_KEY = "impostorInstallDismissed";

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
}
function isInStandaloneMode() {
  return window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
}
function isIOSSafari() {
  // True only in real Safari, not Chrome/Firefox/in-app browsers on iOS
  const ua = navigator.userAgent;
  return isIOS() && /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua);
}

// Android / Chrome: capture beforeinstallprompt
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  if (!sessionStorage.getItem(INSTALL_DISMISSED_KEY) && installBanner) {
    installBanner.classList.remove("hidden");
    installBanner.classList.add("install-android");
  }
});

window.addEventListener("appinstalled", () => {
  if (installBanner) installBanner.classList.add("hidden");
  deferredInstallPrompt = null;
  showToast("\u00a1App instalada! \ud83c\udf89");
});

// Show iOS install instructions if applicable
function showIOSInstallHint() {
  if (!isIOS() || isInStandaloneMode()) return;
  if (sessionStorage.getItem(INSTALL_DISMISSED_KEY)) return;
  if (!installBanner) return;

  // Update instructions text based on browser
  const iosText = installBanner.querySelector(".install-ios-text");
  if (iosText) {
    if (isIOSSafari()) {
      iosText.innerHTML = 'Toca <strong>Compartir</strong> <span class="ios-share-icon">\u{1F4E4}</span> y luego <strong>"Agregar a pantalla de inicio"</strong>.';
    } else {
      iosText.innerHTML = 'Abre en <strong>Safari</strong> para instalar: toca <span class="ios-share-icon">\u{1F4E4}</span> → <strong>"Agregar a pantalla de inicio"</strong>.';
    }
  }

  installBanner.classList.remove("hidden");
  installBanner.classList.add("install-ios");
}

if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === "accepted") showToast("\u00a1Instalando app!");
      deferredInstallPrompt = null;
      if (installBanner) installBanner.classList.add("hidden");
    }
  });
}
if (installDismissBtn) {
  installDismissBtn.addEventListener("click", () => {
    if (installBanner) installBanner.classList.add("hidden");
    sessionStorage.setItem(INSTALL_DISMISSED_KEY, "1");
  });
}

// Show iOS hint after short delay on first visit
setTimeout(() => showIOSInstallHint(), 2500);

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

const ENGLISH_WORDS = new Set([
  "wifi", "bluetooth", "hot dog", "brownie", "waffle", "hot cake", "pay", "lobby", "mouse",
  "dron", "javascript", "python", "pixel", "app", "usb", "hdmi", "laptop", "tablet", "ram", "gps",
  "firewall", "podcast", "blog", "streaming", "emoji", "sticker", "vpn", "proxy", "cookie",
  "router", "backup", "machine learning", "front-end", "back-end", "linux", "windows", "nfc",
  "meme", "gif", "tiktok", "youtube", "spam", "phishing", "hashtag", "trending", "drive", "lag", "ping",
  "rugby", "waterpolo", "cricket", "windsurf", "snowboard", "lacrosse", "skateboard", "softbol", "squash",
  "parkour", "snorkel", "crossfit", "mma", "flag football", "touchdown", "chef", "hacker", "bartender",
  "youtuber", "influencer", "doula", "marvel", "dc", "pixar", "dreamworks", "western", "noir",
  "zombie", "storyboard", "streaming", "teaser", "imax", "3d", "remake", "reboot", "thriller",
  "spoiler", "time lapse", "cgi", "trap", "punk", "rap", "hip hop", "jazz", "blues", "techno",
  "ska", "k-pop", "j-pop", "dj", "single", "pop", "indie", "country", "folk", "remix", "mashup",
  "tinder", "bumble", "ghostear", "friendzone", "situationship", "catfish", "sexting", "nudes", "stalkear",
  "match", "swipe", "sugar daddy", "sugar mommy", "sugar baby", "onlyfans", "patreon", "crush", "free",
  "one night stand", "after", "shot", "stripper", "pole dance", "vip", "red flag", "voyeur", "pack", "bdsm", "milf"
]);

function getThemePool(themeKey, includeAdult) {
  let initialPool;
  if (themeKey === "aleatorio") {
    // Include all themed pools PLUS the general aleatorio pairs
    initialPool = Object.keys(localWords).filter(k => !k.startsWith("custom_") && (includeAdult || k !== "adulto")).flatMap(k => localWords[k]);
  } else if (themeKey === "adulto" && !includeAdult) {
    initialPool = Object.keys(localWords).filter(k => !k.startsWith("custom_") && k !== "adulto").flatMap(k => localWords[k]);
  } else {
    initialPool = localWords[themeKey] ?? localWords.aleatorio;
  }

  if (state.spanishOnly) {
    const filtered = initialPool.filter(pair => {
      const w1 = pair[0].toLowerCase();
      const w2 = pair[1].toLowerCase();
      return !ENGLISH_WORDS.has(w1) && !ENGLISH_WORDS.has(w2);
    });
    // Fallback in case filter removes everything (unlikely)
    if (filtered.length >= 5) return filtered;
  }

  return initialPool;
}

// --- Word history cache (sessionStorage, per-theme) to avoid repeating pairs ---
const USED_WORDS_PREFIX = "impostor_used_";
function getUsedPairs(themeTag) {
  try { return JSON.parse(sessionStorage.getItem(USED_WORDS_PREFIX + themeTag)) || []; } catch { return []; }
}
function markPairUsed(themeTag, pair) {
  const used = getUsedPairs(themeTag);
  used.push(pair[0] + "|" + pair[1]);
  try { sessionStorage.setItem(USED_WORDS_PREFIX + themeTag, JSON.stringify(used)); } catch { }
}
function resetUsedPairsForTheme(themeTag) {
  sessionStorage.removeItem(USED_WORDS_PREFIX + themeTag);
}

function getLocalPack(themeKey, includeAdult) {
  const pool = getThemePool(themeKey, includeAdult);
  // Build a cache tag: theme + adult flag so "aleatorio" with/without adult are tracked separately
  const themeTag = themeKey + (themeKey === "aleatorio" ? (includeAdult ? "_a" : "") : "");
  const used = new Set(getUsedPairs(themeTag));
  // Filter out already-used pairs
  let available = pool.filter(p => !used.has(p[0] + "|" + p[1]));
  // If all pairs exhausted for this theme, reset its history and use full pool
  if (available.length === 0) {
    resetUsedPairsForTheme(themeTag);
    available = pool;
  }
  const pair = pickRandom(available);
  markPairUsed(themeTag, pair);
  return { secretWord: pair[0], decoyWord: pair[1], source: "local" };
}

async function createRound() {
  const theme = state.selectedTheme;

  // If we have persistent roles from a previous round in the same game, reuse them
  if (state.persistentRoles) {
    const allRoles = state.persistentRoles;
    const roles = allRoles.filter(r => !state.eliminatedPlayers.includes(r.player));
    if (roles.length < 3) throw new Error("No quedan suficientes jugadores activos (mínimo 3).");
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
  if (impostorCount >= playerCount - whiteCount - 1) throw new Error("Debe haber al menos 2 civiles para una partida justa.");

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
  const pName = escapeHtml(state.round.roles[state.revealIndex].name);
  dealHint.innerHTML = `
    <div style="font-size:2.5rem;margin-bottom:8px">\ud83c\udfaf</div>
    <div style="font-size:1.1rem;color:var(--text2);margin-bottom:4px">Pasa el celular a</div>
    <h2 style="font-size:2.2rem;margin:0;color:var(--accent);line-height:1.1">${pName}</h2>
    <div style="font-size:0.95rem;color:var(--text2);margin-top:12px;font-weight:600">Jugador ${cur} de ${tot}</div>
  `;
  updateDealProgress();
}

function renderRoleCard() {
  const item = state.round.roles[state.revealIndex];
  const roleName = item.role === "agente fantasma" ? "Fantasma" : item.role;
  const roleClass = item.role === "impostor" ? "role-name impostor-role" : "role-name";
  const wordClass = item.role === "impostor" ? "role-word impostor-role-word" : "role-word";
  roleCard.innerHTML = `
    <span class="role-emoji" style="border-radius:50%;background:var(--surface);width:80px;height:80px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;box-shadow:0 4px 12px rgba(0,0,0,0.15)">${getRoleEmoji(item.role)}</span>
    <h3 class="${roleClass}" style="opacity:0.9">Eres: ${escapeHtml(roleName)}</h3>
    <p class="${wordClass}" style="font-size:2.2rem!important;margin:16px 0!important;font-weight:900!important;line-height:1.1">${escapeHtml(item.word)}</p>
    <p class="role-tip" style="background:rgba(0,0,0,0.2);padding:12px;border-radius:8px;margin-top:16px;border:1px solid rgba(255,255,255,0.05)">${escapeHtml(item.tip)}</p>
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

    // Pick random starter
    const aliveCivilsAndImps = state.persistentRoles.filter(r => !state.eliminatedPlayers.includes(r.player) && r.role !== "agente fantasma");
    const starters = aliveCivilsAndImps.length > 0 ? aliveCivilsAndImps : state.persistentRoles.filter(r => !state.eliminatedPlayers.includes(r.player));
    const starter = pickRandom(starters);

    // Show an overlay
    const overlay = document.createElement("div");
    overlay.className = "sorteo-overlay";
    overlay.innerHTML = `
      <div class="sorteo-content">
        <div class="sorteo-icon">🎲</div>
        <h2 class="sorteo-title">¡Empieza a hablar!</h2>
        <div class="sorteo-cards">
          <div class="sorteo-card sorted" style="width: auto; padding: 10px 20px; font-size: 1.2rem; color: #fff;">
            ${escapeHtml(starter.name)}
          </div>
        </div>
        <p class="sorteo-sub">Da la primera pista</p>
        <button class="btn-primary" style="margin-top: 10px; width: 100%" onclick="this.parentElement.parentElement.remove(); SFX.click(); startTimer();">
          ¡A jugar!
        </button>
      </div>
    `;
    document.body.appendChild(overlay);
    SFX.fanfare();

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

  const avatarColors = ["#ff7b54", "#e040fb", "#00e676", "#ffd600", "#ff4757", "#f0a0ff", "#69f0ae", "#ff6b81", "#ffab40", "#ce93d8"];
  const avatarEmojis = ["\ud83d\ude0e", "\ud83e\udd29", "\ud83d\ude08", "\ud83e\udd14", "\ud83d\ude0f", "\ud83e\uddd0", "\ud83d\ude0d", "\ud83e\udd2b", "\ud83d\ude1c", "\ud83d\ude44"];

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
  showConfirmModal(`¿Eliminar a ${selectedRole.name}? Esta acción es definitiva.`, () => {
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
          : state.round.roles.filter(r => r.role === "impostor" && !state.eliminatedPlayers.includes(r.player)).length;

        const subtitle = remainingImps > 0
          ? `Quedan ${remainingImps} impostores ocultos... \ud83d\udd75\ufe0f`
          : "Los civiles ganan 🏆";
        // Only reveal words when ALL impostors are caught (no remaining)
        const wordsHtml = remainingImps === 0
          ? `<div class="vote-reveal-words">
              <span class="vote-word-civil">🟢 Civiles: <strong>${escapeHtml(state.round.secretWord)}</strong></span>
              <span class="vote-word-imp">🔴 Impostor: <strong>${escapeHtml(state.round.decoyWord)}</strong></span>
            </div>`
          : `<div class="vote-reveal-words vote-words-hidden">
              <span>🔒 Las palabras se revelarán al atrapar a todos los impostores</span>
            </div>`;
        voteResult.innerHTML = `
          <div class="vote-reveal-card vote-reveal-success">
            <div class="vote-reveal-emoji">🎉</div>
            <h3>¡Correcto!</h3>
            <p><strong>${escapeHtml(selectedRole.name)}</strong> ERA impostor</p>
            ${wordsHtml}
            <p class="vote-reveal-subtitle">${subtitle}</p>
          </div>`;
      } else {
        SFX.click();
        voteResult.innerHTML = `
          <div class="vote-reveal-card vote-reveal-fail">
            <div class="vote-reveal-emoji">\ud83d\ude31</div>
            <h3>¡Incorrecto!</h3>
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
          nextBtn.innerHTML = "➡\ufe0f Siguiente ronda";
          if (nextBtn) nextBtn.addEventListener("click", () => startNextRound());
          const card = voteResult.querySelector(".vote-reveal-card");
          if (card) card.appendChild(nextBtn);
        }, 1200);
      }
    }, 900);
  });
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
  voteResult.textContent = "";
  // Remove old eliminated badge
  const oldBadge = document.querySelector(".eliminated-badge");
  if (oldBadge) oldBadge.remove();
  timerDisplay.classList.remove("timer-urgent", "timer-finished");
  setRoundStatus("");
  renderTimer();
  buildVoteUI();
  updateAliveStatus();
  setRoundPhase("debate");

  // Pick random starter for the new round
  const aliveCivilsAndImps = state.persistentRoles.filter(r => !state.eliminatedPlayers.includes(r.player) && r.role !== "agente fantasma");
  const starters = aliveCivilsAndImps.length > 0 ? aliveCivilsAndImps : state.persistentRoles.filter(r => !state.eliminatedPlayers.includes(r.player));
  const starter = pickRandom(starters);

  // Show an overlay
  const overlay = document.createElement("div");
  overlay.className = "sorteo-overlay";
  overlay.innerHTML = `
    <div class="sorteo-content">
      <div class="sorteo-icon">🎲</div>
      <h2 class="sorteo-title">¡Empieza a hablar!</h2>
      <div class="sorteo-cards">
        <div class="sorteo-card sorted" style="width: auto; padding: 10px 20px; font-size: 1.2rem; color: #fff;">
          ${escapeHtml(starter.name)}
        </div>
      </div>
      <p class="sorteo-sub">Da la primera pista de esta ronda</p>
      <button id="startGameAfterSorteoBtn" class="btn-primary" style="margin-top: 10px; width: 100%">
        ¡A jugar!
      </button>
    </div>
  `;
  document.body.appendChild(overlay);

  const startLocalBtn = overlay.querySelector("#startGameAfterSorteoBtn");
  if (startLocalBtn) {
    startLocalBtn.addEventListener("click", () => {
      overlay.remove();
      SFX.click();
      startTimer();
    });
  }
  SFX.fanfare();

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
    backHomeBtn.textContent = "\ud83c\udfe0 Nueva partida";
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

  showConfirmModal("¿Seguro? Esto revelará quién es el impostor a todos.", () => {
    const themeLabel = themes.find(t => t.key === state.round.theme)?.label || state.round.theme;
    const votedP = state.votedPlayer;
    const votedRole = votedP !== null ? state.round.roles.find(r => r.player === votedP) : null;
    const civilsWin = votedRole?.role === "impostor";

    // Compute impostor names for display
    const allImpostors = (state.round.allRoles || state.round.roles)
      .filter(r => r.role === "impostor")
      .map(r => r.name);
    const impStr = allImpostors.map(n => `<strong style="color:var(--accent)">${escapeHtml(n)}</strong>`).join(" y ");

    let banner = "";
    if (votedP !== null) {
      if (civilsWin) {
        if (state.round.theme === "peda") {
          banner = `<div class="winner-banner winner-civils">🎉 ¡Atraparon al Impostor! <br><small>🔥 <b>Castigo:</b> El impostor (${escapeHtml(votedRole?.name)}) toma fondo o cumple un reto.</small></div>`;
        } else {
          banner = `<div class="winner-banner winner-civils">🎉 ¡Los civiles ganaron! Descubrieron al impostor.<br><small>\ud83d\udd75\ufe0f Impostores: ${impStr}</small></div>`;
        }
      } else {
        if (state.round.theme === "peda") {
          banner = `<div class="winner-banner winner-impostor">🕵️ ¡El impostor se salvó! <br><small>🍻 <b>Castigo:</b> ¡TODOS LOS CIVILES TOMAN!</small></div>`;
        } else {
          banner = `<div class="winner-banner winner-impostor">🕵️ ¡El impostor sobrevivió! Los civiles fallaron.<br><small>\ud83d\udd75\ufe0f Impostores: ${impStr}</small></div>`;
        }
      }
    }

    const rows = (state.round.allRoles || state.round.roles).map(item => {
      const cssRole = item.role === "agente fantasma" ? "fantasma" : item.role;
      const visibleRole = item.role === "agente fantasma" ? "Fantasma" : item.role;
      const wasVoted = item.player === state.votedPlayer;
      const wasEliminated = state.eliminatedPlayers.includes(item.player) && !wasVoted;

      let statusText = "";
      if (wasVoted) {
        statusText = "🗳️ Eliminado";
        if (item.role === "civil" && state.round.theme === "peda") {
          statusText += ` <span style="color:var(--orange);font-size:0.9em;display:block">🥃 Toma 1 trago</span>`;
        }
      } else if (wasEliminated) {
        statusText = "❌ Eliminado antes";
        if (item.role === "civil" && state.round.theme === "peda") {
          statusText += ` <span style="color:var(--orange);font-size:0.9em;display:block">🥃 Toma 1 trago</span>`;
        }
      }

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
      // Allow new round directly from here if game not over yet (edge case)
      if (newRoundBtn) newRoundBtn.classList.remove("hidden");
    }

    SFX.fanfare();
    if (civilsWin) launchConfetti();
  });
}

// ============= GAME SCREEN MANAGEMENT =============
function enterGameMode() {
  appEl.classList.add("in-game");
  gameScreen.classList.remove("hidden");
  setGamePhase("reparto");
  // Hide nav bar during gameplay
  const topNav = document.querySelector(".app-header");
  if (topNav) topNav.style.display = "none";
}

function exitGameMode() {
  appEl.classList.remove("in-game");
  gameScreen.classList.add("hidden");
  dealSection.classList.add("hidden");
  roundSection.classList.add("hidden");
  // Restore nav bar
  const topNav = document.querySelector(".app-header");
  if (topNav) topNav.style.display = "";
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
  for (const [btn, key] of [[menuHomeBtn, "home"], [menuPlayBtn, "play"], [menuStatsBtn, "stats"], [menuHelpBtn, "help"], [menuPedaBtn, "peda"]]) {
    if (btn) btn.classList.toggle("active", tab === key);
  }
}

function showMainView(view) {
  exitGameMode();
  if (menuSection) if (menuSection) menuSection.classList.toggle("hidden", view !== "home");
  if (categorySection) categorySection.classList.toggle("hidden", view !== "categories");
  if (controlsSection) if (categorySection) categorySection.classList.toggle("hidden", view !== "categories");
  if (controlsSection) controlsSection.classList.toggle("hidden", view !== "play" && view !== "peda");
  helpSection.classList.toggle("hidden", view !== "help");
  if (statsSection) statsSection.classList.toggle("hidden", view !== "stats");

  // Si entra al modo peda, auto-seleccionar ese tema y mostrar la misma pantalla de play
  if (view === "peda") {
    // Forzar activación del toggle de temas adultos para que "peda" sea visible
    state.includeAdultTheme = true;
    if (adultThemesToggle) adultThemesToggle.checked = true;
    state.selectedTheme = "peda";
    renderThemeChips();
    // Podríamos mostrar un notice visual de las reglas de peda aquí
    const existingNotice = document.getElementById("pedaNotice");
    if (!existingNotice) {
      const notice = document.createElement("div");
      notice.id = "pedaNotice";
      notice.className = "help-tip";
      notice.style.marginBottom = "16px";
      notice.style.borderColor = "var(--orange)";
      notice.innerHTML = `<strong>🍻 Modo Peda Activado:</strong><ul style="margin:6px 0 0;padding-left:18px;"><li>Palabras picantes y de fiesta.</li><li>Civil eliminado por error = 1 trago.</li><li>Ganan Civiles = Impostor fondo/doble.</li><li>Gana Impostor = ¡Todos los civiles toman!</li></ul>`;
      controlsSection.insertBefore(notice, controlsSection.children[1]);
    } else {
      existingNotice.style.display = "block";
    }
    setActiveMenuTab("peda");
  } else {
    // Esconder notice de peda si salimos del modo peda (o si elegimos otro tema en "play" normal)
    const existingNotice = document.getElementById("pedaNotice");
    if (existingNotice && view !== "play") existingNotice.style.display = "none";
    setActiveMenuTab(view);
  }

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
  const visible = themes; // Always show +18 and Peda in the grid
  for (const t of visible) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `theme-chip${t.adult ? " adult" : ""}${t.key === state.selectedTheme ? " active" : ""}`;
    chip.textContent = t.label;
    chip.setAttribute("role", "radio");
    chip.setAttribute("aria-checked", String(t.key === state.selectedTheme));
    chip.addEventListener("click", () => {
      state.selectedTheme = t.key;
      renderThemeChips();
      SFX.click();

      // Auto-ocultar el aviso de peda si se cambia de tema
      const existingNotice = document.getElementById("pedaNotice");
      if (existingNotice) {
        existingNotice.style.display = state.selectedTheme === "peda" ? "block" : "none";
      }

      // Si el tema seleccionado ya no es "peda", y el tab activo era peda, cambiamos a "play" visualmente
      if (state.selectedTheme !== "peda" && menuPedaBtn?.classList.contains("active")) {
        setActiveMenuTab("play");
      }
      // Y viceversa
      if (state.selectedTheme === "peda" && !menuPedaBtn?.classList.contains("active")) {
        setActiveMenuTab("peda");
      }
    });
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
  // Remove eliminated badge if exists (sibling of voteList)
  const existingBadge = document.querySelector(".eliminated-badge");
  if (existingBadge) existingBadge.remove();
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

// (menuStartBtn and menuPlayBtn listeners are set below in the EVENT LISTENERS section)

// ============= EVENT LISTENERS =============
// startBtn is already mapped to startGameBtn in DOM refs, so no extra listener needed
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

if (readyBtn) readyBtn.addEventListener("click", showSwipeScreen);
if (nextBtn) nextBtn.addEventListener("click", goNextPlayer);
if (coverBtn) coverBtn.addEventListener("click", coverRoleAgain);

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

if (revealAllBtn) revealAllBtn.addEventListener("click", revealFinal);
if (resetBtn) resetBtn.addEventListener("click", resetRound);

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

if (quitGameBtn) quitGameBtn.addEventListener("click", () => {
  if (state.gameActive) {
    showConfirmModal("¿Seguro que quieres salir? Se perderá el progreso de la partida.", () => resetRound());
  } else {
    resetRound();
  }
});

if (newRoundBtn) newRoundBtn.addEventListener("click", () => {
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

if (backHomeBtn) backHomeBtn.addEventListener("click", () => {
  if (state.gameActive) {
    showConfirmModal("¿Volver al inicio? Se perderá la partida actual.", () => resetRound());
  } else {
    resetRound();
  }
});
if (startTimerBtn) startTimerBtn.addEventListener("click", startTimer);
if (pauseTimerBtn) pauseTimerBtn.addEventListener("click", pauseTimer);
if (resetTimerBtn) resetTimerBtn.addEventListener("click", resetTimer);
if (fullscreenBtn) fullscreenBtn.addEventListener("click", toggleFullscreen);

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

if (menuHomeBtn) menuHomeBtn.addEventListener("click", () => showMainView("home"));
if (menuPlayBtn) menuPlayBtn.addEventListener("click", () => showMainView("categories"));
if (menuPedaBtn) menuPedaBtn.addEventListener("click", () => showMainView("peda"));
if (menuHelpBtn) menuHelpBtn.addEventListener("click", () => showMainView("help"));
if (menuStatsBtn) menuStatsBtn.addEventListener("click", () => showMainView("stats"));
if (menuStartBtn) menuStartBtn.addEventListener("click", () => showMainView("categories"));
if (menuHowToBtn) menuHowToBtn.addEventListener("click", () => showMainView("help"));

if (toggleNamesBtn) toggleNamesBtn.addEventListener("click", () => {
  state.showNames = !state.showNames;
  playerNamesContainer.classList.toggle("hidden", !state.showNames);
  toggleNamesBtn.textContent = state.showNames ? "\u2715 Ocultar nombres" : "\u270f\ufe0f Personalizar nombres";
  if (state.showNames) renderPlayerNameInputs();
});

playersInput.addEventListener("change", () => { if (state.showNames) renderPlayerNameInputs(); });

if (adultThemesToggle) adultThemesToggle.addEventListener("change", () => {
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

if (backFromCategoryBtn) backFromCategoryBtn.addEventListener("click", () => showMainView("home"));
if (changeCategoryBtn) changeCategoryBtn.addEventListener("click", () => showMainView("categories"));

// ============= INIT =============
applyVisualTheme(localStorage.getItem("impostorTheme") || "dark");
renderThemeChips();
refreshCustomThemes();
setSwipeSensitivity("suave");
renderPlayerNameInputs();
resetRound();
