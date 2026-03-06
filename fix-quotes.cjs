const fs = require('fs');
let code = fs.readFileSync('src/main.js', 'utf8');
const lines = code.split('\n');
// Fix line 274 (0-indexed: 273) which has escaped quotes
lines[273] = '    ["sacar la sopa", "contar el chisme"], ["tener feria", "tener billete"], ["nadaqueveriento", "random"]';
// Fix indentation of memes line (276 in file, 0-indexed: 275)
if (lines[275] && lines[275].trim().startsWith('memes:')) {
    lines[275] = '  memes: [';
}
code = lines.join('\n');
fs.writeFileSync('src/main.js', code);
console.log('Fixed line 274 quotes and memes indentation');
