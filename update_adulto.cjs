const fs = require('fs');

let content = fs.readFileSync('src/main.js', 'utf8');

// Find and replace only the adulto section
const adultPattern = /adulto:\s*\[\s*\[.*?\]\s*\],/s;

const newAdultoSection = `adulto: [
    ["resaca","cruda"],["tinder","bumble"],["ghostear","ignorar"],["friendzone","situationship"],
    ["hookup","encuentro"],["peda","fiesta"],["pololo","pareja"],["chamuyar","flirtear"],
    ["vibes","rollo"],["crush","obsesión"],["sexting","mensajes"],["infidelidad","engaño"],
    ["tórrido","ardiente"],["pecaminoso","prohibido"],["transgresión","aventura"],["lujuria","pasión"],
    ["morbo","deseo"],["embrague","besuqueo"],["conquista","seducción"],["onda","talante"],
    ["trago","shot"],["after","madrugada"],["drama","crisis"],["celos","posesividad"],
    ["ex","trauma"],["adrenalina","éxtasis"],["secreto","tabú"],["inhibición","liberación"],
    ["arrepentimiento","vergüenza"],["rebeldía","locura"],["desinhibición","sinceridad"],["vicio","hábito"]
  ],`;

if (adultPattern.test(content)) {
  content = content.replace(adultPattern, newAdultoSection);
  fs.writeFileSync('src/main.js', content, 'utf8');
  console.log('✅ Adulto theme updated successfully!');
} else {
  console.log('❌ Could not find adulto pattern');
}
