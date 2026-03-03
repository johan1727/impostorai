/**
 * Servidor de desarrollo local para /api/word-pack
 * Usa Gemini real si GEMINI_API_KEY está en .env.local
 * Sino, devuelve pares locales como si fuera IA
 * 
 * Uso:
 *   node api-dev-server.js
 *   Escucha en localhost:3001
 */

import dotenv from "dotenv";
import http from "node:http";
import url from "node:url";

dotenv.config({ path: ".env.local" });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite';
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

// Fallback local (iguales a localWords en main.js)
const localWordPacks = {
  aleatorio: [
    { secretWord: 'volcán', decoyWord: 'montaña', aiContext: 'Formaciones naturales elevadas' },
    { secretWord: 'wifi', decoyWord: 'bluetooth', aiContext: 'Conexiones inalámbricas' },
    { secretWord: 'mango', decoyWord: 'papaya', aiContext: 'Frutas tropicales' },
    { secretWord: 'biblioteca', decoyWord: 'museo', aiContext: 'Lugares de cultura' },
    { secretWord: 'satélite', decoyWord: 'cohete', aiContext: 'Objetos del espacio' }
  ],
  comida: [
    { secretWord: 'pizza', decoyWord: 'lasaña', aiContext: 'Platos italianos' },
    { secretWord: 'taco', decoyWord: 'burrito', aiContext: 'Comida mexicana' },
    { secretWord: 'café', decoyWord: 'té', aiContext: 'Bebidas calientes' },
    { secretWord: 'sushi', decoyWord: 'ramen', aiContext: 'Comida japonesa' }
  ],
  lugares: [
    { secretWord: 'aeropuerto', decoyWord: 'terminal', aiContext: 'Transportación aérea' },
    { secretWord: 'hospital', decoyWord: 'clínica', aiContext: 'Centros médicos' },
    { secretWord: 'playa', decoyWord: 'isla', aiContext: 'Espacios costeros' },
    { secretWord: 'escuela', decoyWord: 'universidad', aiContext: 'Institutos educativos' }
  ],
  objetos: [
    { secretWord: 'teclado', decoyWord: 'ratón', aiContext: 'Periféricos de computadora' },
    { secretWord: 'paraguas', decoyWord: 'impermeable', aiContext: 'Protección de lluvia' },
    { secretWord: 'linterna', decoyWord: 'vela', aiContext: 'Fuentes de luz portátil' },
    { secretWord: 'reloj', decoyWord: 'cronómetro', aiContext: 'Medición de tiempo' }
  ],
  tecnologia: [
    { secretWord: 'nube', decoyWord: 'servidor', aiContext: 'Almacenamiento remoto' },
    { secretWord: 'robot', decoyWord: 'drone', aiContext: 'Máquinas autónomas' },
    { secretWord: 'python', decoyWord: 'javascript', aiContext: 'Lenguajes de programación' },
    { secretWord: 'token', decoyWord: 'contraseña', aiContext: 'Autenticación segura' }
  ],
  deportes: [
    { secretWord: 'fútbol', decoyWord: 'rugby', aiContext: 'Deportes de contacto' },
    { secretWord: 'natación', decoyWord: 'waterpolo', aiContext: 'Deportes acuáticos' },
    { secretWord: 'tenis', decoyWord: 'bádminton', aiContext: 'Raqueta y red' }
  ],
  animales: [
    { secretWord: 'gato', decoyWord: 'león', aiContext: 'Felinos' },
    { secretWord: 'águila', decoyWord: 'halcón', aiContext: 'Aves rapaces' },
    { secretWord: 'delfín', decoyWord: 'tiburón', aiContext: 'Vida marina' }
  ],
  profesiones: [
    { secretWord: 'doctor', decoyWord: 'enfermero', aiContext: 'Sector salud' },
    { secretWord: 'abogado', decoyWord: 'juez', aiContext: 'Ámbito legal' },
    { secretWord: 'chef', decoyWord: 'pastelero', aiContext: 'Cocina profesional' }
  ],
  peliculas: [
    { secretWord: 'terror', decoyWord: 'suspenso', aiContext: 'Géneros de cine' },
    { secretWord: 'comedia', decoyWord: 'parodia', aiContext: 'Humor' },
    { secretWord: 'marvel', decoyWord: 'dc', aiContext: 'Superhéroes' }
  ],
  musica: [
    { secretWord: 'guitarra', decoyWord: 'bajo', aiContext: 'Instrumentos de cuerda' },
    { secretWord: 'reggaetón', decoyWord: 'trap', aiContext: 'Géneros urbanos' },
    { secretWord: 'piano', decoyWord: 'órgano', aiContext: 'Teclas musicales' }
  ],
  historia: [
    { secretWord: 'egipto', decoyWord: 'roma', aiContext: 'Civilizaciones antiguas' },
    { secretWord: 'medieval', decoyWord: 'renacimiento', aiContext: 'Periodos históricos' },
    { secretWord: 'samurái', decoyWord: 'ninja', aiContext: 'Japón histórico' }
  ],
  naturaleza: [
    { secretWord: 'volcán', decoyWord: 'géiser', aiContext: 'Fenómenos geológicos' },
    { secretWord: 'bosque', decoyWord: 'selva', aiContext: 'Biomas terrestres' },
    { secretWord: 'río', decoyWord: 'cascada', aiContext: 'Agua en movimiento' }
  ],
  adulto: [
    { secretWord: 'tequila', decoyWord: 'mezcal', aiContext: 'Bebidas alcohólicas' },
    { secretWord: 'resaca', decoyWord: 'cruda', aiContext: 'Después de fiesta' },
    { secretWord: 'ligue', decoyWord: 'cita', aiContext: 'Relaciones' }
  ]
};

function getPool(theme, includeAdult) {
  if (theme === 'aleatorio') {
    const keys = Object.keys(localWordPacks).filter(key => key !== 'aleatorio' && (includeAdult || key !== 'adulto'));
    return keys.flatMap(key => localWordPacks[key]);
  }

  if (theme === 'adulto' && !includeAdult) {
    return getPool('aleatorio', false);
  }

  return localWordPacks[theme] || localWordPacks.aleatorio;
}

function getRandomPacks(theme, includeAdult, count) {
  const pool = getPool(theme, includeAdult);
  const packs = [];
  for (let index = 0; index < count; index += 1) {
    packs.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return packs;
}

async function generateWithGemini(theme, count) {
  const prompt = [
    'Eres un generador de palabras para un party game.',
    `Genera exactamente ${count} pares de palabras españolas similares pero distinguibles.`,
    `Tema: ${theme}`,
    '',
    'Responde SOLO JSON (sin markdown):',
    '{',
    '  "packs": [',
    '    { "secretWord": "palabra1", "decoyWord": "palabra2", "aiContext": "frase corta" }',
    '  ]',
    '}'
  ].join('\n');

  const fetchUrl = `${GEMINI_ENDPOINT}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(fetchUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 150 }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error('No JSON found');
  }

  const parsed = JSON.parse(jsonMatch[0]);
  const packs = Array.isArray(parsed.packs) ? parsed.packs : [];

  return packs
    .map((pack) => ({
      secretWord: String(pack.secretWord || '').trim(),
      decoyWord: String(pack.decoyWord || '').trim(),
      aiContext: String(pack.aiContext || 'Generado por IA').trim()
    }))
    .filter(pack => pack.secretWord && pack.decoyWord)
    .slice(0, count);
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  if (parsedUrl.pathname !== '/api/word-pack') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    try {
      const { theme, includeAdult, count } = JSON.parse(body);

      if (!theme) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing theme' }));
        return;
      }

      const safeCount = Math.max(1, Math.min(8, Number(count) || 1));
      let packs;

      if (GEMINI_API_KEY) {
        console.log(`[Gemini] Generando para tema: ${theme}`);
        packs = await generateWithGemini(theme, safeCount);
      } else {
        console.log(`[Local] Usando fallback para tema: ${theme}`);
        packs = getRandomPacks(theme, Boolean(includeAdult), safeCount);
      }

      if (!packs || packs.length === 0) {
        packs = getRandomPacks(theme, Boolean(includeAdult), safeCount);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ packs }));
    } catch (error) {
      console.error('❌ Error:', error.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message, fallback: 'local' }));
    }
  });
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`\n✅ Dev server escuchando en http://localhost:${PORT}`);
  console.log(`📡 Conecta desde Vite: npm run dev`);
  if (GEMINI_API_KEY) {
    console.log(`🤖 Modo: Gemini (${GEMINI_MODEL})`);
  } else {
    console.log(`📖 Modo: Local (sin Gemini)`);
    console.log(`   Crea .env.local con GEMINI_API_KEY para usar IA`);
  }
  console.log('\n⏹️  Presiona Ctrl+C para detener\n');
});
