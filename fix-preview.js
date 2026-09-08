import fs from 'fs';
let html = fs.readFileSync('admin-page.html', 'utf8');

// Fix the layout classes for Skill Preview container
html = html.replace(
  /<div class="col-span-1 border-l pl-8 flex flex-col items-center justify-center bg-gray-50 p-6">/g,
  '<div class="col-span-1 lg:border-l lg:pl-8 mt-6 lg:mt-0 flex flex-col items-center justify-center bg-gray-50 p-4 lg:p-6 rounded-b-lg lg:rounded-bl-none lg:rounded-r-lg">'
);

// Fix the iframe and container for Project Preview
html = html.replace(
  /<div class="w-full max-w-\[380px\] bg-slate-900 p-6 rounded-xl shadow-inner border border-slate-700 relative flex items-center justify-center">.*?<\/iframe>\s*<\/div>/s,
  `<div class="w-full max-w-[380px] bg-slate-900 p-2 sm:p-6 rounded-xl shadow-inner border border-slate-700 relative flex items-center justify-center overflow-hidden">
                <iframe :srcdoc="getProjectPreview(project)" class="w-full h-[400px] sm:h-[480px] border-0 bg-transparent overflow-hidden pointer-events-none"></iframe>
              </div>`
);

// Fix the iframe and container for Skill Preview
html = html.replace(
  /<div class="w-full max-w-sm">\s*<iframe :srcdoc="getSkillPreview\(skill\)" class="w-full h-\[250px\] border-0 bg-transparent rounded-lg shadow-sm overflow-hidden pointer-events-none"><\/iframe>\s*<\/div>/s,
  `<div class="w-full max-w-sm flex justify-center">
                <iframe :srcdoc="getSkillPreview(skill)" class="w-full max-w-[340px] h-[220px] border-0 bg-transparent rounded-lg shadow-sm overflow-hidden pointer-events-none"></iframe>
              </div>`
);

// Fix the inner style injected into Project Preview
html = html.replace(
  /\.project-card \{ margin: 0; transform: scale\(1\.1\); transform-origin: center; box-shadow: 0 10px 40px rgba\(0,0,0,0\.5\); \}/,
  `.project-card { margin: 0; width: 100%; max-width: 340px; flex: none; box-shadow: 0 10px 40px rgba(0,0,0,0.5); transform: none !important; }`
);

// Fix the inner style injected into Skill Preview
html = html.replace(
  /\.skill-card \{ margin: 0; width: 100%; max-width: 400px; border: 1px solid rgba\(255,255,255,0\.1\); \}/,
  `.skill-card { margin: 0; width: 100%; max-width: 340px; border: 1px solid rgba(255,255,255,0.1); }`
);

fs.writeFileSync('admin-page.html', html);
console.log("Fixed preview!");
