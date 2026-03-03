# 🎮 Agente Fantasma IA - Guía de operación rápida

## Estado actual (2026-03-02)
✅ **MVP v2 completo**: UI mejorada, UX pulida, integración Gemini segura

## 🚀 Levantar la app

### Opción 1: Solo local (sin IA, sin backend)
```bash
npm run dev
# Abre http://localhost:5173
# ... juega con palabras predefinidas
```

### Opción 2: Local + Backend mock (para probar IA localmente)
**Terminal 1**:
```bash
npm run dev
```

**Terminal 2** (en nueva terminal):
```bash
# Sin Gemini key (fallback local automático)
node api-dev-server.js

# O con Gemini key (edita .env.local antes)
# GEMINI_API_KEY=<tu_nueva_key> node api-dev-server.js
```

Marca casilla "Usar IA" en la app → usa backend local.

## 📝 Cambios principales de UX

| Antes | Ahora |
|-------|-------|
| Botones pequeños | Botones grandes, full-width en móvil |
| Sin indicación de carga | Loading spinner visible con aria-live |
| Modo IA/Local confuso | Indicador claro al cambiar checkbox |
| Tarjeta de rol básica | Rol con emoji, separadores, formato limpio |
| Resultado final en bloque | Resultado formateado con ASCII art |
| Sin accesibilidad | Foco visible, labels ARIA, hints claros |

## 🔒 Seguridad

### ⚠️ KEY EXPUESTA EN CHAT
```
AIzaSyAaIdWpDRZBs9Ge1dVsrQHGpDwVtVDylUU
```

**ACCIÓN**: Elimina esta key en Google Cloud Console. Nunca vuelvas a compartir keys por chat.

### Nueva key
- Genera una en [console.cloud.google.com](https://console.cloud.google.com)
- Guarda en `.env.local` (nunca en Git):
  ```
  GEMINI_API_KEY=<nueva_key>
  GEMINI_MODEL=gemini-2.0-flash-lite
  ```

## 📦 Deploy a producción (Vercel)

```bash
# 1. Conecta GitHub (si no está)
vercel git connect

# 2. Configura env vars
vercel env add GEMINI_API_KEY <tu_key>
vercel env add GEMINI_MODEL gemini-2.0-flash-lite

# 3. Deploy
vercel deploy
```

URL será automáticamente `https://agente-fantasma.vercel.app` (o similar).

## 🧪 Testing rápido

**Scenario 1: Modo local**
1. `npm run dev`
2. Deja unchecked "Usar IA"
3. Configura: 6 jugadores, 1 impostor, 1 fantasma
4. Tema: "comida"
5. Click "Iniciar ronda"
6. Debe mostrar palabra local al instante

**Scenario 2: Modo IA (backend mock)**
1. `node api-dev-server.js` en terminal aparte
2. `npm run dev`
3. Marca "Usar IA"
4. Configura 6 jugadores, tema "lugares"
5. Click "Iniciar ronda"
6. Debe mostrar "Generando..." → luego palabra

**Scenario 3: Error IA (fallback)**
1. Detén el backend (`Ctrl+C` en terminal 2)
2. Sin marcar IA, inicia ronda → funciona (local)
3. Marca IA, inicia ronda → error → fallback a local automático

## 📊 Costos reales

- **100 partidas**: ~$0.005 (con Gemini Flash-Lite)
- **1,000 partidas**: ~$0.05
- **10,000 partidas**: ~$0.50

Con cache por tema (recomendado): 90% menos costo.

## 🐛 Debugging

**Problema**: "404 Not Found" en word-pack
- Solución: Verifica que `node api-dev-server.js` está corriendo en terminal separada

**Problema**: IA muy lenta (>3 seg)
- Solución: Espera a que cache Gemini estabilice; o cambia a Flash-Lite explícitamente

**Problema**: Inconsistent en iOS/Safari
- Solución: Actualiza el navegador; Vite HMR a veces falla en Safari

## 📚 Documentación

- `README.md` → Setup, features, arquitectura
- `DEPLOYMENT.md` → Deploy detallado y decisiones
- `RESEARCH.md` → Análisis inicial del juego original
- `api/word-pack.js` → Código backend comentado
- `api-dev-server.js` → Código servidor dev explicado

## ✉️ Próximos pasos

1. Probar con más jugadores (10+) en móvil
2. Recolectar feedback sobre UX
3. Eventualmente: multiplayer en vivo, temas custom, análisis

---

**Listo para jugar y producción** 🎮
