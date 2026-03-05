const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
let scriptMatch = fs.readFileSync('src/main.js', 'utf8');

// Strip ES6 imports for eval
scriptMatch = scriptMatch.replace(/^import .*$/gm, '');

// Also mock localWords and themes since they might be missing now
scriptMatch = `
window.localWords = {aleatorio: [['test1', 'test2']]};
window.themes = [{key: 'aleatorio', label: 'Aleatorio', adult: false}];
const localWords = window.localWords;
const themes = window.themes;
` + scriptMatch;

const virtualConsole = new jsdom.VirtualConsole();
virtualConsole.on("error", (e) => { });
virtualConsole.on("jsdomError", (e) => { });

const dom = new JSDOM(html, {
    url: "http://localhost/",
    runScripts: "dangerously",
    virtualConsole
});

dom.window.console = {
    log: console.log,
    warn: console.warn,
    error: console.error
};

dom.window.onerror = function (msg, url, line, col, error) {
    console.error("PAGE ONERROR:", msg);
};

try {
    dom.window.eval(scriptMatch);
    console.log("Script executed cleanly!");
} catch (e) {
    console.error("EVAL CATCH ERROR:", e);
}
