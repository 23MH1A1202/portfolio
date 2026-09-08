const fs = require('fs');

let html = fs.readFileSync('admin-page.html', 'utf8');

// 1. Add CropperJS CSS
html = html.replace('</head>', `  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css" />\n</head>`);

// 2. Adjust Layouts to Grid
html = html.replace(
  /<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">/g, 
  `<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">\n<div class="col-span-1 space-y-4">\n<div class="grid grid-cols-1 md:grid-cols-2 gap-4">`
);

// We'll replace the structural parts using a regex or simple string manipulation.
