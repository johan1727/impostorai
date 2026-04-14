import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import html2canvas from "html2canvas";

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

// ============= WORD POOLS (~1200+ pares = 2400+ palabras MX) =============
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
    ["calcetín", "zapato"], ["cuchara", "tenedor"], ["banqueta", "calle"], ["nube", "niebla"],
    ["sofá", "sillón"], ["escoba", "trapeador"], ["cubeta", "bandeja"], ["jabón", "shampoo"],
    ["paleta de hielo", "nieve de limón"], ["microbús", "combi"], ["molcajete", "metate"],
    ["petate", "estera"], ["morral", "costal"], ["mecate", "lazo"], ["tepetate", "adobe"],
    ["huarache", "chancla"], ["cotorra", "chismosa"], ["piloncillo", "azúcar morena"],
    ["comal", "sartén"], ["cazuela", "olla"], ["jícara", "guaje"], ["amate", "papel"],
    ["vochito", "tsuru"], ["troca", "camioneta"], ["fayuca", "contrabando"], ["tianguis", "bazar"],
    ["palenque", "jaripeo"], ["pozol", "atole"], ["tejate", "champurrado"], ["nixte", "nixtamal"],
    ["metrobús", "trolebús"], ["mototaxi", "bicitaxi"], ["pulquería", "mezcalería"], ["tlapalería", "ferretería"]
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
    ["birria", "barbacoa"], ["tlayuda", "huarache"], ["agua de horchata", "agua de jamaica"], ["camote", "jícama"],
    ["consomé", "caldo de pollo"], ["sopes", "tlacoyos"], ["quesabirria", "tacos al pastor"],
    ["churro", "crepa"], ["pizza", "lasaña"], ["mariscos", "pescado frito"], ["sopa de fideo", "sopa de lentejas"],
    ["cochinita pibil", "poc chuc"], ["chiles en nogada", "rellena"], ["caldo de res", "caldo tlalpeño"],
    ["enchiladas verdes", "enchiladas suizas"], ["tacos de canasta", "tacos de guisado"],
    ["picadillo", "tinga"], ["nopales asados", "verdolagas"], ["flautas", "taquitos dorados"],
    ["memela", "totopo"], ["tepache", "agua de tamarindo"], ["tejuino", "tascalate"],
    ["chalupa", "panuchos"], ["torta ahogada", "torta de chilaquil"], ["morisqueta", "enfrijoladas"],
    ["tamales oaxaqueños", "tamales de rajas"], ["caldo de camarón", "caldo de pollo"],
    ["chiles chipotles", "chiles guajillos"], ["mole negro", "mole coloradito"],
    ["pambazos", "volcanes"], ["sincronizadas", "vampiros"], ["pepitas", "cacahuates japoneses"],
    ["gazpacho moreliano", "bio-bio"], ["tostadas de tinga", "tostadas de pata"],
    ["atole de guayaba", "champurrado"], ["elotes preparados", "esquites con chile"],
    ["tacos de suadero", "tacos de longaniza"], ["enchiladas potosinas", "enchiladas mineras"],
    ["caldo de oso", "menudo norteño"], ["molletes", "croque monsieur"], ["bísquet", "cuernito"],
    ["ensalada césar", "ensalada griega"], ["calzone", "empanada argentina"], ["yakimeshi", "arroz frito"],
    ["boneless", "alitas"], ["tequeños", "deditos de queso"], ["croissant", "pan brioche"],
    ["marquesita", "crepa"], ["fresas con crema", "duraznos en almíbar"], ["chocoflan", "tres leches"],
    ["caldo tlalpeño", "sopa azteca"], ["milanesa", "pollo empanizado"], ["machaca", "arrachera"],
    ["coctel de camarón", "vuelve a la vida"], ["botana", "antojito"], ["antojitos mexicanos", "comida corrida"]
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
    ["oxxo", "farmacia"], ["taquería", "puesto"], ["cenote", "balneario"], ["antro", "salón de fiestas"],
    ["gimnasio", "deportivo"], ["museo", "galería"], ["biblioteca", "librería"], ["estacionamiento", "parquímetro"],
    ["vecindad", "condominio"], ["tepito", "la merced"], ["xochimilco", "trajinera"], ["chapultepec", "alameda"],
    ["tlatelolco", "tlalpan"], ["coyoacán", "san ángel"], ["santa fe", "polanco"], ["tepito", "doctores"],
    ["zócalo capitalino", "plancha"], ["palacio nacional", "palacio de bellas artes"],
    ["pirámide de teotihuacan", "pirámide de chichén itzá"], ["tulum", "palenque"],
    ["monte albán", "mitla"], ["guanajuato capital", "san miguel de allende"],
    ["puerto vallarta", "manzanillo"], ["huatulco", "puerto escondido"],
    ["barrancas del cobre", "cascadas de agua azul"], ["hierve el agua", "grutas de cacahuamilpa"],
    ["mercado de jamaica", "mercado de sonora"], ["la lagunilla", "el chopo"],
    ["parque hundido", "parque lincoln"], ["zona rosa", "condesa"], ["roma norte", "narvarte"],
    ["iztapalapa", "ecatepec"], ["neza", "chimalhuacán"], ["tlajomulco", "zapopan"],
    ["regiomontano", "monstruo del norte"]
  ],
  objetos: [
    ["teclado", "mouse"], ["paraguas", "impermeable"], ["linterna", "vela"], ["reloj", "cronómetro"],
    ["espada", "escudo"], ["llave", "candado"], ["lentes", "lupa"], ["brújula", "mapa"],
    ["guitarra", "ukulele"], ["silla", "banco"], ["cuchara", "tenedor"], ["pincel", "brocha"],
    ["aguja", "alfiler"], ["cadena", "cuerda"], ["antena", "radar"], ["campana", "silbato"],
    ["corona", "tiara"], ["dado", "ficha"], ["escalera", "rampa"], ["guante", "manopla"],
    ["imán", "brújula"], ["maceta", "jarrón"], ["lámpara", "foco"], ["globo terráqueo", "mapa"],
    ["pañuelo", "toalla"], ["escoba", "trapeador"], ["botella", "jarra"], ["sobre", "carpeta"],
    ["control remoto", "pilas"], ["cinturón", "tirantes"], ["encendedor", "cerillos"], ["cartera", "monedero"],
    ["manguera", "regadera"], ["engrapadora", "clips"], ["cinta adhesiva", "pegamento"], ["chamarra", "suéter"],
    ["plancha", "secadora"], ["peine", "cepillo"], ["auriculares", "bocina"], ["perfume", "desodorante"],
    ["bolsa de mandado", "red de mercado"], ["paliacate", "pañoleta"], ["metlapil", "molcajete"],
    ["tapaojos", "antifaz"], ["termo", "cantimplora"], ["veladora", "cirio"], ["morral bordado", "bolsa de yute"],
    ["paraguas plegable", "chubasquero"], ["petaca", "maletín"], ["servilleta de tela", "manteles"],
    ["coladera", "tapón"], ["cubrebocas", "tapabocas"], ["garrafón", "cántaro"],
    ["escuadra", "cartabón"], ["nivel de burbuja", "plomada"], ["guantes de latex", "guantes de carnaza"],
    ["pinza de ropa", "gancho"], ["piedra de rio", "adoquín"]
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
    ["hashtag", "trending"], ["notificación", "alerta"], ["lag", "ping"],
    ["ChatGPT", "Gemini"], ["criptomoneda", "NFT"], ["influencer", "streamer"], ["ciberseguridad", "código fuente"],
    ["smartwatch", "banda deportiva"], ["pantalla táctil", "teclado físico"], ["cargador inalámbrico", "power bank"],
    ["red social", "plataforma digital"], ["perfil falso", "bot"], ["correo basura", "notificación molesta"],
    ["actualización", "parche"], ["modo avión", "modo silencio"], ["pantalla partida", "multitarea"],
    ["contraseña segura", "doble factor"], ["nube privada", "servidor local"], ["app de delivery", "app del banco"],
    ["videollamada", "mensaje de voz"], ["sticker pack", "gif animado"], ["estado de WhatsApp", "historia de Instagram"],
    ["selfie", "foto de grupo"], ["filtro de belleza", "sin filtro"], ["dark mode", "modo noche"],
    ["cuenta premium", "cuenta gratis"], ["unboxing", "review"], ["tutorial", "guía rápida"],
    ["phishing", "fraude electrónico"], ["CURP en línea", "e.firma"], ["airdrop", "bluetooth"],
    ["smart home", "casa automatizada"], ["domótica", "automatización"], ["captcha", "verificación"],
    ["token", "código temporal"], ["wallet digital", "billetera física"], ["deepfake", "foto editada"],
    ["chatbot", "asistente virtual"], ["prompt", "instrucción"], ["nube compartida", "USB"],
    ["pantalla OLED", "pantalla LCD"], ["teclado mecánico", "teclado de membrana"], ["monitor ultrawide", "monitor curvo"],
    ["reels", "shorts"], ["viralizar", "posicionar"], ["stream deck", "mezcladora"], ["geolocalización", "ubicación manual"]
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
    ["corrida", "jaripeo"], ["penal", "tiro libre"], ["cascarita", "reta"], ["gol", "touchdown"], ["porra", "barra"],
    ["Fórmula 1", "NASCAR"], ["esports", "gaming"], ["Lucha Libre AAA", "WWE"], ["Copa del Mundo", "Juegos Olímpicos"],
    ["gimnasia", "ballet"], ["polo", "críquet"], ["alpinismo", "senderismo"],
    ["Checo Pérez", "Memo Ochoa"], ["el Canelo", "el Choclo"], ["Hugo Sánchez", "Cuauhtémoc Blanco"],
    ["Chivas", "América"], ["Cruz Azul", "Pumas"], ["Tigres", "Rayados"], ["Toluca", "Santos"],
    ["estadio Azteca", "estadio BBVA"], ["Liga MX", "Liga de Expansión"], ["Selección Nacional", "Sub-20"],
    ["voleibol de playa", "natación artística"], ["pelota mixteca", "ulama"],
    ["maratón de CDMX", "carrera de montaña"], ["campeón", "subcampeón"],
    ["entrenador", "auxiliar técnico"], ["árbitro", "VAR"], ["tiempo extra", "penales"],
    ["torneo Apertura", "torneo Clausura"], ["guarura del club", "porra brava"],
    ["fichaje", "préstamo"], ["goleador", "portero"], ["cancha sintética", "cancha de tierra"]
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
    ["chapulín", "grillo"], ["guajolote", "gallina"], ["xoloitzcuintle", "chihuahua"], ["quetzal", "tucán"],
    ["koala", "canguro"], ["perezoso", "mono"], ["escorpión", "alacrán"], ["ciervo", "venado"],
    ["jaguar", "puma"], ["tapir", "pecarí"], ["manatí", "delfín rosado"], ["vaquita marina", "totoaba"],
    ["mono aullador", "mono araña"], ["ocelote", "margay"], ["águila real", "cóndor"],
    ["víbora de cascabel", "coralillo"], ["boa", "nauyaca"], ["teporingo", "conejo de los volcanes"],
    ["axolotl", "cecilia"], ["perrito de la pradera", "tusa"], ["zanate", "tordo"],
    ["perico", "cotorra"], ["chachalaca", "faisán"], ["tejón", "coatí"],
    ["coyote", "lobo gris mexicano"], ["berrendo", "venado cola blanca"]
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
    ["taquero", "panadero"], ["herrero", "soldador"], ["partera", "doula"], ["chamán", "curandero"],
    ["creador de contenido", "tiktoker"], ["community manager", "editor de video"], ["coach de vida", "terapeuta"],
    ["cerrajero", "relojero"], ["pintor de brocha gorda", "yesero"],
    ["tortillera", "taquera"], ["voceador", "papelero"], ["bolero", "lustrador"],
    ["merolico", "marchante"], ["tepachero", "agüero"], ["pollero", "coyote"],
    ["rezandero", "sacristán"], ["curandera", "huesero"], ["sobador", "quiropráctico"],
    ["ambulante", "tianguista"], ["fontanero", "plomero"], ["maestro de obra", "contratista"],
    ["notario", "escribano"], ["síndico", "delegado"], ["diputado", "senador"],
    ["coyote del SAT", "contador"], ["repartidor", "mensajero en moto"], ["velador", "guardia de seguridad"]
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
    ["serie", "telenovela"], ["trama", "spoiler"], ["cámara lenta", "time lapse"], ["CGI", "efectos prácticos"],
    ["blockbuster", "cine de arte"], ["clacketazo", "corte"], ["efectos de sonido", "banda sonora"],
    ["Roma", "Y tu mamá también"], ["Amores Perros", "El laberinto del fauno"], ["Coco", "Encanto"],
    ["Guillermo del Toro", "Alfonso Cuarón"], ["Alejandro González Iñárritu", "Carlos Reygadas"],
    ["telenovela Televisa", "telenovela TV Azteca"], ["la Rosa de Guadalupe", "Como dice el dicho"],
    ["Rebelde", "Clase 406"], ["El Chavo del 8", "El Chapulín Colorado"],
    ["Cantinflas", "Tin Tan"], ["María Félix", "Dolores del Río"], ["Pedro Infante", "Jorge Negrete"],
    ["Luis Buñuel", "Emilio Fernández"], ["Salma Hayek", "Gael García Bernal"],
    ["Frida", "Kahlo biopic"], ["Club de Cuervos", "Luis Miguel la serie"],
    ["Narcos México", "El señor de los cielos"], ["Ingobernable", "División Palermo"],
    ["Nosotros los Nobles", "No manches Frida"], ["A la mala", "Hazlo como hombre"],
    ["doblaje latino", "doblaje neutro"], ["Cartoon Network", "Canal 5"],
    ["Cinépolis", "Cinemex"], ["cinema4D", "Pixar Inside Out"]
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
    ["chilena", "son cubano"], ["vals", "danzón"], ["karaoke", "dueto"], ["mashup", "remix"],
    ["Spotify", "Apple Music"], ["mp3", "wav"], ["solista", "grupo vocal"],
    ["corrido tumbado", "corrido bélico"], ["sierreño", "grupero"], ["banda sinaloense", "tambora"],
    ["música de carnaval", "música de feria"], ["cumbia villera", "cumbia norteña"],
    ["Luis Miguel", "Juan Gabriel"], ["Alejandro Fernández", "Vicente Fernández"],
    ["Café Tacvba", "Molotov"], ["Maná", "Los Fabulosos Cadillacs"], ["Natalia Lafourcade", "Carla Morrison"],
    ["Peso Pluma", "Nodal"], ["Paquita la del Barrio", "Ana Gabriel"], ["Los Panchos", "Los Dandys"],
    ["La Sonora Santanera", "Grupo Límite"], ["Bronco", "Los Bukis"],
    ["Tropicana", "Beat 100.3"], ["OCESA", "CIE"], ["palenque norteño", "tocada en rancho"],
    ["trova yucateca", "son istmeño"], ["jarabe tapatío", "danza azteca"]
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
    ["virrey", "caudillo"], ["hacienda", "encomienda"], ["grito de Dolores", "Plan de Iguala"],
    ["Revolución Francesa", "Guerra Civil"], ["Revolución Industrial", "Ilustración"],
    ["Hernán Cortés", "Pedro de Alvarado"], ["Malinche", "Jerónimo de Aguilar"],
    ["Benito Juárez", "Porfirio Díaz"], ["Miguel Hidalgo", "José María Morelos"],
    ["Josefa Ortiz de Domínguez", "Leona Vicario"], ["Vicente Guerrero", "Agustín de Iturbide"],
    ["Plan de Ayala", "Plan de San Luis"], ["cristero", "zapatista"],
    ["Imperio Azteca", "Triple Alianza"], ["Tlatoani", "Cihuacóatl"],
    ["sacrificio humano", "ofrenda"], ["Quetzalcóatl", "Tláloc"], ["Huitzilopochtli", "Coatlicue"],
    ["piedra del sol", "calendario azteca"], ["juego de pelota", "tlachtli"],
    ["calpulli", "altepetl"], ["pochteca", "tlatoani"], ["conquista de México", "caída de Tenochtitlan"],
    ["tlaxcalteca", "cholulteca"], ["obsidiana", "pedernal"], ["Tepexpan", "hombre de Tepexpan"],
    ["cultura olmeca", "cultura teotihuacana"], ["Tula", "Teotihuacan"]
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
    ["chapulín", "escarabajo"], ["obsidiana", "jade"], ["cempasúchil", "nochebuena"], ["milpa", "chinampa"],
    ["eclipse", "luna llena"], ["rocío", "escarcha"], ["niebla", "neblina"], ["hongo", "seta"],
    ["barranca", "cañada"], ["petate de hoja", "palma real"], ["pochote", "parota"],
    ["selva lacandona", "bosque mesófilo"], ["sargaso", "sargazo"], ["manglares de Sian Ka'an", "arrecife mesoamericano"],
    ["copal", "ocote"], ["tepezcohuite", "árbol del tule"], ["nanche", "zapote"],
    ["chaya", "quelite"], ["epazote", "hierba santa"], ["tlachicotón", "maguey pulquero"],
    ["lluvia de estrellas", "eclipse total"], ["temblor", "sismo"], ["aguacate", "guayaba"],
    ["biznaga", "cholla"], ["pitahaya", "xoconostle"], ["tuna", "nopal"]
  ],
  sofi: [
    ["K-Pop", "J-Pop"], ["BTS", "Blackpink"], ["Anime", "Manga"], ["Soju", "Sake"],
    ["K-Drama", "Dorama"], ["Ramen", "Sushi"], ["Kimchi", "Tteokbokki"], ["Otaku", "K-poper"],
    ["Cosplay", "Disfraz"], ["Seúl", "Tokio"], ["Idol", "Actor de doblaje"], ["Oppas", "Waifus"],
    ["Genshin Impact", "Honkai"], ["Sanrio", "Hello Kitty"], ["Boba tea", "Matcha"], ["Naruto", "Dragon Ball"],
    ["Stray Kids", "TWICE"], ["Aesthetic", "Kawaii"], ["Webtoon", "Manhwa"], ["Mochi", "Pocky"],
    ["V-Tuber", "Streamer"], ["Seventeen", "EXO"], ["Red Velvet", "Aespa"], ["Ghibli", "Disney"],
    ["K-beauty", "Skincare"], ["Samgyeopsal", "Barbacoa coreana"], ["Tamagotchi", "Nintendo"], ["Shonen", "Shojo"],
    ["KakaoTalk", "Line"], ["Mukbang", "ASMR"], ["Fancam", "Live"], ["Lightstick", "Lámpara"],
    ["Photocard", "Polaroid"], ["Comeback", "Debut"], ["Bias", "Crush"], ["Maknae", "Líder"],
    ["Sasaeng", "Paparazzi"], ["Hanbok", "Kimono"], ["Taekwondo", "Karate"], ["Bulgogi", "Bibimbap"],
    ["Soju de durazno", "Soju original"], ["Corazón coreano", "Besito"], ["Gacha", "Lootbox"], ["Yaoi", "Yuri"],
    ["Donghua", "Anime chino"], ["Manhua", "Cómic chino"], ["Oricon", "Billboard"], ["Pompompurin", "Kuromi"],
    ["Cinnamoroll", "My Melody"], ["Doraemon", "Shin-chan"],
    ["One Piece", "Bleach"], ["Attack on Titan", "Demon Slayer"], ["Jujutsu Kaisen", "My Hero Academia"],
    ["Sailor Moon", "Cardcaptor Sakura"], ["Death Note", "Fullmetal Alchemist"], ["Hunter x Hunter", "Yu Yu Hakusho"],
    ["Isekai", "Shounen"], ["filler", "canon"], ["opening", "ending"], ["figura de anime", "funko pop"],
    ["TXT", "NewJeans"], ["LE SSERAFIM", "IVE"], ["Enhypen", "Monsta X"], ["Twice comeback", "BTS tour"],
    ["stan Twitter", "fan page"], ["merch oficial", "bootleg"], ["lightstick ver 1", "lightstick ver 2"],
    ["bias wrecker", "ult bias"], ["Jimin", "Jungkook"], ["Lisa", "Jennie"],
    ["subbed", "dubbed"], ["raw scan", "traducción fan"], ["scanlation", "fansub"],
    ["figurita nendoroid", "figura scale"], ["kigurumi", "onesie kawaii"]
  ],
  adulto: {
    "Apps y Ligue": [
      ["Tinder", "Bumble"], ["ghostear", "clavar el visto"], ["friendzone", "casi algo"],
      ["catfish", "perfil falso"], ["sexting", "nudes"], ["stalkear", "espiar"], ["match", "swipe"],
      ["sugar daddy", "patrocinador"], ["sugar baby", "mantenido"], ["OnlyFans", "contenido exclusivo"],
      ["Grindr", "Badoo"], ["Hinge", "OkCupid"], ["bloquear", "eliminar"], ["mutuales", "mejores amigos"],
      ["mandar DM", "reaccionar a historia"], ["super like", "corazón"], ["bio", "descripción"], ["fotos de gym", "fotos de viaje"],
      ["verificada", "cuenta candado"], ["unfollow", "dejar de seguir"], ["voyerista", "espectador"], ["dickpic", "foto no solicitada"],
      ["perfil de Tinder", "perfil de Instagram"], ["cita a ciegas", "cita de apps"], ["primer mensaje", "primer match"],
      ["ligoteo", "conquista"], ["corazón de Instagram", "like de Tinder"], ["stalkear el ex", "bloquear al ex"],
      ["conocerse en línea", "conocerse en la vida real"], ["relación por redes", "relación a distancia"],
      ["crush de Twitter", "crush de trabajo"], ["coqueteo por memes", "coqueteo por audios"],
      ["ex que te reanima", "ex que te bloquea"], ["notificación de Tinder", "notificación de WhatsApp"],
      ["primer amoroso", "último mensaje sin responder"], ["ghosteo lento", "ghosteo abrupto"],
      ["foto de perfil buena", "foto de perfil trampa"], ["cita en café", "cita en el OXXO"],
      ["Hinge en México", "Bumble en México"], ["descripción de bio", "foto de bio"],
      ["primer video llamada", "primera cita física"], ["reaccionar a story", "mandar DM"]
    ],
    "Jerga Joven": [
      ["slay", "devorar"], ["cringe", "oso"], ["de chill", "de compas"], ["NPC", "básico"],
      ["glow up", "tuneada"], ["red flag", "tóxico"], ["green flag", "sano"], ["fuckboy", "cucaracho"],
      ["simp", "arrastrado"], ["situationship", "quedantes"], ["delulu", "alucin"], ["aesthetic", "coquette"],
      ["funar", "cancelar"], ["Traka", "¡Zaz!"], ["PEC (por el culx)", "¡Y la queso!"],
      ["tirar beef", "tirar hate"], ["tryhardear", "esforzarse demás"], ["chulo", "galán"],
      ["sacar la sopa", "contar el chisme"], ["tener feria", "tener billete"], ["nadaqueveriento", "random"],
      ["basado", "chad"], ["fife", "pambolero"], ["inventada", "exagerada"], ["potaxie", "fifi"],
      ["servir", "darla toda"], ["ataque", "crisis"], ["soportar", "aguantar"], ["y la que soporte", "ni modo"],
      ["wey", "morro"], ["compa", "carnal"], ["chamba", "jale"], ["la neta", "la verdad"],
      ["fachero", "chido"], ["boomer", "ruco"], ["zennial", "millennial"], ["mood", "vibra"],
      ["mamey", "chido"], ["alivianado", "cuate"], ["jalado", "loco"], ["está cañón", "está grueso"],
      ["ni pex", "no hay pedo"], ["qué choro", "qué rollo"], ["hacer el paro", "echar la mano"],
      ["de volada", "de un jalón"], ["está de pelos", "está cagado"], ["hacer desmadre", "armar la fiesta"],
      ["está pilas", "está abusado"], ["pacheco", "grifo"], ["en chinga", "a webo"],
      ["no manches", "no me digas"], ["qué oso", "qué vergüenza"], ["pura paja", "pura neta"],
      ["mano", "bróder"], ["se echó un clavado", "se aventó"], ["es un show", "es un desmadre"]
    ],
    "Relaciones y Drama": [
      ["ligue", "faje"], ["tirar rollo", "chamuyar"], ["crush", "pretendiente"],
      ["amigos con derechos", "amigovios"], ["free", "one night stand"], ["acostar", "enrollarse"],
      ["calentón", "manoseo"], ["besarse", "fajarse"], ["ligar", "seducir"], ["coqueteo", "cotorreo"],
      ["celos", "inseguridad"], ["ex", "rebote"], ["cuernos", "engaño"],
      ["tusa", "despecho"], ["novio", "amante"], ["relación abierta", "poliamor"],
      ["drama", "escándalo"], ["desmadre", "locura"], ["chisme", "secreto"], ["infidelidad", "desliz"],
      ["tóxica", "psycho"], ["hacer escena", "berrinche"], ["revisar el celular", "pedir contraseña"], ["dar el avión", "ignorar"],
      ["rogón", "insistente"], ["terapia de pareja", "darse un tiempo"], ["terminar", "cortar"], ["volver con el ex", "recaída"],
      ["sugar mommy", "golfa"], ["interesada", "cazafortunas"], ["vengativa", "rencorosa"], ["llorar por él", "bloquearlo"],
      ["escena en público", "escena en privado"], ["dar el avión", "clavar el visto"],
      ["declararse", "tirar indirectas"], ["novio oficial", "quedante"],
      ["pareja tóxica", "pareja sana"], ["controlar al otro", "darle su espacio"],
      ["celos de WhatsApp", "celos de Instagram"], ["preguntarle a los amigos", "checar el teléfono"],
      ["irse de viaje con la ex", "irse de viaje en bola"], ["recordar aniversario", "olvidar aniversario"],
      ["detalles baratos", "detalles caros"], ["pelea de pareja", "reconciliación"],
      ["amigovios", "forever alone"], ["quedantes", "novios de verdad"]
    ],
    "Cuerpo y Tabú": [
      ["mamado", "trabado"], ["nalgón", "culón"], ["chichis", "bubis"],
      ["cachondo", "caliente"], ["piropo", "acoso"], ["encuerado", "desnudo"],
      ["pompis", "retaguardia"], ["abdomen", "cuadritos"],
      ["pecado", "prohibido"], ["morbo", "antojo"], ["fetiche", "fantasía"],
      ["lujuria", "pasión"], ["travesura", "aventura"], ["vibrador", "juguete"],
      ["rol", "disfraz"], ["voyeur", "exhibicionista"], ["sumiso", "dominante"],
      ["pack", "candente"], ["calentura", "maña"], ["desinhibido", "lanzado"], ["resbalosa", "atrevida"],
      ["sugar", "colágeno"], ["MILF", "DILF"], ["chaparrita", "alta"], ["curvy", "flaquita"],
      ["bóxer", "tanga"], ["lencería", "disfraz de enfermera"], ["piernuda", "caderona"], ["tatuajes", "piercings"],
      ["buena figura", "cuerpazo"], ["operada", "natural"], ["faja", "cinturilla"], ["bienestar", "gym"],
      ["rutina de skincare", "crema de la abuela"], ["depilada", "sin depilar"], ["labios carnosos", "labios delgados"],
      ["ojos almendrados", "ojos rasgados"], ["caderona", "cinturita"], ["piernas largas", "piernas cortas"],
      ["cabello teñido", "cabello natural"], ["barba bien arreglada", "barba descuidada"],
      ["cuerpo de influencer", "cuerpo de persona real"], ["abdomen marcado", "pancita"],
      ["espalda amplia", "hombros angostos"]
    ],
    "Explícito (+18 MX)": [
      ["chile", "picante"], ["albur", "doble sentido"], ["fierro", "macizo"],
      ["panocha", "papaya"], ["elote", "mazorca"], ["chorizo", "salchicha"],
      ["rapidín", "mañanero"], ["motel", "hotel de paso"], ["tanga", "hilo dental"],
      ["beso de tres", "trío"], ["arrimón", "faje en público"], ["condón", "preservativo"],
      ["orgía", "fiesta swinger"], ["consolador", "juguete sexual"],
      ["cariñosas", "prostis"], ["chaqueta", "puñeta"], ["mamada", "chupada"],
      ["perrito", "de chivito"], ["el chiquito", "el nudo de globo"],
      ["venirse", "terminar"], ["coger", "tirar"], ["erección", "palo"],
      ["orgasmo", "clímax"], ["putero", "congal"], ["chupetón", "marca"],
      ["madurita", "milf"], ["nalgada", "cachetada"], ["BDSM", "sado"],
      ["sentones", "brincos"], ["tijeras", "tortilleras"], ["agacharse", "ponerse en 4"], ["escupir", "tragar"],
      [" lubricante", "saliva"], ["anal", "oral"], ["69", "posición"], ["gemidos", "gritos"],
      ["squirting", "mojada"], ["correrse", "chorrear"], ["dedo", "mano"], ["venirse en la cara", "facial"]
    ],
    "Fiesta y Excesos": [
      ["peda", "borrachera"], ["cruda", "resaca"], ["desmadre", "escándalo"],
      ["cigarro", "vape"], ["porro", "mota"], ["after", "pre"], ["antro", "bar"],
      ["table dance", "strip club"], ["chelas", "cubetas"], ["caguama", "caguamita"],
      ["VIP", "general"], ["perreo", "reggaetón"], ["ligar", "levante"], ["manoseo", "agarrón"],
      ["beso borracho", "beso de verdad"], ["amnesia de peda", "blackout"], ["cruda moral", "cruda física"],
      ["despedida de soltera", "despedida de soltero"], ["hotel", "motel de paso"], ["coche", "asiento trasero"],
      ["botella gratis", "cubeta promo"], ["mesa reservada", "mesa improvisada"], ["DJ invitado", "playlist del compa"],
      ["amigo borracho", "amigo cuidador"], ["beso en el antro", "beso en la peda casera"]
    ],
    "Chisme y Traición": [
      ["chisme", "chismecito"], ["chisme caliente", "chisme jugoso"], ["hablar a espaldas", "hablar en la cara"],
      ["falso amigo", "enemigo declarado"], ["traición", "infidelidad"], ["puñalada trapera", "sabotaje"],
      ["chisme de oficina", "chisme de WhatsApp"], ["indirecta", "subtuit"], ["cancelado", "funado"],
      ["captura de pantalla", "audio filtrado"], ["foto comprometedora", "video íntimo"], ["venganza", "justicia"],
      ["rival", "enemiga"], ["envidia", "doble cara"], ["metiche", "chismoso"],
      ["bloqueo sutil", "bloqueo dramático"], ["eliminado del grupo", "expulsado del grupo"],
      ["ex mejor amiga", "nueva mejor amiga"], ["amiga del ex", "enemiga del ex"], ["corazoncito rojo", "reacción triste"],
      ["visto en grupo", "ignorado en privado"], ["secreto de amigas", "secreto ventilado"], ["quemar en historias", "quemar en persona"],
      ["filtrar conversación", "borrar mensajes"], ["pantallazo", "evidencia"]
    ]
  },
  memes: [
    ["rickroll", "trollface"], ["doge", "cheems"], ["bait", "clickbait"], ["POV", "storytime"],
    ["meme del gato", "meme del perro"], ["stonks", "not stonks"], ["based", "cringe"], ["XD", "LOL"],
    ["La Rosa de Guadalupe", "Laura en América"], ["Juan Gabriel", "Luis Miguel"],
    ["mucho texto", "TL;DR"], ["chad", "virgin"], ["FBI open up", "a ver déjame ver"],
    ["No era penal", "Sí era penal"], ["El América", "Las Chivas"], ["es neta", "no manches"],
    ["modo Chihuahua", "modo Golden"], ["eres un NPC", "eres un GOD"], ["prro", "wey"],
    ["panik", "kalm"], ["L", "W"], ["bromance", "friendzone"],
    ["el de la rosa", "el de la catrina"], ["Chabelo nunca muere", "Chabelo RIP"],
    ["no te comas el coco", "ya cómetelo"], ["modo zombie lunes", "modo bestia viernes"],
    ["el del penal de Ramos", "el del penal de Chicharito"], ["clasico América vs Chivas", "clasico Pumas vs Cruz Azul"],
    ["señora de Monterrey", "señora de CDMX"], ["wey del norte", "wey del sur"],
    ["suegra de WhatsApp", "mamá del grupo de WhatsApp"], ["el de los 100 pesos", "el del flete"],
    ["el de la cruda moral", "el de la cruda física"], ["meme de Eugenio Derbez", "meme de Chespirito"],
    ["spiderman señalándose", "El Chavo señalando"], ["¿y eso con qué se come?", "¿eso viene en la torta?"],
    ["cuando el profe pone tarea el viernes", "cuando el jefe pide reportes el viernes"],
    ["modo cuate", "modo conocido"], ["chilango en el metro", "chilango en el Uber"],
    ["fresa vs naco", "fifí vs prole"], ["ya llegó el que andaba mal", "ya llegó el que se tardó"],
    ["el compa que no paga", "el compa que siempre paga"], ["sí es penal", "no era penal"],
    ["el que grita en el cine", "el que come recio"], ["modo nerd", "modo vividor"],
    ["meme del pollito", "meme del gato negro"], ["cuando hay pozole en casa", "cuando hay caldo de pollo"],
    ["gato con tenis", "perrito musculoso"], ["cuando depositan", "cuando cobran"], ["lunes otra vez", "viernes por fin"],
    ["yo bien fresco", "yo todo tieso"], ["modo avión emocional", "modo intenso"], ["la jefa", "el admin del grupo"],
    ["ya siéntese señora", "ya duérmase señora"], ["meme de piolín", "frase motivacional cursed"],
    ["se viene cosita", "se canceló la cosita"], ["godín en quincena", "godín sin quincena"], ["yo merengues", "tú merengues"],
    ["qué bendición", "qué maldición"], ["perdón por ser así", "ni perdón ni olvido"]
  ],
  redes: [
    ["Instagram", "TikTok"], ["X (Twitter)", "Threads"], ["YouTube", "Twitch"], ["WhatsApp", "Telegram"],
    ["reel", "short"], ["hashtag", "trending"], ["influencer", "creador"], ["viral", "flop"],
    ["live", "stream"], ["DM", "mención"], ["follow", "unfollow"], ["like", "dislike"],
    ["share", "repost"], ["story", "publicación"], ["carrete", "feed"], ["filtro", "sin filtro"],
    ["verificado", "fake"], ["bot", "troll"], ["hater", "fan"], ["cancelar", "funar"],
    ["suscriptor", "seguidor"], ["algoritmo", "for you page"], ["engagement", "alcance"], ["collab", "ft."],
    ["Luisito Comunica", "Werevertumorro"], ["YosStop", "Badabun"], ["El Escorpión Dorado", "Sofía Castro"],
    ["Yordi Rosado", "Adela Micha"], ["Cossío", "Lele Pons México"], ["Fofo Márquez", "Naim Darrechi"],
    ["streamer mexicano", "youtuber mexicano"], ["trending en México", "trending en España"],
    ["TikTok de moda", "meme de semana"], ["captura de pantalla comprometedora", "funeo masivo"],
    ["cuenta de chismes", "cuenta de memes"], ["grupo de WhatsApp familiar", "grupo de amigos"],
    ["estado de visto", "respuesta tardía"], ["story que caduca", "post fijo"], ["número oculto", "spam de llamadas"],
    ["reacción en vivo", "reacción editada"], ["robo de contenido", "contenido original"],
    ["notificación de cumpleaños", "notificación del banco"], ["primer TikTok", "TikTok viral"],
    ["comentario de odio", "comentario de apoyo"], ["community notes", "etiqueta de spam"],
    ["close friends", "lista pública"], ["mensaje anclado", "mensaje borrado"], ["foto temporal", "foto de perfil"],
    ["streak", "racha"], ["trend", "challenge"], ["audio viral", "audio original"], ["dueto", "stitch"],
    ["cuenta privada", "cuenta pública"], ["baneado", "shadowban"], ["nota de Instagram", "estado de WhatsApp"],
    ["spam de promos", "spam de links"], ["reacción con fueguito", "reacción con corazoncito"]
  ],
  videojuegos: [
    ["Fortnite", "PUBG"], ["Minecraft", "Roblox"], ["PlayStation", "Xbox"], ["Nintendo", "Steam"],
    ["noob", "pro"], ["speedrun", "gameplay"], ["skin", "emote"], ["lag", "ping"],
    ["camper", "rusher"], ["nerf", "buff"], ["boss final", "jefe secreto"], ["NPC", "jugador"],
    ["sandbox", "battle royale"], ["GTA", "Need for Speed"], ["FIFA", "NBA 2K"], ["eSports", "torneo"],
    ["headshot", "clutch"], ["rage quit", "GG"], ["respawn", "permadeath"], ["mod", "DLC"],
    ["PvP", "PvE"], ["multiplayer", "singleplayer"], ["arcade", "consola"], ["retro", "next-gen"],
    ["TheGrefg", "Ibai"], ["Rubius", "ElRubius México"], ["Winpy Jireh", "Rix"], ["AuronPlay en español", "AuronPlay subtitulado"],
    ["Free Fire", "Call of Duty Mobile"], ["Clash Royale", "Clash of Clans"],
    ["Among Us", "Fall Guys"], ["League of Legends", "Dota 2"],
    ["El Chapuzas", "El que siempre gana"], ["cuenta smurfea", "cuenta main"],
    ["servidor latinoamericano", "servidor norteamericano"], ["ping de 300", "ping de 10"],
    ["cibercafé", "gaming house"], ["teclado mecánico", "teclado de membrana"],
    ["modo historia", "modo multijugador"], ["cheater", "jugador legítimo"],
    ["liga amateur", "liga profesional"], ["torneo de FIFA en el antro", "torneo de Mortal Kombat"],
    ["gacha luck", "gacha mala suerte"], ["pase de batalla", "pase gratuito"],
    ["jugador de móvil", "jugador de consola"], ["noche de gaming", "maratón de juego"],
    ["Mario Kart", "Crash Team Racing"], ["Elden Ring", "Dark Souls"], ["Zelda", "Pokémon"], ["Halo", "Gears of War"],
    ["gacha", "loot box"], ["easter egg", "secreto"], ["DLC", "expansión"], ["juego indie", "triple A"],
    ["drop legendario", "drop común"], ["farmear", "grindear"], ["teamear", "traicionar"], ["AFK", "desconectado"],
    ["teabag", "humillación"], ["speedrunner", "casual"], ["crossplay", "pantalla dividida"], ["ranked", "casual"]
  ],
  transporte: [
    ["metro", "metrobús"], ["camión", "combi"], ["taxi", "Uber"], ["avión", "helicóptero"],
    ["barco", "ferry"], ["moto", "bicicleta"], ["tren", "suburbano"], ["patrulla", "ambulancia"],
    ["RTP", "pesero"], ["tren maya", "tren suburbano"], ["bicitaxi", "mototaxi"], ["vocho", "tsuru"],
    ["caseta", "peaje"], ["transbordo", "correspondencia"], ["tarjeta de movilidad", "boleto"],
    ["ciclovía", "carril confinado"], ["glorieta", "retorno"], ["estacionamiento", "parquímetro"],
    ["carga pesada", "carga ligera"], ["aduana", "revisión"], ["vuelo nacional", "vuelo internacional"],
    ["terminal", "andén"], ["cabina", "cockpit"], ["chofer", "copiloto"], ["volante", "manubrio"]
  ],
  mitologia: [
    ["dragón", "fénix"], ["unicornio", "pegaso"], ["elfo", "hada"], ["vampiro", "hombre lobo"],
    ["zombi", "momia"], ["fantasma", "espectro"], ["bruja", "hechicero"], ["ogro", "troll"],
    ["Quetzalcóatl", "Kukulkán"], ["Huitzilopochtli", "Tezcatlipoca"], ["nahual", "brujo"], ["chupacabras", "alux"],
    ["duende", "chaneque"], ["llorona", "Xtabay"], ["mago", "brujo"], ["espada mágica", "varita"],
    ["poción", "elixir"], ["maldición", "hechizo"], ["castillo embrujado", "mansión vieja"], ["tesoro", "reliquia"],
    ["portal", "puerta mágica"], ["grimorio", "libro de hechizos"], ["runas", "jeroglíficos"], ["basilisco", "sierpe"],
    ["oráculo", "profecía"]
  ],
  bebidas: [
    ["cerveza", "chela"], ["tequila", "mezcal"], ["vodka", "ron"], ["whisky", "bourbon"],
    ["vino tinto", "vino blanco"], ["margarita", "paloma"], ["michelada", "chelada"], ["mojito", "caipiriña"],
    ["gintonic", "tom collins"], ["caguama", "caguamita"], ["tarro", "latón"], ["corona", "modelo"],
    ["tecate", "indio"], ["victoria", "pacifico"], ["caballito", "shot"], ["copa", "vaso"],
    ["pulque", "tejuino"], ["aguardiente", "piquete"], ["cantina", "bar"], ["cantarito", "caguamero"],
    ["brindis", "salud"], ["resaca", "cruda"], ["agua mineral", "refresco"], ["café de olla", "americano"],
    ["chocolate caliente", "atole"]
  ],
  moda: [
    ["tenis", "zapatos"], ["chamarra", "suéter"], ["playera", "camiseta"], ["jeans", "pants"],
    ["falda", "vestido"], ["corbata", "moño"], ["sombrero", "gorra"], ["bufanda", "chalina"],
    ["reloj", "pulsera"], ["aretes", "collar"], ["lentes de sol", "lentes normales"], ["mochila", "bolsa"],
    ["cinturón", "tirantes"], ["tacones", "flats"], ["oversize", "ajustado"], ["vintage", "retro"],
    ["streetwear", "formal"], ["y2k", "aesthetic"], ["marca de lujo", "marca económica"], ["imitación", "auténtico"],
    ["outfit", "look"], ["tendencia", "clásico"], ["nike", "adidas"], ["zara", "bershka"],
    ["paca", "boutique"]
  ],
  salud: [
    ["gym", "crossfit"], ["yoga", "pilates"], ["dieta", "régimen"], ["proteína", "creatina"],
    ["suplemento", "vitamina"], ["acupuntura", "masaje"], ["terapia", "consulta"], ["ansiedad", "estrés"],
    ["insomnio", "jet lag"], ["migrana", "dolor de cabeza"], ["alergia", "intolerancia"], ["médico general", "especialista"],
    ["hospital", "clínica"], ["urgencias", "hospitalización"], ["receta", "diagnóstico"], ["análisis", "estudios"],
    ["rayos X", "resonancia"], ["vacuna", "inyección"], ["pastilla", "cápsula"], ["seguro social", "hospital privado"],
    ["remedio casero", "fármaco"], ["curandero", "médico"], ["huesero", "quiropráctico"], ["sobador", "terapeuta"],
    ["bienestar", "condición física"]
  ],
  educacion: [
    ["primaria", "secundaria"], ["prepa", "bachillerato"], ["universidad", "instituto"], ["licenciatura", "ingeniería"],
    ["maestría", "doctorado"], ["escuela pública", "escuela privada"], ["SEP", "UNAM"], ["conalep", "cetis"],
    ["examen", "prueba"], ["tarea", "proyecto"], ["exposición", "reporte"], ["tesis", "tesina"],
    ["titulación", "cédula"], ["en línea", "presencial"], ["clase virtual", "clase híbrida"], ["tutor", "asesor"],
    ["biblioteca", "sala de lectura"], ["uniforme", "ropa casual"], ["cuaderno", "libreta"], ["lápiz", "pluma"],
    ["calculadora", "app"], ["resumen", "mapa mental"], ["parcial", "final"], ["beca", "crédito educativo"],
    ["regularización", "extraordinario"]
  ],
  regiones: [
    ["CDMX", "Guadalajara"], ["Monterrey", "Tijuana"], ["Oaxaca", "Chiapas"], ["Cancún", "Los Cabos"],
    ["Veracruz", "Tabasco"], ["Puebla", "Querétaro"], ["Mérida", "Campeche"], ["San Luis Potosí", "Aguascalientes"],
    ["Sonora", "Sinaloa"], ["Chihuahua", "Durango"], ["Guanajuato", "Michoacán"], ["Jalisco", "Nayarit"],
    ["Tamaulipas", "Nuevo León"], ["Zacatecas", "Coahuila"], ["Hidalgo", "Tlaxcala"], ["Morelos", "Guerrero"],
    ["chilango", "foráneo"], ["norteño", "sureño"], ["costeño", "serrano"], ["tapatío", "regio"],
    ["chamaco", "escuincle"], ["jarocho", "yucateco"], ["azteca", "maya"], ["mariachi", "banda"],
    ["acento norteño", "acento chilango"], ["acento costeño", "acento oaxaqueño"],
    ["güey", "wey"], ["órale", "ándale"], ["chido", "padre"], ["qué onda", "qué pasó"],
    ["cuate", "mano"], ["chamba norteña", "chamba capitalina"], ["rancho", "colonia"],
    ["pozole guerrerense", "pozole tapatío"], ["mole oaxaqueño", "mole poblano"],
    ["cochinita yucateca", "carnitas michoacanas"], ["tlayuda oaxaqueña", "gordita norteña"],
    ["taco de birria jalisciense", "taco de suadero chilango"], ["mezcal oaxaqueño", "tequila jaliscience"],
    ["cenote yucateco", "playa veracruzana"], ["playa guerrerense", "playa sinaloense"],
    ["norteño de rancho", "chilango de delegación"], ["tijuanense", "fronterizo"],
    ["defeño", "capitalino"], ["provinciano", "de rancho"], ["regiovisión", "Canal 2"],
    ["Chivas de Guadalajara", "Rayados de Monterrey"]
  ],
  peda: [
    ["Tequila", "Mezcal"], ["Cerveza", "Caguama"], ["Vodka", "Ron"], ["Shot", "Fondo"],
    ["Azulito", "Pitufo"], ["Licuachela", "Michelada"], ["Kittychela", "Rotochela"], ["Caguamón", "Cartón"],
    ["Margarita", "Paloma"], ["Hielo", "Vaso"], ["Barman", "Mesero"], ["Aguas locas", "Tonayán"],
    ["Chelada", "Clara"], ["Whisky", "Brandy"], ["Caballito", "Jarro"],
    ["Vino tinto", "Vino blanco"], ["Pulque", "Tepache"], ["Piña colada", "Cuba libre"],
    ["Borracho", "Crudo"], ["Cantina", "Antro"], ["Mala copa", "Impertinente"], ["Pedísimo", "Hasta las chanclas"],
    ["Precopeo", "Calentando motores"], ["Cadenero", "Sacaborrachos"], ["Brindis", "Salud"], ["Descorchar", "Destapar"],
    ["After", "Conecte"], ["Vomitar", "Cruzarse"], ["Cruda", "Resaca"], ["Borrachera", "Peda"],
    ["Barra libre", "Dos por uno"], ["Last call", "Hora feliz"], ["Boteo", "Cooperacha"],
    ["Yo nunca nunca", "Verdad o Reto"], ["Botella", "Ruleta"], ["Castigo", "Prenda"], ["Shot de castigo", "Trago de cortesía"],
    ["Bailar", "Cantar"], ["DJ", "Bocina"], ["Karaoke", "Micrófono"],
    ["Perreo", "Bellakeo"], ["Perreo intenso", "Hasta el suelo"], ["Baile lento", "Bailar cumbia"],
    ["Botana", "Cacahuates"], ["Jarana", "Reventón"], ["Cover", "Entrada"],
    ["Fiesta de XV", "Boda"], ["Cruz", "Jarra"], ["Pisto", "Chupe"], ["Limón", "Sal"],
    ["Six de chelas", "Doce de chelas"], ["Tecate", "Corona"], ["Victoria", "Indio"], ["Bacardí", "Smirnoff"],
    ["Mojito", "Caipirinha"], ["Buchanans", "Red Label"], ["Jägermeister", "Perla Negra"], ["Boost", "Red Bull"],
    ["Gomarindo", "Chamoy"], ["Cantarito", "Cazuela"], ["Botellas", "Buchones"], ["Racer", "Yate"],
    ["VIP", "Zona general"], ["Baño lleno", "Miar en la calle"], ["Malilla", "Bajón"], ["Tacos de pastor", "Dogos"],
    ["Tonayán", "Aguardiente"], ["Xtabentún", "Mezcal artesanal"], ["Charanda", "Ron de caña"],
    ["Sotol", "Bacanora"], ["Raicilla", "Comiteco"], ["Rompope", "Licor de café"],
    ["Cerveza artesanal", "Cerveza de caguama"], ["michelada de clamato", "michelada de chamoy"],
    ["chela preparada", "chela de barril"], ["shot de tequila", "shot de mezcal"],
    ["peda de graduación", "peda de quince"], ["peda familiar en el rancho", "peda en el rooftop"],
    ["irse de after", "quedarse a dormir"], ["caer de peda", "llegar de sorpresa"],
    ["cruda moral", "cruda física"], ["borracho feliz", "borracho triste"],
    ["el que se duerme primero", "el que aguanta más"], ["el que paga la primera", "el que se esconde al pagar"],
    ["anfitrión de la peda", "invitado sin avisar"], ["botana de chicharrón", "botana de papas"],
    ["copa de más", "copa de menos"], ["brindis emotivo", "brindis de compromiso"],
    ["acabarse el hielo", "acabarse los vasos"], ["ir por más chelas", "no traer dinero"]
  ]
};
// After localWords close, before themes

const themes = [
  { key: "aleatorio", label: "Aleatorio" },
  { key: "comida", label: "Comida" },
  { key: "lugares", label: "Lugares" },
  { key: "objetos", label: "Objetos" },
  { key: "transporte", label: "Transporte" },
  { key: "tecnologia", label: "Tecnología" },
  { key: "deportes", label: "Deportes" },
  { key: "animales", label: "Animales" },
  { key: "profesiones", label: "Profesiones" },
  { key: "peliculas", label: "Películas" },
  { key: "musica", label: "Música" },
  { key: "historia", label: "Historia" },
  { key: "mitologia", label: "Mitología" },
  { key: "naturaleza", label: "Naturaleza" },
  { key: "bebidas", label: "Bebidas" },
  { key: "moda", label: "Moda" },
  { key: "salud", label: "Salud" },
  { key: "educacion", label: "Educación" },
  { key: "sofi", label: "Sofi" },
  { key: "memes", label: "Memes" },
  { key: "redes", label: "Redes Sociales" },
  { key: "videojuegos", label: "Videojuegos" },
  { key: "regiones", label: "Regiones MX" },
  { key: "adulto", label: "+18", adult: true },
  { key: "peda", label: "Peda", adult: true }
];
const BUILTIN_THEME_COUNT = themes.length;

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
const startBtn = document.getElementById("startGameBtn"); // Guard against ReferenceError
const resetBtn = document.getElementById("resetBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const soundToggleBtn = document.getElementById("soundToggleBtn");
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

const CONFIG_KEY = "impostorConfigV1";

function loadSavedConfig() {
  try { return JSON.parse(localStorage.getItem(CONFIG_KEY)) || {}; } catch { return {}; }
}
function saveConfig() {
  if (state.gameActive || state.round) return; // Don't over-save during active games, mostly for config
  try {
    const cfg = {
      playerCount: state.playerNames.length > 0 ? Math.max(3, state.playerNames.length) : state.playerCount,
      impostorCount: state.impostorCount,
      whiteCount: state.whiteCount,
      includeAdultTheme: state.includeAdultTheme,
      timerMinutes: state.timerTotalSeconds / 60,
      swipeSensitivity: state.swipeSensitivity,
      selectedTheme: state.selectedTheme,
      disabledSubcategories: state.disabledSubcategories
    };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
  } catch { }
}

const savedCfg = loadSavedConfig();

const state = {
  round: null,
  revealIndex: 0,
  roleIsVisible: false,
  selectedTheme: savedCfg.selectedTheme || "aleatorio",
  includeAdultTheme: savedCfg.includeAdultTheme || false,
  spanishOnly: false,
  showAdvanced: false,
  timerSeconds: (savedCfg.timerMinutes || 2) * 60,
  timerTotalSeconds: (savedCfg.timerMinutes || 2) * 60,
  timerHandle: null,
  swipeStartY: 0,
  swipeStartX: 0,
  swipeDragging: false,
  swipePointerId: null,
  swipeAxisLocked: false,
  swipeVerticalGesture: false,
  swipeOffset: 0,
  swipeSensitivity: savedCfg.swipeSensitivity || "suave",
  playerNames: loadSavedNames(),
  playerCount: savedCfg.playerCount || 6,
  impostorCount: savedCfg.impostorCount || 1,
  whiteCount: savedCfg.whiteCount || 0,
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
  gameOver: false,
  disabledSubcategories: savedCfg.disabledSubcategories || []
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
    showConfirmModal("¿Borrar todo el historial?", () => {
      saveStats({ gamesPlayed: 0, rounds: [] });
      renderStats();
      showToast("Historial borrado");
    });
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
  while (themes.length > BUILTIN_THEME_COUNT) themes.pop();
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
  "one night stand", "after", "shot", "stripper", "pole dance", "vip", "red flag", "voyeur", "pack", "bdsm", "milf",
  "airdrop", "smart home", "captcha", "token", "wallet digital", "deepfake", "chatbot", "prompt", "reels", "shorts",
  "close friends", "streak", "trend", "challenge", "dueto", "stitch", "shadowban", "crossplay", "ranked", "casual",
  "speedrunner", "loot box", "streetwear", "y2k", "aesthetic", "oversize", "crossfit", "bourbon", "tom collins", "cockpit"
]);

function getThemePool(themeKey, includeAdult) {
  let initialPool = [];

  function extractPairs(themeValue, currentThemeKey) {
    if (Array.isArray(themeValue)) return themeValue;
    // Object format (Subcategories)
    const pairs = [];
    for (const [subName, subPairs] of Object.entries(themeValue)) {
      if (!state.disabledSubcategories.includes(`${currentThemeKey}:${subName}`)) {
        pairs.push(...subPairs);
      }
    }
    return pairs;
  }

  function getAvailableThemeKeys(useAdultThemes) {
    return themes
      .filter(t => t.key !== "aleatorio")
      .filter(t => useAdultThemes || !t.adult)
      .map(t => t.key)
      .filter(key => localWords[key]);
  }

  if (themeKey === "aleatorio") {
    initialPool = getAvailableThemeKeys(includeAdult)
      .flatMap(k => extractPairs(localWords[k], k));
  } else if (themeKey === "adulto" && !includeAdult) {
    initialPool = getAvailableThemeKeys(false)
      .flatMap(k => extractPairs(localWords[k], k));
  } else {
    initialPool = extractPairs(localWords[themeKey] ?? localWords.aleatorio, themeKey);
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

function clearRoundPresentation() {
  finalResult.classList.add("hidden");
  voteList.innerHTML = "";
  voteResult.classList.add("hidden");
  voteResult.textContent = "";
  if (shareResultBtn) shareResultBtn.classList.add("hidden");
  if (gameOverPanel) gameOverPanel.classList.add("hidden");
  if (roundHistoryLog) roundHistoryLog.classList.add("hidden");
  if (roundHistoryList) roundHistoryList.innerHTML = "";
  if (newRoundBtn) {
    newRoundBtn.disabled = false;
    newRoundBtn.classList.remove("hidden");
  }
  const badge = document.querySelector(".eliminated-badge");
  if (badge) badge.remove();
  if (backHomeBtn) {
    backHomeBtn.textContent = "🏠 Volver al inicio";
    backHomeBtn.classList.remove("new-game-btn");
  }
  timerDisplay.classList.remove("timer-urgent", "timer-finished");
  setRoundStatus("");
  setRoundPhase("debate");
  renderTimer();
}

function resetRoundState({ preserveConfig = false } = {}) {
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
  clearRoundPresentation();
  if (!preserveConfig) {
    playersInput.disabled = false;
    impostorsInput.disabled = false;
    whitesInput.disabled = false;
    showMainView("home");
  }
}

async function launchConfiguredGame() {
  try {
    startBtn.disabled = true;
    state.round = await createRound();

    if (typeof gtag === "function") {
      gtag("event", "game_start", {
        theme: state.round.theme,
        players: state.round.roles.length,
        impostors: state.round.roles.filter(r => r.role === "impostor").length
      });
    }

    state.revealIndex = 0;
    state.roundNumber += 1;
    state.gameActive = true;
    if (state.persistentRoles) {
      playersInput.disabled = true;
      impostorsInput.disabled = true;
      whitesInput.disabled = true;
    }
    if (newRoundBtn && state.persistentRoles) newRoundBtn.classList.add("hidden");
    if (roundNumberEl) roundNumberEl.textContent = state.roundNumber;
    finalResult.classList.add("hidden");
    await playSorteoAnimation(state.round.roles);
    enterGameMode();
    dealSection.classList.remove("hidden");
    roundSection.classList.add("hidden");
    gameProgressBar.style.width = "0%";
    showHandoffScreen();
    showToast("¡Ronda creada! A jugar");
  } catch (error) {
    console.error(error);
    showToast(error.message || "No se pudo crear la ronda.", "error");
  } finally {
    startBtn.disabled = false;
  }
}

async function replayWithSameSetup() {
  resetRoundState({ preserveConfig: true });
  await launchConfiguredGame();
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

  let inlineTitleStyle = "opacity: 0.9;";
  let inlineWordStyle = "font-size: 2.2rem!important; margin: 16px 0!important; font-weight: 900!important; line-height: 1.1;";

  if (item.role === "civil") {
    inlineTitleStyle = "color: #29b6f6; opacity: 0.9;";
    inlineWordStyle = "color: #29b6f6; font-size: 2.2rem!important; margin: 16px 0!important; font-weight: 900!important; line-height: 1.1;";
  } else if (item.role === "impostor") {
    inlineTitleStyle = "color: #ff4757; opacity: 0.9;";
    inlineWordStyle = "color: #ff4757; font-size: 2.2rem!important; margin: 16px 0!important; font-weight: 900!important; line-height: 1.1;";
  }

  roleCard.innerHTML = `
    <span class="role-emoji" style="border-radius:50%;background:var(--surface);width:80px;height:80px;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;box-shadow:0 4px 12px rgba(0,0,0,0.15)">${getRoleEmoji(item.role)}</span>
    <h3 class="${roleClass}" style="${inlineTitleStyle}">Eres: ${escapeHtml(roleName)}</h3>
    <p class="${wordClass}" style="${inlineWordStyle}">${escapeHtml(item.word)}</p>
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
  const mult = 0.9;
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
      <div class="sorteo-content round-starter-modal">
        <div class="sorteo-icon">🎲</div>
        <h2 class="sorteo-title">¡Empieza a hablar!</h2>
        <div class="sorteo-cards">
          <div class="sorteo-card sorted" style="width: auto; padding: 10px 20px; font-size: 1.2rem; color: #fff;">
            ${escapeHtml(starter.name)}
          </div>
        </div>
        <p class="sorteo-sub">Da la primera pista</p>
        <button id="startAfterDealBtn" class="btn-primary round-starter-btn" style="margin-top: 10px; width: 100%">
          ¡A jugar!
        </button>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector("#startAfterDealBtn").addEventListener("click", () => {
      overlay.remove();
      SFX.click();
      startTimer();
    });
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
        </div>
        <div class="game-over-actions">
          <button id="replayGameBtn" class="primary-action replay-game-btn" type="button">🔄 Volver a jugar</button>
          <button id="shareGameOverBtn" class="secondary share-btn game-over-share-btn" type="button">📤 Compartir resultado</button>
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
        </div>
        <div class="game-over-actions">
          <button id="replayGameBtn" class="primary-action replay-game-btn" type="button">🔄 Volver a jugar</button>
          <button id="shareGameOverBtn" class="secondary share-btn game-over-share-btn" type="button">📤 Compartir resultado</button>
        </div>`;
    }

    // Bind share button
    setTimeout(() => {
      const replayBtn = document.getElementById("replayGameBtn");
      const btn = document.getElementById("shareGameOverBtn");
      if (replayBtn) replayBtn.addEventListener("click", replayWithSameSetup);
      if (btn && typeof handleShareResult === "function") {
        btn.addEventListener("click", () => handleShareResult(gameOverContent, btn));
      }
    }, 50);
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

  // Toggle SEO layer visibility
  const seoLayer = document.getElementById("seoContentLayer");
  if (seoLayer) seoLayer.style.display = view === "home" ? "block" : "none";

  if (menuSection) menuSection.classList.toggle("hidden", view !== "home");
  if (categorySection) categorySection.classList.toggle("hidden", view !== "categories");
  if (controlsSection) controlsSection.classList.toggle("hidden", view !== "play" && view !== "peda");
  if (helpSection) helpSection.classList.toggle("hidden", view !== "help");
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
  const count = state.playerNames.length;
  // Sync the hidden inputs value to prevent mismatch in other logic
  if (playersInput) playersInput.value = count;
  if (btnPlayersCount) btnPlayersCount.textContent = count;

  playerNamesContainer.innerHTML = "";
  for (let i = 1; i <= count; i += 1) {
    const wrapper = document.createElement("div");
    wrapper.className = "player-name-input";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "8px";

    const num = document.createElement("span");
    num.className = "pn-number";
    num.textContent = i;

    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 16;
    input.placeholder = `Jugador ${i}`;
    input.value = state.playerNames[i - 1] || "";
    input.style.flex = "1";
    input.addEventListener("input", () => {
      state.playerNames[i - 1] = input.value.trim();
      saveNames();
    });

    wrapper.appendChild(num);
    wrapper.appendChild(input);

    // Add delete button if more than 3 players
    if (count > 3) {
      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.textContent = "🗑️";
      delBtn.style.background = "transparent";
      delBtn.style.border = "none";
      delBtn.style.fontSize = "1.2rem";
      delBtn.style.cursor = "pointer";
      delBtn.style.padding = "4px 8px";
      delBtn.style.opacity = "0.7";
      delBtn.addEventListener("click", () => {
        state.playerNames.splice(i - 1, 1);
        renderPlayerNameInputs();
        updateUISettings();
        if (typeof SFX !== "undefined" && SFX.click) SFX.click();
      });
      wrapper.appendChild(delBtn);
    }

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

// (renderThemeChips moved to before INIT section, uses categoryGrid)


// ============= RESET =============
function resetRound() {
  resetRoundState();
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
startBtn.addEventListener("click", launchConfiguredGame);

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

setSwipeSensitivity("normal");

if (toggleCustomPacksBtn && customPacksPanel) {
  toggleCustomPacksBtn.addEventListener("click", () => {
    customPacksPanel.classList.toggle("hidden");
    renderCustomPacksList();
  });
}
if (addCustomPackBtn) addCustomPackBtn.addEventListener("click", addCustomPackFromForm);

// (Listeners movidos a la sección principal superior)
// ============= CATEGORY RENDERING =============
function renderThemeChips() {
  if (!categoryGrid) return;
  categoryGrid.innerHTML = "";

  const categoryStyles = {
    aleatorio: { color: "#ff7b54", icon: "\u{1F3B2}", name: "Aleatorio" },
    comida: { color: "#00e676", icon: "\u{1F354}", name: "Comida" },
    lugares: { color: "#e040fb", icon: "\u{1F4CD}", name: "Lugares" },
    objetos: { color: "#4dabf7", icon: "\u{1F527}", name: "Objetos" },
    transporte: { color: "#26a69a", icon: "\u{1F68C}", name: "Transporte" },
    tecnologia: { color: "#26c6da", icon: "\u{1F4BB}", name: "Tecnología" },
    deportes: { color: "#ffd600", icon: "\u26BD", name: "Deportes" },
    animales: { color: "#ff9100", icon: "\u{1F431}", name: "Animales" },
    profesiones: { color: "#7c4dff", icon: "\u{1F4BC}", name: "Profesiones" },
    peliculas: { color: "#ff6b81", icon: "\u{1F3AC}", name: "Películas" },
    musica: { color: "#ab47bc", icon: "\u{1F3B5}", name: "Música" },
    historia: { color: "#8d6e63", icon: "\u{1F4DC}", name: "Historia" },
    mitologia: { color: "#8e24aa", icon: "\u{1F409}", name: "Mitología" },
    naturaleza: { color: "#66bb6a", icon: "\u{1F33F}", name: "Naturaleza" },
    bebidas: { color: "#ffca28", icon: "\u{1F379}", name: "Bebidas" },
    moda: { color: "#ec407a", icon: "\u{1F457}", name: "Moda" },
    salud: { color: "#ef5350", icon: "\u{1FA7A}", name: "Salud" },
    educacion: { color: "#5c6bc0", icon: "\u{1F393}", name: "Educación" },
    sofi: { color: "#ffb6c1", icon: "\u{1F338}", name: "Sofi" },
    memes: { color: "#ffab40", icon: "\u{1F923}", name: "Memes" },
    redes: { color: "#29b6f6", icon: "\u{1F4F1}", name: "Redes" },
    videojuegos: { color: "#7e57c2", icon: "\u{1F3AE}", name: "Videojuegos" },
    regiones: { color: "#ef5350", icon: "\u{1F1F2}\u{1F1FD}", name: "Regiones MX" },
    adulto: { color: "#ff4757", icon: "\u{1F51E}", name: "+18" },
    peda: { color: "#feca57", icon: "\u{1F37B}", name: "Peda" },
    default: { color: "#c8b8d8", icon: "\u2728", name: "Personalizado" }
  };

  for (const t of themes) {
    const style = categoryStyles[t.key] || categoryStyles.default;
    const card = document.createElement("button");
    card.type = "button";
    card.className = "category-card";
    card.style.background = `linear-gradient(135deg, ${style.color}, var(--bg))`;
    card.style.border = "1px solid rgba(255,255,255,0.08)";
    card.style.borderRadius = "16px";
    card.style.padding = "20px 12px";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.alignItems = "center";
    card.style.justifyContent = "center";
    card.style.gap = "8px";
    card.style.cursor = "pointer";
    card.style.transition = "transform 0.15s, box-shadow 0.15s";
    card.style.color = "white";
    card.style.fontWeight = "700";
    card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";

    // Safe assignment using the predefined name object map. Custom packs remove the '📦' icon.
    let cleanLabel = t.custom ? t.label.replace("📦", "").trim() : style.name;
    card.innerHTML = `
      <div style="font-size:2.2rem;line-height:1">${style.icon}</div>
      <div style="font-size:0.85rem">${escapeHtml(cleanLabel)}</div>
    `;

    card.addEventListener("mouseenter", () => { card.style.transform = "translateY(-3px)"; card.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)"; });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)"; });

    card.addEventListener("click", () => {
      state.selectedTheme = t.key;
      if (t.adult) {
        state.includeAdultTheme = true;
        if (adultThemesToggle) adultThemesToggle.checked = true;
      }
      SFX.click();
      if (typeof selectedCategoryName !== 'undefined' && selectedCategoryName) selectedCategoryName.textContent = `${style.icon} ${cleanLabel}`;
      showMainView("play");
      renderSubcategories();
      saveConfig();
    });

    categoryGrid.appendChild(card);
  }
}

// ============= SUBCATEGORY RENDERING =============
function renderSubcategories() {
  const container = document.getElementById("subcategoriesContainer");
  const list = document.getElementById("subcategoriesList");
  if (!container || !list) return;

  const currentTheme = state.selectedTheme;
  const wordData = localWords[currentTheme];

  if (!wordData || Array.isArray(wordData)) {
    // Theme is a flat array, no subcategories
    container.classList.add("hidden");
    return;
  }

  // Generate subcategories UI
  container.classList.remove("hidden");
  list.innerHTML = "";

  const subcats = Object.keys(wordData);
  subcats.forEach(sub => {
    const fullKey = `${currentTheme}:${sub}`;
    const isDisabled = state.disabledSubcategories.includes(fullKey);

    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `btn-primary ${isDisabled ? "" : "active-subcat"}`;
    // Inline styling to differentiate selected vs unselected
    chip.style.padding = "6px 12px";
    chip.style.fontSize = "0.85rem";
    chip.style.borderRadius = "20px";
    chip.style.border = isDisabled ? "1px solid var(--border)" : "1px solid var(--accent)";
    chip.style.background = isDisabled ? "var(--bg)" : "var(--accent)";
    chip.style.color = isDisabled ? "var(--text2)" : "#fff";

    chip.innerHTML = `${isDisabled ? "❌" : "✅"} ${escapeHtml(sub)}`;

    chip.addEventListener("click", () => {
      SFX.click();
      if (isDisabled) {
        state.disabledSubcategories = state.disabledSubcategories.filter(k => k !== fullKey);
      } else {
        // Prevent disabling the LAST category
        const activeCount = subcats.filter(k => !state.disabledSubcategories.includes(`${currentTheme}:${k}`)).length;
        if (activeCount <= 1) {
          showToast("Debes dejar al menos una subcategoría activa", "error");
          return;
        }
        state.disabledSubcategories.push(fullKey);
      }
      saveConfig();
      renderSubcategories();
    });

    list.appendChild(chip);
  });
}

const toggleAllSubcatsBtn = document.getElementById("toggleAllSubcatsBtn");
if (toggleAllSubcatsBtn) {
  toggleAllSubcatsBtn.addEventListener("click", () => {
    const currentTheme = state.selectedTheme;
    const wordData = localWords[currentTheme];
    if (!wordData || Array.isArray(wordData)) return;

    let anyActive = false;
    const subcats = Object.keys(wordData);
    for (const sub of subcats) {
      if (!state.disabledSubcategories.includes(`${currentTheme}:${sub}`)) {
        anyActive = true;
        break;
      }
    }

    SFX.click();
    if (anyActive) {
      // Toggle all off EXCEPT the first one
      state.disabledSubcategories = state.disabledSubcategories.filter(k => !k.startsWith(`${currentTheme}:`));
      for (let i = 1; i < subcats.length; i++) {
        state.disabledSubcategories.push(`${currentTheme}:${subcats[i]}`);
      }
      toggleAllSubcatsBtn.textContent = "Marcar todas";
    } else {
      // Toggle all on
      state.disabledSubcategories = state.disabledSubcategories.filter(k => !k.startsWith(`${currentTheme}:`));
      toggleAllSubcatsBtn.textContent = "Desmarcar todas";
    }
    saveConfig();
    renderSubcategories();
  });
}

// ============= INIT =============
applyVisualTheme(localStorage.getItem("impostorTheme") || "dark");

// Pre-fill inputs from saved config
if (playersInput) {
  playersInput.value = state.playerCount;
  playersInput.addEventListener("change", (e) => { state.playerCount = Number(e.target.value); saveConfig(); });
}

// ============= UPDATE SYSTEM =============
const APP_VERSION = "1.1.0";

const UPDATE_NOTES = {
  "1.1.0": {
    title: '¡Nueva Actualización! 🌸',
    html: `
      <div style="text-align: left; font-size: 0.95rem; line-height: 1.5; padding: 0 10px;">
        <h3 style="color: #ffb6c1; margin: 0 0 5px; font-size: 1.15rem; display: flex; align-items: center; gap: 6px;">
          <span>🌸</span> Categoría: Sofi
        </h3>
        <p style="color: var(--text2); margin-top: 0; margin-bottom: 18px;">
          Resuelve los debates más otakus y kpoperos. Incluye temas de K-Pop, Anime, y dramas asiáticos.
        </p>
        
        <h3 style="color: #4dabf7; margin: 0 0 5px; font-size: 1.15rem; display: flex; align-items: center; gap: 6px;">
          <span>✨</span> Más Palabras
        </h3>
        <p style="color: var(--text2); margin-top: 0; margin-bottom: 5px;">
          Mejoramos <b>todas las categorías</b> actuales y añadimos docenas de palabras nuevas para mucha más variedad.
        </p>
      </div>
    `,
    confirmText: '¡A jugar!'
  }
};

function showNewContentAlert() { }
if (impostorsInput) {
  impostorsInput.value = state.impostorCount;
  impostorsInput.addEventListener("change", (e) => { state.impostorCount = Number(e.target.value); saveConfig(); });
}
if (whitesInput) {
  whitesInput.value = state.whiteCount;
  whitesInput.addEventListener("change", (e) => { state.whiteCount = Number(e.target.value); saveConfig(); });
}
if (adultThemesToggle) {
  adultThemesToggle.checked = state.includeAdultTheme;
}

renderThemeChips();
refreshCustomThemes();
setSwipeSensitivity(state.swipeSensitivity);
renderPlayerNameInputs();
resetRound();

// ============= SHARE RESULT =============
async function handleShareResult(resultEl, btnEl) {
  try {
    if (!resultEl) return;

    // Optional: Hide the button itself temporarily if it's inside the container being captured
    const originalDisplay = btnEl.style.display;
    btnEl.style.display = "none";

    const originalText = btnEl.innerHTML;

    // We momentarily add a background color so it doesn't render transparent
    const oldBg = resultEl.style.background;
    const oldPadding = resultEl.style.padding;
    const oldBorderRadius = resultEl.style.borderRadius;

    resultEl.style.background = "var(--bg)";
    resultEl.style.padding = "20px";
    resultEl.style.borderRadius = "16px";

    const canvas = await html2canvas(resultEl, {
      backgroundColor: "#16162a", // Match dark theme
      scale: 2
    });

    resultEl.style.background = oldBg;
    resultEl.style.padding = oldPadding;
    resultEl.style.borderRadius = oldBorderRadius;

    btnEl.style.display = originalDisplay;
    btnEl.innerHTML = "⏳ Generando imagen...";
    btnEl.disabled = true;

    canvas.toBlob(async (blob) => {
      btnEl.innerHTML = originalText;
      btnEl.disabled = false;

      if (!blob) {
        if (typeof showToast === "function") showToast("Error al generar la imagen.", "error");
        return;
      }

      const file = new File([blob], "impostor.png", { type: "image/png" });
      const shareData = {
        title: "Resultado de Impostor",
        text: "¡Mira cómo quedó la partida de Impostor! 🍻 Juega gratis con tus amigos en soyimpostor.me",
        files: [file]
      };

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share(shareData);
          if (typeof showToast === "function") showToast("Compartido 🚀");
        } catch (err) {
          if (err.name !== "AbortError" && typeof showToast === "function") {
            console.error(err);
          }
        }
      } else {
        // Fallback download if Web Share API is not supported
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "impostor-resultado.png";
        a.click();
        URL.revokeObjectURL(url);
        if (typeof showToast === "function") showToast("Imagen descargada en tu celular 📱");
      }
    }, "image/png");
  } catch (e) {
    console.error(e);
    btnEl.innerHTML = "📤 Comparte este resultado";
    btnEl.disabled = false;
    btnEl.style.display = "";
  }
}

if (shareResultBtn) {
  shareResultBtn.addEventListener("click", () => handleShareResult(document.getElementById("finalResult"), shareResultBtn));
}
