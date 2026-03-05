// ============= UI UTILS =============

export function escapeHtml(str) {
    if (typeof str !== "string") return str;
    return str.replace(/[&<>'"]/g, t => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[t]));
}

// ============= TOAST =============
let _toastTimer = null;
export function showToast(msg, type = "success") {
    const c = document.getElementById("toastContainer");
    if (!c) return;
    const old = c.querySelector(".toast");
    if (old) old.remove();
    if (_toastTimer) clearTimeout(_toastTimer);
    const icons = { error: "❌", loading: "⏳", success: "✅" };
    const t = document.createElement("div");
    t.className = `toast toast-${type}`;
    t.innerHTML = `<span>${icons[type] || "✅"}</span><span>${escapeHtml(msg)}</span>`;
    c.appendChild(t);
    requestAnimationFrame(() => t.classList.add("toast-show"));
    if (type !== "loading") {
        _toastTimer = setTimeout(() => {
            t.classList.remove("toast-show");
            setTimeout(() => t.remove(), 300);
        }, 3000);
    }
}

// ============= CUSTOM CONFIRM MODAL =============
export function showConfirmModal(message, onAccept, sfx) {
    if (sfx) sfx.alarm();
    const overlay = document.createElement("div");
    overlay.className = "confirm-modal-overlay";
    overlay.innerHTML = `
    <div class="confirm-modal">
      <p>${escapeHtml(message)}</p>
      <div class="confirm-actions">
        <button type="button" class="secondary" id="confirmCancelBtn">Cancelar</button>
        <button type="button" class="primary-action" id="confirmAcceptBtn">Aceptar</button>
      </div>
    </div>
  `;
    document.body.appendChild(overlay);

    const close = () => {
        if (sfx) sfx.click();
        overlay.remove();
    };

    overlay.querySelector("#confirmCancelBtn").addEventListener("click", close);
    overlay.querySelector("#confirmAcceptBtn").addEventListener("click", () => {
        close();
        onAccept();
    });
}

// ============= FULLSCREEN TOGGLE =============
export async function toggleFullscreen(fullscreenBtn) {
    const root = document.documentElement;
    try {
        if (!document.fullscreenElement) {
            if (root.requestFullscreen) await root.requestFullscreen();
            else if (root.webkitRequestFullscreen) await root.webkitRequestFullscreen();
            if (fullscreenBtn) fullscreenBtn.textContent = "⛶ Menos pantalla";
        } else {
            if (document.exitFullscreen) await document.exitFullscreen();
            else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
            if (fullscreenBtn) fullscreenBtn.textContent = "⛶ Pantalla completa";
        }
    } catch (err) {
        console.warn("Fullscreen no soportado.", err);
    }
}
