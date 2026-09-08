import fs from 'fs';
let html = fs.readFileSync('admin-page.html', 'utf8');

html = html.replace(/<div v-for="\\(skill, index\\) in data\.skills".*?<!-- End of Skill Editor -->\s*<\/div>\s*<!-- Skill Live Preview Right Side -->.*?<\/iframe>\s*<\/div>\s*<\/div>\s*<\/div>/s, `
        <div v-for="(skill, index) in data.skills" :key="'s'+index" class="bg-white rounded-lg shadow-sm border mb-6 relative overflow-hidden">
          <button @click="removeSkill(index)" class="absolute top-4 right-4 text-red-500 hover:text-red-700 z-10">
            <i class="bx bx-trash text-xl"></i>
          </button>
          
          <div class="grid grid-cols-1 lg:grid-cols-2">
            <!-- Editor Left Side -->
            <div class="col-span-1 p-6">
              <div class="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input v-model="skill.name" type="text" class="w-full border rounded p-2">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Icon (Boxicons class)</label>
                  <div class="flex items-center">
                    <div class="bg-gray-100 border border-r-0 rounded-l flex items-center justify-center w-10 h-10 text-gray-600">
                      <i :class="['bx', skill.icon, 'text-xl']"></i>
                    </div>
                    <input v-model="skill.icon" type="text" class="w-full border rounded-r p-2 h-10" placeholder="e.g. bx-code-block">
                  </div>
                </div>
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea v-model="skill.description" rows="2" class="w-full border rounded p-2"></textarea>
              </div>
              
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <div v-for="(tag, tIndex) in skill.tags" :key="'st'+tIndex" class="flex items-center bg-gray-100 border rounded pl-2">
                    <i :class="['bx', tag.icon, 'text-gray-500 mr-1']"></i>
                    <input v-model="tag.icon" placeholder="Icon class" class="w-24 bg-transparent text-xs outline-none py-1">
                    <input v-model="tag.name" placeholder="Name" class="w-24 bg-transparent text-xs font-semibold outline-none py-1 border-l pl-2">
                    <button @click="skill.tags.splice(tIndex, 1)" class="text-red-500 px-2 hover:bg-red-100 rounded-r"><i class="bx bx-x"></i></button>
                  </div>
                  <button @click="skill.tags.push({icon: '', name: ''})" class="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">+ Add Tag</button>
                </div>
              </div>
            </div>
            
            <!-- Skill Live Preview Right Side -->
            <div class="col-span-1 border-l pl-8 flex flex-col items-center justify-center bg-gray-50 p-6">
              <p class="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4 text-center">Live Preview</p>
              <div class="w-full max-w-sm">
                <iframe :srcdoc="getSkillPreview(skill)" class="w-full h-[250px] border-0 bg-transparent rounded-lg shadow-sm overflow-hidden pointer-events-none"></iframe>
              </div>
            </div>
          </div>
        </div>
        
        <button @click="addSkill" class="w-full border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-500 py-4 rounded-lg flex items-center justify-center font-medium transition mb-10">
          <i class="bx bx-plus text-xl mr-2"></i> Add New Skill
        </button>
`);

// Fix Projects block
html = html.replace(/<div v-for="\\(project, index\\) in data\.projects".*?<!-- Project Live Preview Right Side -->.*?<\/iframe>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/s, `
        <div v-for="(project, index) in data.projects" :key="'p'+index" class="bg-white rounded-lg shadow-sm border mb-6 relative overflow-hidden">
          <button @click="removeProject(index)" class="absolute top-4 right-4 text-red-500 hover:text-red-700 z-10">
            <i class="bx bx-trash text-xl"></i>
          </button>
          
          <div class="grid grid-cols-1 lg:grid-cols-2">
            <!-- Editor Left Side -->
            <div class="col-span-1 p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input v-model="project.title" type="text" class="w-full border rounded p-2">
                </div>
                
                <div class="col-span-1 md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Project Screenshot</label>
                  <div class="flex items-center gap-2">
                    <input v-model="project.image" type="text" placeholder="URL or click Upload" class="flex-1 border rounded p-2 h-10">
                    <button type="button" @click="openCropperTrigger(index, $event)" class="bg-gray-800 text-white hover:bg-gray-900 px-4 py-2 rounded h-10 text-sm whitespace-nowrap flex items-center shadow-sm">
                      <i class="bx bx-cloud-upload text-lg mr-1"></i> Upload Image
                    </button>
                    <input type="file" accept="image/*" @change="onFileSelected($event, index)" class="hidden">
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Link (leave empty if none)</label>
                  <input v-model="project.link" type="text" class="w-full border rounded p-2">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Link Text (e.g., View Project)</label>
                  <input v-model="project.linkText" type="text" class="w-full border rounded p-2">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Link Icon (Boxicons class)</label>
                  <div class="flex items-center">
                    <div class="bg-gray-100 border border-r-0 rounded-l flex items-center justify-center w-10 h-10 text-gray-600">
                      <i :class="['bx', project.linkIcon, 'text-xl']"></i>
                    </div>
                    <input v-model="project.linkIcon" type="text" class="w-full border rounded-r p-2 h-10">
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status (e.g., Hibernating)</label>
                  <input v-model="project.status" type="text" class="w-full border rounded p-2">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Card Icon (Boxicons class)</label>
                  <div class="flex items-center">
                    <div class="bg-gray-100 border border-r-0 rounded-l flex items-center justify-center w-10 h-10 text-gray-600">
                      <i :class="['bx', project.icon, 'text-xl']"></i>
                    </div>
                    <input v-model="project.icon" type="text" class="w-full border rounded-r p-2 h-10">
                  </div>
                </div>
                <div class="flex items-center pt-6">
                  <input v-model="project.featured" type="checkbox" class="mr-2 h-5 w-5 text-blue-600">
                  <label class="text-sm font-medium text-gray-700">Featured (Shows Star badge)</label>
                </div>
              </div>
              
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea v-model="project.description" rows="3" class="w-full border rounded p-2"></textarea>
              </div>
              
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Technologies (Tags)</label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <div v-for="(tag, tIndex) in project.tags" :key="tIndex" class="flex items-center bg-gray-100 border rounded pl-2">
                    <i :class="['bx', tag.icon, 'text-gray-500 mr-1']"></i>
                    <input v-model="tag.icon" placeholder="Icon class" class="w-24 bg-transparent text-xs outline-none py-1">
                    <input v-model="tag.name" placeholder="Name" class="w-24 bg-transparent text-xs font-semibold outline-none py-1 border-l pl-2">
                    <button @click="project.tags.splice(tIndex, 1)" class="text-red-500 px-2 hover:bg-red-100 rounded-r"><i class="bx bx-x"></i></button>
                  </div>
                  <button @click="project.tags.push({icon: '', name: ''})" class="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">+ Add Tag</button>
                </div>
              </div>
            </div>

            <!-- Project Live Preview Right Side -->
            <div class="col-span-1 border-l pl-8 flex flex-col items-center justify-center bg-gray-50 p-6">
              <p class="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4 text-center">Live Preview</p>
              <div class="w-full max-w-[380px] bg-slate-900 p-6 rounded-xl shadow-inner border border-slate-700 relative flex items-center justify-center">
                <iframe :srcdoc="getProjectPreview(project)" class="w-full h-[480px] border-0 bg-transparent overflow-hidden pointer-events-none scale-90 origin-top"></iframe>
              </div>
            </div>
          </div>
        </div>
`);

fs.writeFileSync('admin-page.html', html);
console.log("Fixed!");
