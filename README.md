# Agente Fantasma IA (Fork inspirado)

Juego web de deducción social inspirado en el género **"Who is the Impostor"**, construido como fork **original** (sin usar marca/arte/texto del juego comercial).

## ✨ Features

- **Flujo completo de partida**: configuración → reparto secuencial de roles privados → discusión → revelado final
- **Roles variados**: civiles, impostores, agentes fantasma (sin palabra)
- **Modo local**: palabras predefinidas por tema, sin dependencias externas
- **Modo IA (Gemini)**: generación dinámica de pares de palabras vía backend proxy seguro
- **UI moderna y responsive**: accesible en desktop, tablet y móvil; contraste AA, navegación por teclado
- **Arquitectura segura**: API key en backend, nunca expuesta en cliente; rate limiting y CORS estricto

## 🚀 Inicio rápido

### Desarrollo local (modo offline)

```bash
npm install
npm run dev
```

La app está en `http://localhost:5173/`. Usa el **modo local** por defecto (palabras predefinidas).

### Desarrollo con Gemini (backend mock)

En desarrollo, Vite proxy intenta conectar a `localhost:3001`. Si no existe, usa fallback local automático.

Para usar Gemini real, necesitas un backend (paso siguiente).

## 🔒 Seguridad y configuración

### ⚠️ API Key Gemini expuesta

**LA KEY COMPARTIDA EN CHAT (AIzaSyAaIdWpDRZBs9Ge1dVsrQHGpDwVtVDylUU) YA ESTÁ COMPROMETIDA. DEBE SER REVOCADA INMEDIATAMENTE.**

1. Ve a Google Cloud Console > APIs & Services > Credentials
2. Encuentra y elimina la key expuesta
3. Genera una nueva key de Gemini API
4. **NUNCA EXPONGAS KEYS EN CHAT/MAIL/GIT PÚBLICO**

### Backend proxy (recomendado para producción)

La key **siempre vive en el servidor**, nunca en el navegador.

#### Opción A: Vercel (1-click deploy)

1. Crea cuenta en `vercel.com`
2. Conecta este repo (GitHub)
3. Variables de entorno:
   ```
   GEMINI_API_KEY=<tu_nueva_key>
   GEMINI_MODEL=gemini-2.0-flash-lite
   FRONTEND_URL=https://agente-fantasma.vercel.app
   ```
4. Deploy automático

El archivo `vercel.json` ya configura las rutas y build correctos.

#### Opción B: Netlify Functions

```bash
npm install -g netlify-cli
netlify init
netlify deploy
```

Copia `.env.example` a `.env` con tus valores.

#### Opción C: CloudFlare Workers

Adapta `api/word-pack.js` a la sintaxis de Workers. Guía: [cloudflare.com/workers](https://cloudflare.com/workers)

### Desarrollo local seguro (con backend mock)

1. Crea `.env.local`:
   ```
   GEMINI_API_KEY=<tu_key>
   GEMINI_MODEL=gemini-2.0-flash-lite
   FRONTEND_URL=http://localhost:5173
   ```

2. Levanta endpoint local (ejemplo con Node.js):
   ```bash
   node -e "require('./api-dev-server.js')"
   ```
   (Ver archivo `api-dev-server.js` incluido)

3. `npm run dev` ya proxy-patea a `localhost:3001`

## 💰 Costos estimados

- **Gemini 2.0 Flash-Lite**: ~$0.04 USD por 1M input tokens, ~$0.16M output tokens → ~$1 por 50,000 partidas (asumiendo ~20 tokens por pack generado)
- Cache de packs por tema reduce ~90% de llamadas a IA
- Fallback local automático es 100% gratuito

## 📋 Estructura del proyecto

```
.
├── index.html              # UI principal
├── src/
│   ├── main.js            # Lógica de juego y estado
│   └── style.css          # Estilos responsive
├── api/
│   └── word-pack.js       # Endpoint serverless Gemini
├── vercel.json            # Config Vercel deploy
├── vite.config.js         # Vite + proxy local
├── .env.example           # Template variables
└── README.md              # Esta guía
```

## 🎮 Cómo jugar

1. **Configuración**: eligie # de jugadores, impostores, agentes fantasma y tema
2. **Modo IA** (opcional): marca casilla para usar Gemini; en modo local, omite
3. **Iniciar ronda**: backend genera (o fallback local) palabra civil + impostor
4. **Reparto**: pasa dispositivo; cada jugador ve su rol privadamente
5. **Discusión**: todos dan pistas sin decir la palabra exacta; observan comportamientos
6. **Revelado**: vote al sospechoso; revela quiénes eran civiles/impostores

## 🔧 Debugging

### Modo local no genera palabras

- Verifica `localWords` object en `src/main.js`
- Recarga navegador (Ctrl+Shift+R)

### Modo IA da error

- Abre DevTools (F12) > Console
- Si error es "rate limit": espera 1 minuto
- Si error es parsing: backend devolvió JSON inválido; revisa logs
- Fallback a local automático

### Vite proxy no conecta

- Verifica que `npm run dev` muestra "ready in 341ms"
- Si dice puerto 5173 ocupado: `npm run dev -- --port 5174`

## 📜 Licencia y créditos

- Inspirado en mecánicas públicas del género social deduction
- No usa código/assets/marca del juego comercial original
- Frontend con Vite, sin frameworks pesados
- Backend serverless listo para escalar
