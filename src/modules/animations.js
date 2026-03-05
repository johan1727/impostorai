// ============= CONFETTI =============
export function launchConfetti() {
    const cv = document.getElementById("confettiCanvas");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    cv.width = window.innerWidth; cv.height = window.innerHeight;
    cv.style.display = "block";
    const cols = ["#ff4757", "#ff7b54", "#00e676", "#ffd600", "#e040fb", "#ff6b81", "#ffab40", "#69f0ae"];
    const ps = [];
    for (let i = 0; i < 120; i++) {
        ps.push({
            x: cv.width * 0.5 + (Math.random() - 0.5) * 300, y: cv.height * 0.5,
            vx: (Math.random() - 0.5) * 14, vy: Math.random() * -16 - 4,
            w: Math.random() * 8 + 3, h: Math.random() * 5 + 2,
            c: cols[Math.floor(Math.random() * cols.length)],
            r: Math.random() * 360, rs: (Math.random() - 0.5) * 12,
            g: 0.28 + Math.random() * 0.12, o: 1
        });
    }
    let f = 0;
    (function draw() {
        ctx.clearRect(0, 0, cv.width, cv.height);
        let alive = false;
        for (const p of ps) {
            p.x += p.vx; p.vy += p.g; p.y += p.vy;
            p.r += p.rs; p.vx *= 0.99;
            if (f > 50) p.o -= 0.018;
            if (p.o <= 0) continue;
            alive = true;
            ctx.save(); ctx.translate(p.x, p.y);
            ctx.rotate(p.r * Math.PI / 180);
            ctx.globalAlpha = Math.max(0, p.o);
            ctx.fillStyle = p.c;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        }
        f++;
        if (alive && f < 180) requestAnimationFrame(draw);
        else { ctx.clearRect(0, 0, cv.width, cv.height); cv.style.display = "none"; }
    })();
}
