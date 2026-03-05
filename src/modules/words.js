// ============= WORD POOLS (~500 pares = 1000+ palabras MX) =============
export const ENGLISH_WORDS = new Set([
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

export const localWords = {
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

export const themes = [
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

export function getThemePool(themeKey, includeAdult, spanishOnly) {
    let initialPool;
    if (themeKey === "aleatorio") {
        // Include all themed pools PLUS the general aleatorio pairs
        initialPool = Object.keys(localWords).filter(k => !k.startsWith("custom_") && (includeAdult || k !== "adulto")).flatMap(k => localWords[k]);
    } else if (themeKey === "adulto" && !includeAdult) {
        initialPool = Object.keys(localWords).filter(k => !k.startsWith("custom_") && k !== "adulto").flatMap(k => localWords[k]);
    } else {
        initialPool = localWords[themeKey] ?? localWords.aleatorio;
    }

    if (spanishOnly) {
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

function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function getLocalPack(themeKey, includeAdult, spanishOnly) {
    const pool = getThemePool(themeKey, includeAdult, spanishOnly);
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
