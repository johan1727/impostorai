/**
 * API endpoint serverless para generar pares de palabras usando Gemini.
 * Diseñado para Vercel, Netlify o CloudFlare Workers.
 * 
 * Uso: POST /api/word-pack
 * Body: { "theme": "aleatorio|...", "includeAdult": true|false, "count": 1-8 }
 * 
 * Variables de entorno requeridas:
 * - GEMINI_API_KEY: Key de Gemini (nunca en cliente)
 * - GEMINI_MODEL: Modelo a usar (ej: gemini-2.0-flash-lite, gemini-2.0-flash)
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash-lite";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

// Rate limiting simple por IP (nota: en serverless se resetea en cold start,
// pero sigue siendo útil contra ráfagas dentro de una misma instancia)
const requestMap = new Map();
const RATE_LIMIT_REQUESTS = Number(process.env.RATE_LIMIT_REQUESTS) || 10;
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000;

// Limpieza periódica para evitar memory leaks en instancias longevas
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, requests] of requestMap) {
    const recent = requests.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) {
      requestMap.delete(key);
    } else {
      requestMap.set(key, recent);
    }
  }
}

function checkRateLimit(ip) {
  cleanupExpiredEntries();
  const now = Date.now();
  const key = ip;
  
  if (!requestMap.has(key)) {
    requestMap.set(key, []);
  }
  
  const requests = requestMap.get(key);
  const recentRequests = requests.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (recentRequests.length >= RATE_LIMIT_REQUESTS) {
    return false; // Rate limited
  }
  
  recentRequests.push(now);
  requestMap.set(key, recentRequests);
  return true;
}

async function generateWithGemini(theme, count) {
  const prompt = [
    "Eres un generador de palabras para un party game de deducción social.",
    `Genera exactamente ${count} pares de palabras españolas similares pero claramente distinguibles.`,
    `Tema: ${theme}`,
    "",
    "Responde SOLO con un JSON válido (sin markdown, sin texto extra):",
    "{",
    '  "packs": [',
    '    { "secretWord": "palabra1", "decoyWord": "palabra2", "aiContext": "frase corta" }',
    "  ]",
    "}",
    "",
    "Reglas:",
    "- Palabras de 1-3 palabras máximo cada una",
    "- Ambas deben ser sustantivos o adjetivos comunes",
    "- Deben ser lo suficientemente similares para causar confusión pero diferentes en significado",
    "- aiContext es una frase corta (máx 10 palabras) que da pista general del contexto",
    "- Usa español neutro, sin acentos problemáticos"
  ].join("\n");

  const url = `${GEMINI_ENDPOINT}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 150,
        topP: 0.9
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_NONE"
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorText.slice(0, 200)}`);
  }

  const data = await response.json();

  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error("Respuesta vacía de Gemini");
  }

  const text = data.candidates[0].content.parts[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  
  if (!jsonMatch) {
    throw new Error("No se pudo parsear JSON de la respuesta Gemini");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  if (!Array.isArray(parsed.packs) || parsed.packs.length === 0) {
    throw new Error("Packs vacíos o inválidos en respuesta");
  }

  const packs = parsed.packs
    .map(item => ({
      secretWord: String(item.secretWord || "").trim(),
      decoyWord: String(item.decoyWord || "").trim(),
      aiContext: String(item.aiContext || "Adivina la palabra correcta").trim()
    }))
    .filter(item => item.secretWord && item.decoyWord);

  if (packs.length === 0) {
    throw new Error("No hubo pares válidos");
  }

  return packs;
}

// Allowed origins for CORS
const ALLOWED_ORIGINS = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  process.env.FRONTEND_URL
].filter(Boolean));

function getCorsOrigin(req) {
  const origin = req.headers.origin || "";
  if (ALLOWED_ORIGINS.has(origin)) return origin;
  // In production, allow any *.vercel.app subdomain
  if (/^https:\/\/[\w-]+\.vercel\.app$/.test(origin)) return origin;
  return ALLOWED_ORIGINS.values().next().value;
}

// Handler para Vercel/Netlify
export default async function handler(req, res) {
  // CORS
  const corsOrigin = getCorsOrigin(req);
  res.setHeader("Access-Control-Allow-Origin", corsOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const ip = (req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress || "unknown").trim();

    // Rate limit
    if (!checkRateLimit(ip)) {
      res.setHeader("Retry-After", String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)));
      res.status(429).json({ error: "Too many requests. Try again later." });
      return;
    }

    // Validate body exists
    if (!req.body || typeof req.body !== "object") {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const { theme, count } = req.body;

    if (!theme || typeof theme !== "string" || theme.length > 50) {
      res.status(400).json({ error: "Invalid theme parameter" });
      return;
    }

    // Sanitize: only allow known theme keys
    const validThemes = ["aleatorio","comida","lugares","objetos","tecnologia","deportes","animales","profesiones","peliculas","musica","historia","naturaleza","adulto"];
    if (!validThemes.includes(theme)) {
      res.status(400).json({ error: "Unknown theme" });
      return;
    }

    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY no está configurada");
      res.status(500).json({ error: "Server configuration error" });
      return;
    }

    const safeCount = Math.max(1, Math.min(8, Number(count) || 1));
    const packs = await generateWithGemini(theme, safeCount);

    // Cache headers para optimizar
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.status(200).json({ packs });
  } catch (error) {
    console.error("Error en word-pack:", error);
    res.status(500).json({
      error: "Failed to generate word pack",
      fallback: "Use local mode"
    });
  }
}
