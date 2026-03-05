const fs = require('fs');
const js = fs.readFileSync('src/main.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

const regex = /getElementById\(['"]([^'"]+)['"]\)/g;
let match;
while ((match = regex.exec(js)) !== null) {
    const id = match[1];
    if (!html.includes(`id="${id}"`)) {
        console.log(`MISSING ID IN HTML: ${id}`);
    }
}
console.log("Scan complete");
