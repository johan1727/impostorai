# Impostor — Juego de deducción social

Juego web tipo **"¿Quién es el impostor?"** para jugar en persona pasando un solo dispositivo. Construido con Vite + vanilla JS, desplegado como PWA en Vercel.

## ✨ Features

- **Flujo completo**: configuración → reparto privado de roles → discusión → votación → resultado
- **Roles**: civiles, impostores, fantasmas (sin palabra)
- **Partida completa**: múltiples rondas con acumulación de puntos
- **+800 palabras** curadas en español mexicano, organizadas por categoría
- **Packs +18**: palabras para adultos (activables en configuración)
- **Multi-impostor**: soporte para 1-3 impostores con reveal compartido
- **PWA instalable**: funciona offline, se instala como app nativa
- **Tema claro/oscuro**: toggle automático o manual
- **UI responsive**: optimizada para móvil, tablet y desktop
- **Vercel Analytics**: tracking de uso integrado

## 🚀 Inicio rápido

```bash
npm install
npm run dev
```

Abre `http://localhost:5173/` y listo para jugar.

## 🎮 Cómo jugar

1. **Configura** la ronda: jugadores, impostores, fantasmas, categoría de palabras
2. **Reparte roles**: pasa el dispositivo a cada jugador para ver su rol en privado
3. **Discusión**: cada jugador da pistas sobre su palabra sin decirla directamente
4. **Votación**: todos votan a quién creen que es el impostor
5. **Resultado**: se revelan roles, palabras y puntos

### Roles

| Rol | Sabe la palabra? | Objetivo |
|-----|:-:|----------|
| Civil | ✅ Palabra secreta | Detectar al impostor |
| Impostor | ❌ Palabra señuelo | Pasar desapercibido |
| Fantasma | ❌ Sin palabra | Sobrevivir sin ser votado |

## 📦 Deploy

Desplegado automáticamente en Vercel desde `main`.

- **URL**: https://impostorai.vercel.app/
- No requiere variables de entorno ni backend

Ver [DEPLOYMENT.md](DEPLOYMENT.md) para detalles técnicos.

## 📋 Estructura del proyecto

```
.
├── index.html              # UI principal (SPA)
├── src/
│   ├── main.js            # Lógica de juego, estado, rendering
│   └── style.css          # Estilos responsive + temas claro/oscuro
├── public/
│   ├── manifest.json      # PWA manifest
│   ├── sw.js              # Service Worker (offline cache)
│   ├── icon.svg           # Ícono app
│   └── icon-maskable.svg  # Ícono maskable (Android)
├── vercel.json            # Headers de seguridad + rewrites
├── vite.config.js         # Config Vite
└── package.json
```

## 🔧 Debugging

| Problema | Solución |
|----------|----------|
| Puerto 5173 ocupado | `npm run dev -- --port 5174` |
| PWA no actualiza | Limpia caché del navegador |
| Palabras no aparecen | Recarga con `Ctrl+Shift+R` |

## 📜 Licencia

Proyecto inspirado en mecánicas públicas del género social deduction. No usa código, assets ni marcas de juegos comerciales.
