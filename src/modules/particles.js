// ============= PARTICLE BACKGROUND =============
export function initParticles(getState) {
    const canvas = document.getElementById("particleCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width, height;
    const particles = [];
    const PARTICLE_COUNT = 45;
    const COLORS = [
        "rgba(255, 123, 84, 0.35)",
        "rgba(224, 64, 251, 0.30)",
        "rgba(255, 182, 72, 0.28)",
        "rgba(0, 230, 118, 0.18)",
        "rgba(255, 71, 87, 0.22)"
    ];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.2 - 0.1,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            opacity: Math.random() * 0.6 + 0.2,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.02 + 0.005
        };
    }

    function init() {
        resize();
        particles.length = 0;
        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
    }

    function animate() {
        requestAnimationFrame(animate);
        // Pause rendering if in active game to preserve battery
        if (getState().gameActive) return;

        ctx.clearRect(0, 0, width, height);
        for (const p of particles) {
            p.x += p.speedX; p.y += p.speedY; p.pulse += p.pulseSpeed;
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;
            if (p.y < -10) p.y = height + 10;
            if (p.y > height + 10) p.y = -10;
            const co = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
            const cs = p.size * (0.8 + 0.2 * Math.sin(p.pulse));
            ctx.beginPath(); ctx.arc(p.x, p.y, cs, 0, Math.PI * 2);
            ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${co})`); ctx.fill();
            ctx.beginPath(); ctx.arc(p.x, p.y, cs * 3, 0, Math.PI * 2);
            ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${co * 0.15})`); ctx.fill();
        }
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 140, 90, ${(1 - dist / 120) * 0.08})`;
                    ctx.lineWidth = 0.5; ctx.stroke();
                }
            }
        }
    }
    window.addEventListener("resize", resize);
    init(); animate();
}
