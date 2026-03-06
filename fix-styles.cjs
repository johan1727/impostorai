const fs = require('fs');
let code = fs.readFileSync('src/main.js', 'utf8');

// Add 4 new category styles before adulto in categoryStyles
const oldAdulto = 'adulto: { color: "#ff4757", icon: "\\u{1F51E}", name: "+18" }';
const newEntries = `memes: { color: "#ffab40", icon: "\\u{1F923}", name: "Memes" },
    redes: { color: "#29b6f6", icon: "\\u{1F4F1}", name: "Redes" },
    videojuegos: { color: "#7e57c2", icon: "\\u{1F3AE}", name: "Videojuegos" },
    regiones: { color: "#ef5350", icon: "\\u{1F1F2}\\u{1F1FD}", name: "Regiones MX" },
    adulto: { color: "#ff4757", icon: "\\u{1F51E}", name: "+18" }`;

if (code.includes(oldAdulto)) {
    code = code.replace(oldAdulto, newEntries);
    fs.writeFileSync('src/main.js', code);
    console.log('Added 4 new category styles');
} else {
    console.log('Could not find adulto style entry');
}
