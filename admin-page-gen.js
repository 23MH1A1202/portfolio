import fs from 'fs';

let html = fs.readFileSync('admin-page.html', 'utf8');

// 1. Add Cropper.js CSS & JS to HEAD
html = html.replace('</head>', `
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>
</head>`);

// 2. Wrap main container to be wider since we have side-by-side previews
html = html.replace('max-w-4xl', 'max-w-7xl');

// 3. SKILLS Section - Split into Editor and Live Preview
html = html.replace(
  '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">',
  `<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4">
    <!-- Editor Left Side -->
    <div class="col-span-1">
      <div class="grid grid-cols-1 gap-4 mb-4">`
);

// Close Editor and Add Live Preview for Skills
html = html.replace(
  `<!-- Projects -->`,
  `<!-- End of Skill Editor -->
    </div>
    
    <!-- Skill Live Preview Right Side -->
    <div class="col-span-1 border-l pl-8 flex items-center justify-center bg-gray-50 rounded-r-lg">
      <div class="w-full max-w-sm">
        <p class="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4 text-center">Live Preview</p>
        <iframe :srcdoc="getSkillPreview(skill)" class="w-full h-[250px] border-0 bg-transparent rounded-lg shadow-sm overflow-hidden pointer-events-none"></iframe>
      </div>
    </div>
  </div>
  <!-- Projects -->`
);

// 4. PROJECTS Section - Split into Editor and Live Preview
html = html.replace(
  `        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>`,
  `        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Editor Left Side -->
          <div class="col-span-1">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>`
);

// Image URL field with Upload Button
html = html.replace(
  `          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input v-model="project.image" type="text" class="w-full border rounded p-2">
          </div>`,
  `          <div class="col-span-1 md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Project Screenshot</label>
            <div class="flex items-center gap-2">
              <input v-model="project.image" type="text" placeholder="URL or click Upload" class="flex-1 border rounded p-2 h-10">
              <button @click="openCropper(index)" class="bg-gray-800 text-white hover:bg-gray-900 px-4 py-2 rounded h-10 text-sm whitespace-nowrap flex items-center shadow-sm">
                <i class='bx bx-cloud-upload text-lg mr-1'></i> Upload Image
              </button>
              <input type="file" accept="image/*" :ref="'fileInput' + index" @change="onFileSelected($event, index)" class="hidden">
            </div>
          </div>`
);

// Close Project Editor and Add Live Preview for Projects
html = html.replace(
  `              <button @click="project.tags.push({icon: '', name: ''})" class="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">+ Add Tag</button>
            </div>
          </div>
        </div>
        
        <button @click="addProject"`,
  `              <button @click="project.tags.push({icon: '', name: ''})" class="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">+ Add Tag</button>
            </div>
          </div>
          </div>
          <!-- Project Live Preview Right Side -->
          <div class="col-span-1 border-l pl-8 flex flex-col items-center justify-center bg-gray-50 rounded-r-lg">
            <p class="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4 text-center">Live Preview</p>
            <div class="w-full max-w-[380px] bg-slate-900 p-6 rounded-xl shadow-inner border border-slate-700 relative flex items-center justify-center">
              <iframe :srcdoc="getProjectPreview(project)" class="w-full h-[480px] border-0 bg-transparent overflow-hidden pointer-events-none scale-90 origin-top"></iframe>
            </div>
          </div>
        </div>
        
        <button @click="addProject"`
);

// 5. Add Cropper Modal UI to the bottom of #app
html = html.replace(
  `    </div>
  </div>

  <!-- Load Firebase config -->`,
  `    </div>

    <!-- Cropper Modal -->
    <div v-if="showCropper" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-xl w-full max-w-4xl flex flex-col max-h-[90vh] shadow-2xl">
         <div class="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
            <h3 class="text-xl font-bold text-gray-800"><i class='bx bx-crop mr-2'></i>Crop Project Screenshot (16:9)</h3>
            <button @click="closeCropper" class="text-gray-500 hover:text-red-500 transition"><i class='bx bx-x text-3xl'></i></button>
         </div>
         <div class="flex-1 overflow-hidden p-6 bg-gray-100 flex items-center justify-center min-h-[400px]">
            <img id="cropperImage" :src="cropperSrc" class="max-w-full max-h-[60vh] object-contain shadow-md rounded">
         </div>
         <div class="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-xl">
            <button @click="closeCropper" class="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition">Cancel</button>
            <button @click="uploadCroppedImage" :disabled="uploadingImage" class="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center shadow">
               <i v-if="uploadingImage" class="bx bx-loader-alt bx-spin mr-2"></i>
               {{ uploadingImage ? 'Uploading to Firebase...' : 'Crop & Upload' }}
            </button>
         </div>
      </div>
    </div>
  </div>

  <!-- Load Firebase config -->`
);

// 6. Inject Script logic
const scriptAdditions = `
    import { getStorage, ref as storageRef, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";
`;

html = html.replace(
  `import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";`,
  `import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";\n    import { getStorage, ref as storageRef, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";`
);

html = html.replace(
  `const auth = getAuth(app);`,
  `const auth = getAuth(app);\n        const storage = getStorage(app);`
);

const setupAdditions = `
            // Image Upload & Cropping State
            const showCropper = ref(false);
            const cropperSrc = ref('');
            const uploadingImage = ref(false);
            let cropperInstance = null;
            const activeProjectIndex = ref(null);

            const openCropper = (index) => {
              const fileInput = document.querySelector('input[type="file"][data-idx="' + index + '"]') || Object.values(arguments[1] || {}).find(x => x && x.$el) || null;
              // using a trick: Vue template refs inside v-for are arrays, we can just trigger native click on the DOM element next to the button
            };

            const onFileSelected = (event, index) => {
              const file = event.target.files[0];
              if (!file) return;
              
              const reader = new FileReader();
              reader.onload = (e) => {
                cropperSrc.value = e.target.result;
                activeProjectIndex.value = index;
                showCropper.value = true;
                
                // Initialize cropper after DOM update
                setTimeout(() => {
                  const imageElement = document.getElementById('cropperImage');
                  if (cropperInstance) cropperInstance.destroy();
                  cropperInstance = new Cropper(imageElement, {
                    aspectRatio: 340 / 180, // strict 16:9 equivalent for the project cards
                    viewMode: 1,
                    autoCropArea: 1,
                  });
                }, 100);
              };
              reader.readAsDataURL(file);
              event.target.value = ''; // reset
            };

            const closeCropper = () => {
              showCropper.value = false;
              if (cropperInstance) {
                cropperInstance.destroy();
                cropperInstance = null;
              }
              cropperSrc.value = '';
            };

            const uploadCroppedImage = async () => {
              if (!cropperInstance || activeProjectIndex.value === null) return;
              
              uploadingImage.value = true;
              try {
                // Get cropped canvas as base64 string
                const canvas = cropperInstance.getCroppedCanvas({
                  width: 680,
                  height: 360,
                  imageSmoothingQuality: 'high'
                });
                const base64Image = canvas.toDataURL('image/jpeg', 0.85);
                
                // Upload to Firebase Storage
                const fileName = 'projects/project_' + Date.now() + '.jpg';
                const imageRef = storageRef(storage, fileName);
                
                await uploadString(imageRef, base64Image, 'data_url');
                const downloadURL = await getDownloadURL(imageRef);
                
                // Update Vue state
                data.value.projects[activeProjectIndex.value].image = downloadURL;
                
                closeCropper();
              } catch (e) {
                console.error("Upload error:", e);
                if (e.code === 'storage/unauthorized') {
                  alert("Upload Denied: You need to enable Firebase Storage rules in the Firebase Console!\\n\\n1. Go to Firebase Console > Storage\\n2. Click 'Get Started'\\n3. Set rules to allow authenticated users to write.");
                } else {
                  alert("Failed to upload image: " + e.message);
                }
              } finally {
                uploadingImage.value = false;
              }
            };

            // Live Preview Generators
            const getProjectPreview = (p) => {
              return \`
                <html>
                  <head>
                    <link rel="stylesheet" href="/style.css">
                    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
                    <style>
                      body { 
                        margin: 0; padding: 20px; 
                        display: flex; align-items: center; justify-content: center; 
                        background: transparent; 
                        color: #f8fafc;
                        /* force light mode to be dark mode for preview box if needed */
                      }
                      .project-card { margin: 0; transform: scale(1.1); transform-origin: center; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
                    </style>
                  </head>
                  <body>
                    <div class="project-card glow-active">
                      <div class="project-image">
                        <img src="\${p.image || 'https://via.placeholder.com/340x180?text=No+Image'}" alt="Preview">
                      </div>
                      <div class="project-card-header">
                        <div class="project-card-icon"><i class='bx \${p.icon || 'bx-code'}'></i></div>
                        <div class="project-card-links">
                          \${p.status ? \`<span style="font-size:0.72rem; color:#f59e0b; background:rgba(255,165,0,0.15); padding:2px 7px; border-radius:999px; font-weight:600;"><i class='bx bx-moon'></i> \${p.status}</span>\` : ''}
                          \${p.link ? \`<a href="#" class="icon-link"><i class='bx \${p.linkIcon || 'bx-link'}'></i> \${p.linkText || 'Link'}</a>\` : ''}
                        </div>
                      </div>
                      <h3 class="project-card-title">
                        \${p.title || 'Project Title'} 
                        \${p.featured ? \`<span style="font-size:0.7rem; color:#14b8a6; border:1px solid #14b8a6; padding:2px 6px; border-radius:4px; margin-left:5px; vertical-align:middle;"><i class='bx bxs-star'></i> Featured</span>\` : ''}
                      </h3>
                      <p class="project-card-desc">\${p.description || 'Description'}</p>
                      <div class="project-card-tags">
                        \${(p.tags || []).map(t => \`<span class="tag"><i class='bx \${t.icon}'></i> \${t.name}</span>\`).join('')}
                      </div>
                    </div>
                  </body>
                </html>
              \`;
            };

            const getSkillPreview = (s) => {
              return \`
                <html>
                  <head>
                    <link rel="stylesheet" href="/style.css">
                    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
                    <style>
                      body { 
                        margin: 0; padding: 20px; 
                        display: flex; align-items: center; justify-content: center; 
                        background: #0f172a; /* Force dark bg for contrast */
                        border-radius: 12px;
                      }
                      .skill-card { margin: 0; width: 100%; max-width: 400px; border: 1px solid rgba(255,255,255,0.1); }
                    </style>
                  </head>
                  <body>
                    <div class="skill-card animate-fade-up" style="opacity:1; transform:none;">
                      <div class="skill-icon"><i class='bx \${s.icon || 'bx-code'}'></i></div>
                      <div class="skill-name">\${s.name || 'Skill Name'}</div>
                      <div class="skill-desc">\${s.description || 'Description goes here'}</div>
                      <div class="skill-tags">
                        \${(s.tags || []).map(t => \`<span class="tag"><i class='bx \${t.icon}'></i> \${t.name}</span>\`).join('')}
                      </div>
                    </div>
                  </body>
                </html>
              \`;
            };
`;

html = html.replace(
  `const data = ref({ projects: [], skills: [], contact: {} });`,
  `const data = ref({ projects: [], skills: [], contact: {} });\n${setupAdditions}`
);

html = html.replace(
  `const addProject = () => {`,
  `const openCropperTrigger = (index, event) => {
              const input = event.target.nextElementSibling;
              if (input) input.click();
            };
            const addProject = () => {`
);

// fix the button trigger
html = html.replace(
  `@click="openCropper(index)"`,
  `@click="openCropperTrigger(index, $event)"`
);

html = html.replace(
  `return {
              user,`,
  `return {
              user,
              showCropper, cropperSrc, uploadingImage, onFileSelected, closeCropper, uploadCroppedImage, getProjectPreview, getSkillPreview, openCropperTrigger,`
);

fs.writeFileSync('admin-page.html', html);
console.log('Successfully patched admin-page.html');
