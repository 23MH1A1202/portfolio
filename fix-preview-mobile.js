import fs from 'fs';
let html = fs.readFileSync('admin-page.html', 'utf8');

html = html.replace(
  /\.project-card \{ margin: 0; width: 100%; max-width: 340px; flex: none; box-shadow: 0 10px 40px rgba\(0,0,0,0\.5\); transform: none !important; \}/,
  `.project-card { margin: 0; width: 340px !important; flex: none !important; max-width: 100% !important; box-shadow: 0 10px 40px rgba(0,0,0,0.5); transform: none !important; }`
);

html = html.replace(
  /\.skill-card \{ margin: 0; width: 100%; max-width: 340px; border: 1px solid rgba\(255,255,255,0\.1\); \}/,
  `.skill-card { margin: 0; width: 340px !important; flex: none !important; max-width: 100% !important; border: 1px solid rgba(255,255,255,0.1); }`
);

fs.writeFileSync('admin-page.html', html);
console.log("Fixed mobile vw bug inside iframe!");
