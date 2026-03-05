// ============= GAME CORE ENGINE =============

export function buildRoles(playerCount, impostorCount, whiteCount, secretWord, decoyWord) {
    const roles = [];
    for (let i = 0; i < impostorCount; i++) {
        roles.push({ role: "impostor", word: decoyWord, tip: "¡Eres el impostor! Usa esta palabra para camuflarte sin ser evidente." });
    }
    for (let i = 0; i < whiteCount; i++) {
        roles.push({ role: "agente fantasma", word: "???", tip: "No tienes palabra. Adivina el contexto y sobrevive. Si ganas, ganas doble." });
    }
    const civilCount = playerCount - impostorCount - whiteCount;
    for (let i = 0; i < civilCount; i++) {
        roles.push({ role: "civil", word: secretWord, tip: "Eres civil. Da pistas sutiles sobre tu palabra para encontrar al impostor." });
    }
    // Shuffle
    for (let i = roles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [roles[i], roles[j]] = [roles[j], roles[i]];
    }
    return roles;
}

export function createRoundState(config, pack) {
    const { playerCount, impostorCount, whiteCount, names, eliminatedPlayers, persistentRoles, persistentTheme, persistentSecretWord, persistentDecoyWord, theme } = config;

    if (persistentRoles) {
        const allRoles = persistentRoles;
        const roles = allRoles.filter(r => !eliminatedPlayers.includes(r.player));
        if (roles.length < 3) throw new Error("No quedan suficientes jugadores activos (mínimo 3).");
        return {
            createdAt: new Date().toISOString(),
            theme: persistentTheme,
            secretWord: persistentSecretWord,
            decoyWord: persistentDecoyWord,
            source: "local",
            roles,
            allRoles
        };
    }

    if (playerCount < 3 || playerCount > 24) throw new Error("Jugadores fuera de rango (3-24).");
    if (impostorCount < 1 || impostorCount > 3) throw new Error("Configura entre 1 y 3 impostores.");
    if (whiteCount < 0 || whiteCount > 2) throw new Error("Fantasma entre 0 y 2.");
    if (impostorCount + whiteCount >= playerCount) throw new Error("Impostores + fantasmas debe ser menor que jugadores.");
    if (impostorCount >= playerCount - whiteCount - 1) throw new Error("Debe haber al menos 2 civiles para una partida justa.");

    const allRoles = buildRoles(playerCount, impostorCount, whiteCount, pack.secretWord, pack.decoyWord);

    // Asignar nombres
    for (let i = 0; i < allRoles.length; i++) {
        allRoles[i].player = i;
        allRoles[i].name = names[i] || `Jugador ${i + 1}`;
    }

    const roles = allRoles.filter(r => !eliminatedPlayers.includes(r.player));
    return { createdAt: new Date().toISOString(), theme, ...pack, roles, allRoles, isNewGame: true };
}

// ============= TIMER CONTROLLER =============
export class Timer {
    constructor(onTick, onEnd) {
        this.totalSeconds = 120;
        this.seconds = 120;
        this.handle = null;
        this.onTick = onTick;
        this.onEnd = onEnd;
    }

    start() {
        if (this.handle) return;
        this.handle = setInterval(() => {
            this.seconds -= 1;
            this.onTick(this.seconds, this.totalSeconds);
            if (this.seconds <= 0) {
                this.pause();
                this.onEnd();
            }
        }, 1000);
    }

    pause() {
        if (this.handle) clearInterval(this.handle);
        this.handle = null;
    }

    reset(seconds = null) {
        this.pause();
        if (seconds !== null) {
            this.totalSeconds = seconds;
        }
        this.seconds = this.totalSeconds;
        this.onTick(this.seconds, this.totalSeconds);
    }

    setPreset(seconds) {
        this.reset(seconds);
    }

    get isRunning() {
        return this.handle !== null;
    }
}
