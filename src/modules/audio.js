// ============= SOUND EFFECTS (Web Audio API) =============
export const SFX = (() => {
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
