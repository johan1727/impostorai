# Investigación rápida del diseño (2026-03-02)

## Producto analizado
- App: `Impostor - Quien es el Espía` (`pt.cosmicode.imposter`)
- Plataformas visibles: Android y Windows (Google Play Games para PC)

## Señales de diseño observadas
- Bucle principal: reparto de rol secreto -> pista breve por turno -> debate -> votación -> eliminación/revelado.
- Roles clave: civil, impostor y jugador sin palabra (tipo “Mr. White”).
- Escalabilidad social: soporte para grupos grandes (3 a 24 en la ficha pública).
- Dinámica de sesión: partidas rápidas, alta rejugabilidad por palabras/categorías.
- UX orientada a fiestas: reglas simples, entrada rápida, foco en interacción verbal.

## Señales de negocio observadas
- Modelo: anuncios + compras dentro de app.
- Fricción en reseñas: anuncios frecuentes y categorías bloqueadas.
- Posicionamiento: juego social casual, apto para reuniones y videollamadas.

## Competidores del género (Google Play search)
- Imposter Who? - Word Game
- Play Imposter Party
- Impostor – Party Game
- Imposter Game: Who Is
- Otros clones del formato “find/who is the impostor”

## Decisiones del fork
- No se copian nombres, arte ni textos del producto original.
- Se implementa producto nuevo: **Impostor**.
- Diferenciadores:
  - 100% local (offline vía PWA, sin backend)
  - Packs de palabras curados en español mexicano
  - Packs +18 para adultos
  - Sistema de votación con puntos y partida completa
  - UI moderna, responsive, instalable como app
