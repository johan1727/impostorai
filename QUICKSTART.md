# 🎮 Impostor — Guía rápida

## Levantar la app

```bash
npm install
npm run dev
```

Abre `http://localhost:5173/` en tu navegador. Listo.

## Cómo jugar

1. **Configuración**: elige número de jugadores, impostores, fantasmas y tema de palabras
2. **Reparto**: pasa el dispositivo — cada jugador ve su rol y palabra en privado
3. **Discusión**: todos dan pistas sobre su palabra sin decirla directamente
4. **Votación**: voten a quién creen que es el impostor
5. **Resultado**: se revelan los roles y se asignan puntos

## Modos de juego

- **Ronda suelta**: una ronda rápida
- **Partida completa**: varias rondas con acumulación de puntos

## Packs de palabras

Las palabras están organizadas por categorías (animales, comida, países, deportes, etc.) con opción de packs +18 para adultos. Todo es local, no requiere internet después de la primera carga.

## Deploy a producción

Ver [DEPLOYMENT.md](DEPLOYMENT.md) para detalles de Vercel.

```bash
npm run build   # genera dist/
vercel deploy   # sube a Vercel
```

## Debugging

| Problema | Solución |
|----------|----------|
| Puerto 5173 ocupado | `npm run dev -- --port 5174` |
| No carga en móvil | Verifica que estés en la misma red WiFi |
| PWA no se actualiza | Limpia caché del navegador o espera a que el SW se actualice |

---

**URL producción**: https://impostorai.vercel.app/
