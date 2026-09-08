import fs from 'fs';

let html = fs.readFileSync('admin-page.html', 'utf8');

html = html.replace(
  /<div>\s*<label class="block text-sm font-medium text-gray-700 mb-1">Image URL<\/label>\s*<input v-model="project.image" type="text" class="w-full border rounded p-2">\s*<\/div>/,
  `          <div class="col-span-1 md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Project Screenshot</label>
            <div class="flex items-center gap-2">
              <input v-model="project.image" type="text" placeholder="URL or click Upload" class="flex-1 border rounded p-2 h-10">
              <button type="button" @click="openCropperTrigger(index, $event)" class="bg-gray-800 text-white hover:bg-gray-900 px-4 py-2 rounded h-10 text-sm whitespace-nowrap flex items-center shadow-sm">
                <i class='bx bx-cloud-upload text-lg mr-1'></i> Upload Image
              </button>
              <input type="file" accept="image/*" @change="onFileSelected($event, index)" class="hidden">
            </div>
          </div>`
);

fs.writeFileSync('admin-page.html', html);
console.log('Fixed Project Screenshot field');
