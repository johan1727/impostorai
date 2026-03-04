# Despliegue — Impostor

## Arquitectura actual

Impostor es una **app 100% frontend** (Vite + vanilla JS) desplegada como **PWA estática** en Vercel. No hay backend, API, ni dependencias de servidor.

```
index.html
src/
  main.js      ← toda la lógica del juego
  style.css    ← estilos responsive
public/
  manifest.json
  sw.js        ← Service Worker (offline)
  icon.svg / icon-maskable.svg
```

## Vercel (producción)

El repo está conectado a Vercel con auto-deploy desde `main`.

- **URL**: `https://impostorai.vercel.app/`
- **Build command**: `npm run build`
- **Output**: `dist/`
- **Framework**: Vite

No se requieren variables de entorno ni configuración especial.

### vercel.json

Contiene:
- Headers de seguridad (CSP, X-Frame-Options, Referrer-Policy, etc.)
- Cache headers para assets estáticos
- Rewrite `/*` → `/index.html` para SPA

### Deploy manual (si fuera necesario)

```bash
npm install -g vercel
vercel link
vercel deploy --prod
```

## Desarrollo local

```bash
npm install
npm run dev
# → http://localhost:5173/
```

## PWA

- `manifest.json` define nombre, colores y modo standalone
- `sw.js` cachea todos los assets para uso offline (cache v6)
- Se registra automáticamente desde `main.js`

## Analytics

Vercel Analytics está integrado vía `@vercel/analytics`:
- Se inyecta en `main.js` con `inject()`
- CSP permite `va.vercel-scripts.com` y `vitals.vercel-insights.com`

## Estructura de archivos

```
.
├── index.html              # UI principal
├── src/
│   ├── main.js            # Lógica de juego, estado, rendering
│   └── style.css          # Estilos responsive + temas
├── public/
│   ├── manifest.json      # PWA manifest
│   ├── sw.js              # Service Worker
│   ├── icon.svg           # Ícono principal
│   ├── icon-maskable.svg  # Ícono maskable (Android)
│   └── robots.txt
├── vercel.json            # Config Vercel (headers, rewrites)
├── vite.config.js         # Config Vite (vacío, defaults)
├── package.json
└── README.md
```

---

**Última actualización**: Junio 2025
