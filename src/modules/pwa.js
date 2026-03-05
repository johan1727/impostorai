// ============= PWA SERVICE WORKER & INSTALL PROMPT =============
export function initPWA(showToast) {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("/sw.js").then((reg) => {
                // Check for updates every 30 min
                setInterval(() => reg.update(), 30 * 60 * 1000);
            }).catch((err) => console.warn("SW registration failed:", err));
        });
    }

    let deferredInstallPrompt = null;
    const installBanner = document.getElementById("installBanner");
    const installBtn = document.getElementById("installBtn");
    const installDismissBtn = document.getElementById("installDismissBtn");
    const INSTALL_DISMISSED_KEY = "impostorInstallDismissed";

    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent)
            || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
            || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
    }
    function isInStandaloneMode() {
        return window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
    }
    function isIOSSafari() {
        // True only in real Safari, not Chrome/Firefox/in-app browsers on iOS
        const ua = navigator.userAgent;
        return isIOS() && /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(ua);
    }

    // Android / Chrome: capture beforeinstallprompt
    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
        if (!sessionStorage.getItem(INSTALL_DISMISSED_KEY) && installBanner) {
            installBanner.classList.remove("hidden");
            installBanner.classList.add("install-android");
        }
    });

    window.addEventListener("appinstalled", () => {
        if (installBanner) installBanner.classList.add("hidden");
        deferredInstallPrompt = null;
        showToast("\u00a1App instalada! \ud83c\udf89");
    });

    // Show iOS install instructions if applicable
    function showIOSInstallHint() {
        if (!isIOS() || isInStandaloneMode()) return;
        if (sessionStorage.getItem(INSTALL_DISMISSED_KEY)) return;
        if (!installBanner) return;

        // Update instructions text based on browser
        const iosText = installBanner.querySelector(".install-ios-text");
        if (iosText) {
            if (isIOSSafari()) {
                iosText.innerHTML = 'Toca <strong>Compartir</strong> <span class="ios-share-icon">\u{1F4E4}</span> y luego <strong>"Agregar a pantalla de inicio"</strong>.';
            } else {
                iosText.innerHTML = 'Abre en <strong>Safari</strong> para instalar: toca <span class="ios-share-icon">\u{1F4E4}</span> → <strong>"Agregar a pantalla de inicio"</strong>.';
            }
        }

        installBanner.classList.remove("hidden");
        installBanner.classList.add("install-ios");
    }

    if (installBtn) {
        installBtn.addEventListener("click", async () => {
            if (deferredInstallPrompt) {
                deferredInstallPrompt.prompt();
                const { outcome } = await deferredInstallPrompt.userChoice;
                if (outcome === "accepted") showToast("\u00a1Instalando app!");
                deferredInstallPrompt = null;
                if (installBanner) installBanner.classList.add("hidden");
            }
        });
    }
    if (installDismissBtn) {
        installDismissBtn.addEventListener("click", () => {
            if (installBanner) installBanner.classList.add("hidden");
            sessionStorage.setItem(INSTALL_DISMISSED_KEY, "1");
        });
    }

    // Show iOS hint after short delay on first visit
    setTimeout(() => showIOSInstallHint(), 2500);
}
