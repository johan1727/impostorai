const themes = [
    { key: "adulto", label: "+18 \uD83D\uDD25", adult: true },
    { key: "peda", label: "\uD83C\uDF7B Peda", adult: true }
];

const categoryStyles = {
    adulto: { color: "#ff4757", icon: "\u{1F51E}" },
    peda: { color: "#feca57", icon: "\u{1F37B}" },
    default: { color: "#c8b8d8", icon: "\u2728" }
};

for (const t of themes) {
    try {
        const style = categoryStyles[t.key] || categoryStyles.default;
        const cleanLabel = t.label.replace(/[\u{1F525}\u{1F37B}\u{1F51E}\u{1F4E6}]/gu, "").trim();
        console.log(`Rendered ${t.key}: Label='${cleanLabel}', Icon='${style.icon}'`);
    } catch (e) {
        console.error(`Error on ${t.key}:`, e);
    }
}
